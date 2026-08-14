import { Tag, Percent, Gift } from "lucide-react";

const OFFERS = [
  {
    icon: Percent,
    type: "Bank Offer",
    text: "10% off on SBI Credit Cards, up to ₹1,000",
    link: "T&C",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Percent,
    type: "Bank Offer",
    text: "5% Cashback on Axis Bank Card",
    link: "T&C",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Gift,
    type: "Coupon",
    text: "Use code VCFIRST for ₹200 off",
    link: "Apply",
    color: "text-green-600 bg-green-50",
  },
];

export function ProductOffers() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Tag size={16} className="text-orange-500" fill="currentColor" strokeWidth={0} />
        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Available Offers</h3>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {OFFERS.map((offer, idx) => {
          const Icon = offer.icon;
          return (
            <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
              <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg ${offer.color} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon size={12} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-800">
                  <span className="font-medium">{offer.type}:</span>{" "}
                  {offer.text}
                </p>
                <button className="text-[11px] sm:text-xs text-blue-600 font-medium hover:underline mt-0.5">
                  {offer.link} →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
        <button className="text-xs sm:text-sm text-blue-600 font-medium hover:underline">
          View all offers →
        </button>
      </div>
    </div>
  );
}