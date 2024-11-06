import { NextRequest, NextResponse } from "next/server";

// API 키를 서버 사이드에서만 접근 가능하도록 설정
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

    // API URL 구성 (서버 사이드에서)
    const apiUrl = `${BASE_URL}?authKey=${API_KEY}&localCode=${localCode}&pageIndex=1&pageSize=10`;

    const response = await fetch(apiUrl);
    const xmlText = await response.text();

    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
