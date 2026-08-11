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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tab Headers — Clean */}
      <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto scrollbar-hide">
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
          Reviews ({reviewCount.toLocaleString()})
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-8">
        {activeTab === "description" && (
          <div className="max-w-none">
            <p className="text-gray-700 leading-relaxed text-base">
              {item.Description ||
                `Exquisite ${item.ItemName} with intricate detailing. Perfect for weddings and festive occasions. Crafted from the finest materials with meticulous attention to quality and design.`}
            </p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-0">
            <SpecRow label="Brand" value="vCARTIFY EXCLUSIVE" />
            <SpecRow label="Category" value="Products" />
            <SpecRow label="Colors Available" value="Red, Blue, Green, Gold" />
            <SpecRow label="Sizes" value="Free Size" />
            <SpecRow label="Vendor" value="vCartify Store" />
            <SpecRow label="Country of Origin" value="India" />
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
      className={`relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
        isActive
          ? "text-gray-900 bg-white"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-t" />
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
      className={`grid grid-cols-3 gap-4 py-3 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      <span className="text-sm text-gray-500">{label}</span>
      <span className="col-span-2 text-sm text-gray-900 font-medium">
        {value}
      </span>
    </div>
  );
}