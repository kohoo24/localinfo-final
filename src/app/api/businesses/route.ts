import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localCode = searchParams.get("localCode");

    console.log("[API] Received request for localCode:", localCode);

    if (!localCode) {
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    // API 키에서 특수문자 처리
    const API_KEY = encodeURIComponent(
      "DledgRvCFAm2=BohKYGRfrzzl06z1bKP1jRdjXn/uds="
    );
    const baseUrl = "https://www.localdata.go.kr/platform/rest/TO0/openDataApi";

    // URL 파라미터 구성
    const params = new URLSearchParams();
    params.append("authKey", API_KEY);
    params.append("localCode", localCode);
    params.append("pageIndex", "1");
    params.append("pageSize", "10");
    params.append("type", "json");

    const apiUrl = `${baseUrl}?${params.toString()}`;
    console.log("[API] Requesting URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("[API] Response status:", response.status);
    console.log(
      "[API] Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Error response:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log("[API] Raw response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[API] JSON parse error:", parseError);
      console.error("[API] Response text:", responseText);
      throw new Error("Invalid JSON response");
    }

    console.log("[API] Parsed data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
        type: "server_error",
      },
      { status: 500 }
    );
  }
}
