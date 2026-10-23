import { useState } from "react";
import { StoreItem } from "@/types/store";
import { ReviewsSection } from "./ReviewsSection";

interface Props {
  item: StoreItem;
  reviewCount?: number;
}

type Tab = "description" | "specifications" | "reviews";

export function ProductTabs({ item, reviewCount = 2543 }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  return (
    <div className="bg-[#fcfaf6] rounded-none sm:rounded-2xl border-0 sm:border border-[#e5ddd0] sm:shadow-xs overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-[#e5ddd0] bg-[#f5f0e6] overflow-x-auto scrollbar-hide">
        <TabButton
          isActive={activeTab === "description"}
          onClick={() => setActiveTab("description")}
        >
          Description
        </TabButton>
        <TabButton
          isActive={activeTab === "specifications"}
          onClick={() => setActiveTab("specifications")}
        >
          Specifications
        </TabButton>
        <TabButton
          isActive={activeTab === "reviews"}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviewCount > 999 ? `${Math.floor(reviewCount / 1000)}k` : reviewCount})
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {activeTab === "description" && (
          <div className="max-w-none">
            <p className="text-sm sm:text-base text-[#384435] leading-relaxed font-serif">
              {item.Description ||
                `Exquisite ${item.ItemName} with intricate detailing. Perfect for weddings and festive occasions. Crafted from the finest materials with meticulous attention to quality and design.`}
            </p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-0">
            <SpecRow label="Brand" value="vCARTIFY EXCLUSIVE" />
            <SpecRow label="Category" value="Products" />
            <SpecRow label="Colors" value="Red, Blue, Green, Gold" />
            <SpecRow label="Sizes" value="Free Size" />
            <SpecRow label="Vendor" value="vCartify Artisan" />
            <SpecRow label="Origin" value="India" />
            <SpecRow label="Rating" value="4.3 / 5" isLast />
          </div>
        )}

        {activeTab === "reviews" && <ReviewsSection reviewCount={reviewCount} />}
      </div>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
        isActive
          ? "text-[#20291e] bg-[#fcfaf6] font-semibold"
          : "text-[#657161] hover:text-[#20291e] hover:bg-[#ede5d7]/50"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-3 sm:left-4 right-3 sm:right-4 h-0.5 bg-[#384a35] rounded-t" />
      )}
    </button>
  );
}

function SpecRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 gap-3 sm:gap-4 py-2.5 sm:py-3 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      <span className="text-xs sm:text-sm text-gray-500">{label}</span>
      <span className="col-span-2 text-xs sm:text-sm text-gray-900 font-medium">
        {value}
      </span>
    </div>
  );
}