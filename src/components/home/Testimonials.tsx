import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "vCartify has made my monthly shopping so easy! Quality products, quick delivery, and great prices.",
    name: "Priya Sharma",
    role: "Homemaker, Mumbai",
    initials: "PS",
  },
  {
    id: "2",
    quote:
      "As a student, I order all my stationery from vCartify. Best prices and always on time.",
    name: "Rahul Verma",
    role: "College Student, Pune",
    initials: "RV",
  },
  {
    id: "3",
    quote:
      "Best place to buy authentic products online. Fresh, well-packed, and reasonably priced.",
    name: "Anita Desai",
    role: "Food Blogger, Bangalore",
    initials: "AD",
  },
];

interface Props {
  storeName?: string;
}

export function Testimonials({ storeName = "vCartify" }: Props) {
  return (
    <section className="bg-[#f9f6f0] py-14 lg:py-20 border-t border-[#e5ddd0]">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#55694f] mb-2 uppercase text-center lg:text-left">
              Client Experiences
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#20291e] text-center lg:text-left tracking-tight">
              Cherished by Our Patrons
            </h2>
          </div>
          <div className="text-center lg:text-right">
            <p className="text-sm text-[#6d7667]">
              Verified impressions from authentic {storeName} orders
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="bg-[#fcfaf6] border border-[#e5ddd0] rounded-2xl p-6 lg:p-7 hover:shadow-lg hover:border-[#384a35] transition-all"
            >
              <Quote size={28} className="text-[#d8cfbf] mb-3" strokeWidth={2} fill="currentColor" />

              <p className="text-[#3a4436] leading-relaxed mb-5 text-sm lg:text-base font-serif italic">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-[#c89b3c] text-[#c89b3c]" />
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#e5ddd0]">
                <div className="h-10 w-10 rounded-full bg-[#384a35] flex items-center justify-center shadow-xs">
                  <span className="text-xs font-bold text-[#faf7f2]">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#20291e]">{t.name}</p>
                  <p className="text-xs text-[#70796c]">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}