import { NextRequest, NextResponse } from "next/server";

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

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl = process.env.API_BASE_URL;

    if (!apiKey || !baseUrl) {
      console.error("[API] Missing environment variables:", {
        apiKey,
        baseUrl,
      });
      throw new Error("API 설정이 올바르지 않습니다.");
    }

    const apiUrl = new URL(baseUrl);
    apiUrl.searchParams.append("authKey", apiKey);
    apiUrl.searchParams.append("localCode", localCode);
    apiUrl.searchParams.append("pageIndex", "1");
    apiUrl.searchParams.append("pageSize", "10");

    console.log("[API] Requesting URL:", apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error("[API] External API error:", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`External API error: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log("[API] Response received, length:", xmlText.length);

    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    console.error("[API] Error details:", error);

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "known",
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
