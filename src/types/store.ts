export interface StoreCategory {
  Value: number;
  Text: string;
  IsDefault: boolean;
}

export interface StoreItem {
  CategoryId: number;
  FileUrl: string | null;
  ItemName: string;
  Description: string | null;
  MRP: number;
  SellingPrice: number;
  Discount: number;
  AvailableStock: number;
}

export interface StoreResponse {
  StoreImage: string;
  StoreName: string;
  PhoneNumber: string;
  CarouselImages: string[] | null;
  DropDownList: StoreCategory[];
  ItemList: StoreItem[];
}

export interface ApiEnvelope<T> {
  StatusCode: number;
  Status: boolean;
  Message: string | null;
  ErrorMessage: string | null;
  Response: T;
}
