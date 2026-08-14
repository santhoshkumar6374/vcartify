// Category from backend dropdown
export interface StoreCategory {
  Value: number;
  Text: string;
  IsDefault: boolean;
}

// Product item from backend
export interface StoreItem {
  CategoryId: number;
  FileUrl: string | null;
  ItemName: string;
  Description: string | null;
  MRP: number;
  SellingPrice: number;
  Discount: number;
  AvailableStock: number;
  PhoneNumber?: string;      // ✨ Product-specific WhatsApp phone
  VendorPhone?: string;      // ✨ Alternative vendor phone
  StoreName?: string;        // ✨ Vendor/Store name per product
  VendorName?: string;       // ✨ Alternative vendor name
}

// Full store data response
export interface StoreResponse {
  StoreImage: string;
  StoreName: string;
  PhoneNumber: string;
  CarouselImages: string[] | null;
  DropDownList: StoreCategory[];
  ItemList: StoreItem[];
}

// Generic API wrapper
export interface ApiEnvelope<T> {
  StatusCode: number;
  Status: boolean;
  Message: string | null;
  ErrorMessage: string | null;
  Response: T;
}