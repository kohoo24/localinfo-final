import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localCode = searchParams.get("localCode");

    console.log("[API] Request received:", { localCode });

    if (!localCode) {
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    // URL 인코딩된 API 키 사용
    const API_KEY = encodeURIComponent(
      "DledgRvCFAm2=BohKYGRfrzzl06z1bKP1jRdjXn/uds="
    );
    const apiUrl = `https://www.localdata.go.kr/platform/rest/TO0/openDataApi?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;

    console.log("[API] Requesting URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      cache: "no-store",
    });

    console.log("[API] External API response status:", response.status);

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.text();
    console.log("[API] Response received:", {
      length: data.length,
      preview: data.substring(0, 200),
    });

    // 응답을 그대로 클라이언트에 전달
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[API] Error:", {
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
