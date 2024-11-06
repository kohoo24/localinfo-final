export interface Business {
  id: string;
  name: string;
  zipCode: string;
  address: string;
  statusCode: string;
  phoneNumber: string;
  updatedAt: string;
}

export interface ApiResponse {
  rowNum: number;
  opnSfTeamCode: string;
  mgtNo: string;
  opnSvcId: string;
  updateGbn: string;
  updateDt: string;
  opnSvcNm: string;
  bplcNm: string;
  sitePostNo: string;
  siteWhlAddr: string;
  rdnPostNo: string;
  rdnWhlAddr: string;
  trdStateGbn: string;
  trdStateNm: string;
  dtlStateGbn: string;
  dtlStateNm: string;
  lastModTs: string;
  uptaeNm: string;
  siteTel: string;
}

export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  lastModTsBgn?: string;
  lastModTsEnd?: string;
  localCode?: string;
}

export interface Region {
  code: string;
  name: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}
