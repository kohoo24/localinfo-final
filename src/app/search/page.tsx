"use client";

import { useState } from "react";
import regionData from "@/data/intuitive_region_codes.json";
import { District, RegionData } from "@/types/region";

const typedRegionData = regionData as RegionData;

interface SearchResult {
  rowNum: number;
  bplcNm: string;
  siteWhlAddr: string;
  rdnWhlAddr: string;
  trdStateNm: string;
  siteTel: string;
  lastModTs: string;
  uptaeNm: string;
}

export default function SearchPage() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!selectedCity || !selectedDistrict) {
      alert("지역을 선택해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const districtCode = typedRegionData.cities[selectedCity]?.districts.find(
        (d: District) => d.name === selectedDistrict
      )?.code;

      if (!districtCode) {
        throw new Error("지역 코드를 찾을 수 없습니다.");
      }

      // API 호출
      const response = await fetch(`/api/businesses?localCode=${districtCode}`);

      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }

      const data = await response.json();

      // API 응답에서 실제 데이터 추출
      const rows = data.result?.body?.rows?.row || [];
      setSearchResults(Array.isArray(rows) ? rows : [rows]);
    } catch (err) {
      console.error("Search Error:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <select
          className="flex-1 p-2 border rounded"
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDistrict("");
          }}
        >
          <option value="">시 선택</option>
          {Object.keys(typedRegionData.cities).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="flex-1 p-2 border rounded"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">구 선택</option>
          {selectedCity &&
            typedRegionData.cities[selectedCity]?.districts.map(
              (district: District) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              )
            )}
        </select>
      </div>

      <button
        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? "검색 중..." : "검색"}
      </button>

      {error && (
        <div className="mt-4 p-4 text-red-500 bg-red-50 rounded">{error}</div>
      )}

      <div className="mt-4">
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {result.bplcNm || "이름 없음"}
                </h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  {result.trdStateNm && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {result.trdStateNm}
                    </span>
                  )}
                  {result.siteTel && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {result.siteTel}
                    </span>
                  )}
                  {result.uptaeNm && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {result.uptaeNm}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {result.siteWhlAddr && (
                    <div>
                      <span className="font-medium">지번주소: </span>
                      {result.siteWhlAddr}
                    </div>
                  )}
                  {result.rdnWhlAddr && (
                    <div>
                      <span className="font-medium">도로명주소: </span>
                      {result.rdnWhlAddr}
                    </div>
                  )}
                  {result.lastModTs && (
                    <div>
                      <span className="font-medium">최종수정일: </span>
                      {result.lastModTs}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
