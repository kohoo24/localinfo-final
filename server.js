const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.get("/api/businesses", async (req, res) => {
  // ... 이전 코드와 동일
});

app.listen(port, () => {
  console.log(`[Server] Proxy server running on port ${port}`);
});
