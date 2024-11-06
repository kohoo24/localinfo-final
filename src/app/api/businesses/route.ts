import { NextRequest, NextResponse } from "next/server";

const API_KEY = "DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D";
const BASE_URL = "https://www.localdata.go.kr/platform/rest/TO0/openDataApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const localCode = searchParams.get("localCode");

    if (!localCode) {
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    const apiUrl = `${BASE_URL}?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
