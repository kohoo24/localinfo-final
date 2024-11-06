export interface RegionCode {
  code: string;
  name: string;
  districts?: { code: string; name: string }[];
}

export const REGION_CODES: RegionCode[] = [
  {
    code: "6110000",
    name: "서울특별시",
    districts: [
      { code: "3000000", name: "종로구" },
      { code: "3010000", name: "중구" },
      { code: "3020000", name: "용산구" },
      { code: "3030000", name: "성동구" },
      { code: "3040000", name: "광진구" },
      { code: "3050000", name: "동대문구" },
      { code: "3060000", name: "중랑구" },
      { code: "3070000", name: "성북구" },
      { code: "3080000", name: "강북구" },
      { code: "3090000", name: "도봉구" },
      { code: "3100000", name: "노원구" },
      { code: "3110000", name: "은평구" },
      { code: "3120000", name: "서대문구" },
      { code: "3130000", name: "마포구" },
      { code: "3140000", name: "양천구" },
      { code: "3150000", name: "강서구" },
      { code: "3160000", name: "구로구" },
      { code: "3170000", name: "금천구" },
      { code: "3180000", name: "영등포구" },
      { code: "3190000", name: "동작구" },
      { code: "3200000", name: "관악구" },
      { code: "3210000", name: "서초구" },
      { code: "3220000", name: "강남구" },
      { code: "3230000", name: "송파구" },
      { code: "3240000", name: "강동구" },
    ],
  },
  {
    code: "6260000",
    name: "부산광역시",
    districts: [
      { code: "3250000", name: "중구" },
      { code: "3260000", name: "서구" },
      { code: "3270000", name: "동구" },
      { code: "3280000", name: "영도구" },
      { code: "3290000", name: "부산진구" },
      { code: "3300000", name: "동래구" },
      { code: "3310000", name: "남구" },
      { code: "3320000", name: "북구" },
      { code: "3330000", name: "해운대구" },
      { code: "3340000", name: "사하구" },
      { code: "3350000", name: "금정구" },
      { code: "3360000", name: "강서구" },
      { code: "3370000", name: "연제구" },
      { code: "3380000", name: "수영구" },
      { code: "3390000", name: "사상구" },
      { code: "3400000", name: "기장군" },
    ],
  },
  // ... 나머지 도시들도 같은 형식으로 추가
];
