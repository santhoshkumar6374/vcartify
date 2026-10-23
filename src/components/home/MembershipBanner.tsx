import { Truck, Tag, Headphones, Shield } from "lucide-react";

const PERKS = [
  { icon: Truck, label: "Free Delivery" },
  { icon: Tag, label: "Exclusive Deals" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Shield, label: "Assured Quality" },
];

interface Props {
  storeName?: string;
}

export function MembershipBanner({ storeName = "vCartify" }: Props) {
  return (
    <section className="relative py-16 lg:py-20 bg-[#243122] overflow-hidden border-t border-[#344531]">
      {/* Decorative dots */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #f5f0e6 1px, transparent 1px), radial-gradient(circle at 80% 70%, #f5f0e6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center text-[#faf7f2]">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-[#d8c29d] mb-3 uppercase">
          {storeName} Privilege
        </p>

        <h2 className="text-3xl lg:text-5xl font-serif font-bold mb-3 tracking-tight">
          Join {storeName} Circle
        </h2>

        <p className="text-base lg:text-lg text-[#ede5d7]/85 max-w-xl mx-auto mb-10 font-light">
          Unlock curated perks, priority courier delivery, and privileged member benefits
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 mb-10">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.label} className="flex flex-col items-center gap-2.5">
                <div className="h-14 w-14 rounded-2xl bg-[#faf7f2]/10 border border-[#faf7f2]/20 flex items-center justify-center backdrop-blur shadow-sm">
                  <Icon size={22} className="text-[#ede5d7]" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-[#ede5d7] text-center tracking-wide">
                  {perk.label}
                </span>
              </div>
            );
          })}
        </div>

        <button className="px-8 py-3.5 rounded-lg bg-[#faf7f2] text-[#243122] text-sm font-semibold hover:bg-[#ede5d7] transition-all shadow-xl">
          Become an Exclusive Member
        </button>
      </div>
    </section>
  );
}