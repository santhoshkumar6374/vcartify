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
    <section className="bg-gray-50 py-14 lg:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-[1500px] px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gray-500 mb-2 uppercase text-center lg:text-left">
              Happy Customers
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center lg:text-left tracking-tight">
              Loved by Thousands
            </h2>
          </div>
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-600">
              Real reviews from real {storeName} shoppers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-7 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <Quote size={28} className="text-gray-300 mb-3" strokeWidth={2} fill="currentColor" />

              <p className="text-gray-700 leading-relaxed mb-5 text-sm lg:text-base">
                {t.quote}
              </p>

              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}