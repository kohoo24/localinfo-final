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

    // URL 구성
    const apiUrl = `${BASE_URL}?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;
    console.log("[API] Requesting URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/xml",
        },
      });

      console.log("[API] External API response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `External API error: ${response.status} ${response.statusText}`
        );
      }

      const xmlText = await response.text();
      console.log("[API] Response received:", xmlText.substring(0, 200));

      // XML 응답이 유효한지 확인
      if (!xmlText.includes("<?xml")) {
        throw new Error("Invalid XML response");
      }

      return new NextResponse(xmlText, {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (fetchError: unknown) {
      console.error("[API] Fetch error:", fetchError);
      throw new Error(
        `API 호출 실패: ${
          fetchError instanceof Error ? fetchError.message : "알 수 없는 오류"
        }`
      );
    }
  } catch (error: unknown) {
    console.error("[API] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: errorMessage,
        type: "known",
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
