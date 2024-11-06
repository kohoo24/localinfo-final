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

    // HTTPS URL 사용 및 인코딩된 API 키 사용
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

    console.log("[API] Requesting URL:", apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    console.log("[API] External API response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`
      );
    }

    const xmlText = await response.text();
    console.log("[API] Raw XML Response:", xmlText);

    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("[API] Error:", error);

    if (error instanceof Error) {
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
