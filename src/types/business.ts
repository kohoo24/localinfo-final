export interface Business {
  id: string;
  name: string;
  statusCode: string;
  zipCode: string;
  address: string;
  phoneNumber: string;
  updatedAt: string;
}

export interface BusinessListProps {
  businesses: Business[];
}
