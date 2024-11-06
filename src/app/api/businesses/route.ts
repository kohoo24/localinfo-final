import { NextRequest, NextResponse } from "next/server";

const API_KEY = "DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D";
const BASE_URL = "https://www.localdata.go.kr/platform/rest/TO0/openDataApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const localCode = searchParams.get("localCode");

    console.log("[API] Request received:", { localCode });

    if (!localCode) {
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    const apiUrl = `${BASE_URL}?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;
    console.log("[API] Requesting URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/xml",
      },
      next: { revalidate: 0 },
    });

    console.log("[API] External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] External API error response:", errorText);
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();
    console.log("[API] Response received, length:", data.length);
    console.log("[API] First 200 chars of response:", data.substring(0, 200));

    // XML 유효성 검사
    if (!data.includes("<?xml")) {
      console.error("[API] Invalid XML response:", data);
      throw new Error("Invalid XML response received");
    }

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: unknown) {
    console.error("[API] Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "server_error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
