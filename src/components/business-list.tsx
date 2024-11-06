"use client";

import React, { useState, useEffect } from "react";
import { Business } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DateRangeSearch } from "./date-range-search";
import { format } from "date-fns";
import { Pagination } from "./ui/pagination";
import { fetchBusinesses } from "@/lib/api";
import { RegionSelect } from "./region-select";
import { Building2, Phone, MapPin, Calendar, Search } from "lucide-react";
import { DateRange } from "@/lib/types";

export function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>();

  const handleRegionChange = (code: string) => {
    setSelectedRegion(code);
    setSelectedDistrict(undefined);
  };

  useEffect(() => {
    async function loadBusinesses() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, total } = await fetchBusinesses({
          pageIndex: currentPage,
          pageSize: 10,
          lastModTsBgn: dateRange.from
            ? format(dateRange.from, "yyyyMMdd")
            : undefined,
          lastModTsEnd: dateRange.to
            ? format(dateRange.to, "yyyyMMdd")
            : undefined,
          localCode: selectedDistrict || selectedRegion,
        });

        setBusinesses(data);
        setTotalPages(Math.ceil(total / 10));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "데이터를 불러오는 중 오류가 발생했습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadBusinesses();
  }, [currentPage, dateRange, selectedRegion, selectedDistrict]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 섹션 */}
      <div className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            사업장 운영 현황
          </h1>
          <p className="mt-2 text-gray-600">
            지역별 사업장 정보를 실시간으로 조회할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                조회 기간 설정
              </label>
              <DateRangeSearch
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                지역 설정
              </label>
              <RegionSelect
                selectedRegion={selectedRegion}
                selectedDistrict={selectedDistrict}
                onRegionChange={handleRegionChange}
                onDistrictChange={setSelectedDistrict}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 컨텐츠 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                데이터를 불러오는 중...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
            <div className="text-red-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-12 text-center">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">
              다른 검색 조건을 시도해보세요
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {businesses.map((business) => (
                <Card
                  key={business.id}
                  className="bg-white/60 backdrop-blur-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 ring-1 ring-black/5"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {business.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              business.statusCode.includes("정상")
                                ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                                : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                            }`}
                          >
                            {business.statusCode}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 border-t border-gray-100">
                    <div className="grid gap-3 text-sm text-gray-600">
                      <div className="flex items-center group">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-medium mr-2 text-gray-700">
                          주소:
                        </span>
                        <span>
                          {business.zipCode} {business.address}
                        </span>
                      </div>
                      <div className="flex items-center group">
                        <Phone className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-medium mr-2 text-gray-700">
                          전화번호:
                        </span>
                        <span>{business.phoneNumber || "없음"}</span>
                      </div>
                      <div className="flex items-center group">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-medium mr-2 text-gray-700">
                          갱신일:
                        </span>
                        <span>
                          {new Date(business.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
