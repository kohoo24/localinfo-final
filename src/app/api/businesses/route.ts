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

    // API 키에서 특수문자 처리
    const API_KEY = "DledgRvCFAm2=BohKYGRfrzzl06z1bKP1jRdjXn/uds=";

    // URL 구성 시 모든 파라미터 인코딩
    const params = new URLSearchParams({
      authKey: API_KEY,
      localCode: localCode,
      pageIndex: "1",
      pageSize: "10",
      resultType: "xml", // XML 형식 명시
    });

    const apiUrl = `https://www.localdata.go.kr/platform/rest/TO0/openDataApi?${params.toString()}`;

    console.log("[API] Requesting URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/xml",
        "Content-Type": "application/xml",
      },
    });

    console.log("[API] External API response status:", response.status);
    console.log(
      "[API] External API response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Error response:", errorText);
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.text();
    console.log("[API] Response preview:", data.substring(0, 200));

    // 응답이 HTML인지 확인
    if (data.trim().toLowerCase().startsWith("<!doctype html>")) {
      throw new Error("Received HTML instead of XML");
    }

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
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
