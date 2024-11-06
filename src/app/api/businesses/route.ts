import { NextRequest, NextResponse } from "next/server";

const API_KEY = "DledgRvCFAm2%3DBohKYGRfrzzl06z1bKP1jRdjXn%2Fuds%3D";
const BASE_URL = "https://www.localdata.go.kr/platform/rest/TO0/openDataApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const localCode = searchParams.get("localCode");

    console.log("[API] Request received:", { localCode });

    if (!localCode) {
      return NextResponse.json(
        { error: "지역 코드가 필요합니다." },
        { status: 400 }
      );
    }

    const apiUrl = new URL(BASE_URL);
    apiUrl.searchParams.append("authKey", API_KEY);
    apiUrl.searchParams.append("localCode", localCode);
    apiUrl.searchParams.append("pageIndex", "1");
    apiUrl.searchParams.append("pageSize", "10");

    console.log("[API] Requesting URL:", apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    console.log("[API] External API response status:", response.status);

    if (!response.ok) {
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
    console.error("[API] Error:", error);

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
