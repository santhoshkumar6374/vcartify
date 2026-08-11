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
    <section className="relative py-16 lg:py-20 bg-gray-900 overflow-hidden">
      {/* Decorative dots */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-yellow-400 mb-3 uppercase">
          {storeName} Prime
        </p>

        <h2 className="text-3xl lg:text-5xl font-bold mb-3 tracking-tight">
          Join {storeName} Prime
        </h2>

        <p className="text-base lg:text-lg text-white/80 max-w-xl mx-auto mb-10">
          Unlock exclusive benefits, faster delivery, and members-only prices
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 mb-10">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.label} className="flex flex-col items-center gap-2.5">
                <div className="h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur">
                  <Icon size={22} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-white/90 text-center">
                  {perk.label}
                </span>
              </div>
            );
          })}
        </div>

        <button className="px-8 py-3 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors shadow-xl">
          Become a Prime Member
        </button>
      </div>
    </section>
  );
}