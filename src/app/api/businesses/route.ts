import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const localCode = searchParams.get("localCode");

    console.log("[API] Request params:", {
      localCode,
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
    });

    if (!localCode) {
      console.log("[API] Error: No localCode provided");
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    // 공공데이터포털 API URL 구성
    const apiUrl = new URL(
      "https://www.localdata.go.kr/platform/rest/TO0/openDataApi"
    );

    // 필수 파라미터 추가
    apiUrl.searchParams.append(
      "authKey",
      process.env.NEXT_PUBLIC_API_KEY || ""
    );
    apiUrl.searchParams.append("localCode", localCode);
    apiUrl.searchParams.append("pageIndex", "1");
    apiUrl.searchParams.append("pageSize", "10");

    console.log("[API] Calling external API:", apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("[API] External API response status:", response.status);

    if (!response.ok) {
      console.error("[API] External API error:", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `외부 API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();
    console.log("[API] External API response:", data);

    // XML 응답을 JSON으로 변환
    return NextResponse.json({
      result: data,
      requestUrl: apiUrl.toString(),
      responseStatus: response.status,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[API] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        {
          error: "서버 오류가 발생했습니다.",
          details: error.message,
          type: "known",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "알 수 없는 오류가 발생했습니다.",
        type: "unknown",
      },
      { status: 500 }
    );
  }
}
