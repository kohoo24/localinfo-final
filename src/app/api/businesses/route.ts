import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    const API_KEY = "DledgRvCFAm2=BohKYGRfrzzl06z1bKP1jRdjXn/uds=";
    const baseUrl = "https://www.localdata.go.kr/platform/rest/TO0/openDataApi";

    const params = new URLSearchParams({
      authKey: API_KEY,
      localCode: localCode,
      pageIndex: "1",
      pageSize: "10",
      type: "json",
    });

    const apiUrl = `${baseUrl}?${params.toString()}`;
    console.log("[API] Requesting:", apiUrl);

    const response = await fetch(apiUrl);
    console.log("[API] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("[API] Response data:", data);

    return NextResponse.json(data);
  } catch (error) {
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
