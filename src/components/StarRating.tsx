import { Star } from "lucide-react";

interface Props {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
  interactive?: boolean;
}

export function StarRating({ value, size = 20, onChange, interactive }: Props) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={interactive ? "transition-transform hover:scale-125 cursor-pointer" : "cursor-default"}
          aria-label={`${n} csillag`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= value ? "fill-primary text-primary drop-shadow-[0_0_6px_oklch(0.7_0.19_45/0.7)]" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}
