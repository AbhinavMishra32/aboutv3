import { ArrowUpRight } from "lucide-react";
import { RECOGNITION } from "@/lib/site";

export function Recognition() {
  return (
    <div className="col px-6 py-2 sm:px-8">
      {RECOGNITION.map((item) => (
        <div
          key={item.title}
          className="border-b border-dashed border-[var(--line)] py-5 last:border-b-0"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-[15.5px] font-semibold tracking-[-0.005em] text-[var(--fg)] transition-opacity hover:opacity-70"
              >
                {item.title}
                <ArrowUpRight
                  size={11}
                  className="text-[var(--soft)] transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                />
              </a>
            ) : (
              <h3 className="text-[15.5px] font-semibold tracking-[-0.005em] text-[var(--fg)]">
                {item.title}
              </h3>
            )}
            <span className="mono shrink-0 text-[10.5px] text-[var(--soft)]">{item.meta}</span>
          </div>
          <p className="mono mt-1 text-[10.5px] text-[var(--soft)]">{item.org}</p>
          <p className="copy mt-2 max-w-[62ch] text-[14px]">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
