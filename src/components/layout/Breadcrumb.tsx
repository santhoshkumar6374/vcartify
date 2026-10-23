import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface Props {
  items: Crumb[];
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={13} className="text-[#a0a89d]" strokeWidth={2} />}
            {isLast ? (
              <span className="text-[#20291e] font-semibold">{item.label}</span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-[#657161] hover:text-[#20291e] font-normal transition-colors hover:underline"
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}