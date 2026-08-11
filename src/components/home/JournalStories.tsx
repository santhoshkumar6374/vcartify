import { ArrowRight } from "lucide-react";

interface Story {
  id: string;
  spotlight: string;
  title: string;
  image: string;
}

const STORIES: Story[] = [
  {
    id: "1",
    spotlight: "SHOPPING GUIDE",
    title: "How to Choose the Best Products for Your Needs",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80",
  },
  {
    id: "2",
    spotlight: "TIPS & TRICKS",
    title: "Top 10 Must-Have Items This Season",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80",
  },
  {
    id: "3",
    spotlight: "BEST SELLERS",
    title: "Popular Products This Month",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  },
];

interface Props {
  storeName?: string;
}

export function JournalStories({ storeName = "vCartify" }: Props) {
  return (
    <section className="bg-white py-12 lg:py-16 border-t border-gray-100">
      <div className="mx-auto max-w-[1500px] px-4">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gray-500 mb-2 uppercase">
            {storeName} Journal
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Shopping Guides & Tips
          </h2>
          <p className="text-sm text-gray-600">
            Expert advice to help you shop smarter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STORIES.map((story) => (
            <article
              key={story.id}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:shadow-xl transition-all"
            >
              <img
                src={story.image}
                alt={story.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2.5">
                <p className="text-[10px] font-semibold tracking-[0.3em] text-yellow-300 uppercase">
                  {story.spotlight}
                </p>
                <h3 className="text-lg lg:text-xl font-bold leading-snug">
                  {story.title}
                </h3>
                <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-yellow-300 group-hover:gap-2 transition-all">
                  Read Article
                  <ArrowRight size={12} strokeWidth={2} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}