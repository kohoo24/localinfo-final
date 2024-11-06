import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localCode = searchParams.get("localCode");

    if (!localCode) {
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    const API_KEY = "DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D";
    const url = `https://www.localdata.go.kr/platform/rest/TO0/openDataApi?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "User-Agent": "Mozilla/5.0",
        },
        signal: controller.signal,
        next: { revalidate: 0 },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();

      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: unknown) {
    console.error("API Error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "API 호출 시간 초과",
          details: "서버 응답이 너무 오래 걸립니다.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "API 호출 실패",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 처리 추가
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
