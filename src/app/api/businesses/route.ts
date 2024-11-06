import { NextResponse } from "next/server";

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

    // API 키와 URL을 명시적으로 설정
    const API_KEY = "DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D";
    const url = `http://www.localdata.go.kr/platform/rest/TO0/openDataApi?authKey=${API_KEY}&localCode=${localCode}`;

    // node-fetch 스타일의 옵션 사용
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    // CORS 헤더 추가하여 응답
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    // 자세한 에러 정보 반환
    return NextResponse.json(
      {
        error: "API 호출 실패",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
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
