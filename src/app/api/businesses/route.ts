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

    const API_KEY = "DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D";
    const apiUrl = `https://www.localdata.go.kr/platform/rest/TO0/openDataApi?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;

    console.log("[API] Requesting URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    console.log("[API] External API response status:", response.status);

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[API] Error:", error);

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "server_error",
      },
      { status: 500 }
    );
  }
}
