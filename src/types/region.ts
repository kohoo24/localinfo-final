export interface District {
  name: string;
  code: string;
}

export interface RegionData {
  cities: {
    [key: string]: {
      code: string;
      districts: District[];
    };
  };
}

// JSON 데이터의 타입 검증을 위한 가드 함수
export function isRegionData(data: any): data is RegionData {
  return (
    data &&
    typeof data === "object" &&
    "cities" in data &&
    Object.values(data.cities).every(
      (city: any) =>
        typeof city === "object" &&
        "code" in city &&
        "districts" in city &&
        Array.isArray(city.districts)
    )
  );
}
