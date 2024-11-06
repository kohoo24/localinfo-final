"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGION_CODES } from "@/lib/region-codes";

interface RegionSelectProps {
  selectedRegion?: string;
  selectedDistrict?: string;
  onRegionChange: (code: string) => void;
  onDistrictChange: (code: string) => void;
}

export function RegionSelect({
  selectedRegion,
  selectedDistrict,
  onRegionChange,
  onDistrictChange,
}: RegionSelectProps) {
  const selectedRegionData = REGION_CODES.find(
    (region) => region.code === selectedRegion
  );

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
      {/* 시/도 선택 */}
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="시/도 선택" />
        </SelectTrigger>
        <SelectContent>
          {REGION_CODES.map((region) => (
            <SelectItem key={region.code} value={region.code}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 구/군 선택 */}
      {selectedRegionData && selectedRegionData.districts && (
        <Select
          value={selectedDistrict}
          onValueChange={onDistrictChange}
          disabled={!selectedRegion}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="구/군 선택" />
          </SelectTrigger>
          <SelectContent>
            {selectedRegionData.districts.map((district) => (
              <SelectItem key={district.code} value={district.code}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
