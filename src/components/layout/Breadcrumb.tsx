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
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={14} className="text-gray-400" strokeWidth={2} />}
            {isLast ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-gray-500 hover:text-gray-900 font-normal transition-colors hover:underline"
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