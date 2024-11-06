import { ApiResponse, Business } from "./types";

function logApiCall(type: "request" | "response" | "error", data: any) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    type,
    data,
  };

  console.log(`[API ${type.toUpperCase()}]`, JSON.stringify(logData, null, 2));
}

export async function fetchBusinesses({
  pageIndex = 1,
  pageSize = 10,
  lastModTsBgn,
  lastModTsEnd,
  localCode,
}: {
  pageIndex?: number;
  pageSize?: number;
  lastModTsBgn?: string;
  lastModTsEnd?: string;
  localCode?: string;
}): Promise<{ data: Business[]; total: number }> {
  try {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });

    if (lastModTsBgn) params.append("bgnYmd", lastModTsBgn);
    if (lastModTsEnd) params.append("endYmd", lastModTsEnd);
    if (localCode) params.append("localCode", localCode);

    const response = await fetch(`/api/businesses?${params}`);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const responseData = await response.json();

    // 응답 데이터가 없는 경우 기본값 반환
    if (!responseData || !responseData.result) {
      return {
        data: [],
        total: 0,
      };
    }

    return {
      data: responseData.result.data || [],
      total: responseData.result.totalCount || 0,
    };
  } catch (error) {
    console.error("API Error:", error);
    // 에러 발생 시에도 기본값 반환
    return {
      data: [],
      total: 0,
    };
  }
}
