const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["https://localinfo-final.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get("/api/businesses", async (req, res) => {
  try {
    const { localCode } = req.query;
    console.log("[Server] Received request with localCode:", localCode);

    if (!localCode) {
      return res.status(400).json({ error: "지역 코드가 필요합니다." });
    }

    const API_KEY = "DledgRvCFAm2=BohKYGRfrzzl06z1bKP1jRdjXn/uds=";
    const BASE_URL = "http://www.localdata.go.kr/platform/rest/TO0/openDataApi";
    const apiUrl = `${BASE_URL}?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;

    console.log("[Server] Requesting URL:", apiUrl);

    const response = await fetch(apiUrl);
    console.log("[Server] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.text();
    console.log("[Server] Response data preview:", data.substring(0, 200));

    res
      .set({
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      })
      .send(data);
  } catch (error) {
    console.error("[Server] Error:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      error: "API 호출 실패",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`[Server] Proxy server running on port ${port}`);
});
