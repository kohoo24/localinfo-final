"use client";

import React, { useState } from "react";
import regionData from "@/data/intuitive_region_codes.json";
import { District, RegionData } from "@/types/region";

const typedRegionData = regionData as RegionData;

interface SearchResult {
  rowNum: string;
  bplcNm: string;
  siteWhlAddr: string;
  rdnWhlAddr: string;
  trdStateNm: string;
  siteTel: string;
  lastModTs: string;
  uptaeNm: string;
}

export default function HomePage() {
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

      const response = await fetch(`/api/businesses?localCode=${districtCode}`);
      console.log("[Frontend] API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Frontend] API error:", errorData);
        throw new Error(errorData.details || "API 호출 실패");
      }

      const xmlText = await response.text();
      console.log("[Frontend] Received XML length:", xmlText.length);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const rows = xmlDoc.querySelectorAll("row");

      const resultsArray = Array.from(rows).map((row) => ({
        rowNum: row.querySelector("rowNum")?.textContent || "",
        bplcNm: row.querySelector("bplcNm")?.textContent || "",
        siteWhlAddr: row.querySelector("siteWhlAddr")?.textContent || "",
        rdnWhlAddr: row.querySelector("rdnWhlAddr")?.textContent || "",
        trdStateNm: row.querySelector("trdStateNm")?.textContent || "",
        siteTel: row.querySelector("siteTel")?.textContent || "",
        lastModTs: row.querySelector("lastModTs")?.textContent || "",
        uptaeNm: row.querySelector("uptaeNm")?.textContent || "",
      }));

      setSearchResults(resultsArray);
    } catch (err) {
      console.error("[Frontend] Error details:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        지역별 사업장 정보 검색
      </h1>

      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              시/도
            </label>
            <select
              id="city"
              name="city"
              className="w-full p-2 border rounded"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict("");
              }}
            >
              <option value="">시/도 선택</option>
              {Object.keys(typedRegionData.cities).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="district"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              구/군
            </label>
            <select
              id="district"
              name="district"
              className="w-full p-2 border rounded"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">구/군 선택</option>
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
        </div>

        <button
          type="button"
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "검색 중..." : "검색"}
        </button>

        {error && (
          <div className="mt-4 p-4 text-red-500 bg-red-50 rounded">{error}</div>
        )}

        <div className="mt-8">
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
            <div className="text-center text-gray-500">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
