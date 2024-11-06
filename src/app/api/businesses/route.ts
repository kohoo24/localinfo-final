import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localCode = searchParams.get("localCode");

    // 하드코딩된 URL로 시도
    const url = `https://www.localdata.go.kr/platform/rest/TO0/openDataApi?authKey=DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D&localCode=${localCode}&pageIndex=1&pageSize=10`;

    const response = await fetch(url);
    const data = await response.text();

    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 });
  }
}
