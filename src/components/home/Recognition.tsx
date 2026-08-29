import { ArrowUpRight } from "lucide-react";
import { RECOGNITION } from "@/lib/site";

export function Recognition() {
  return (
    <div className="col px-6 py-6 sm:px-8">
      <div className="grid gap-4">
        {RECOGNITION.map((item) => {
          const Wrapper = item.href ? "a" : "div";
          return (
            <Wrapper
              key={item.title}
              {...(item.href ? { href: item.href, target: "_blank", rel: "noreferrer" } : {})}
              className="card card-interactive group block p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-center gap-1 text-[16px] font-semibold tracking-[0.025em] text-[var(--fg)]">
                  {item.title}
                  {item.href ? (
                    <ArrowUpRight
                      size={11}
                      className="text-[var(--soft)] transition-opacity group-hover:opacity-100 sm:opacity-0"
                    />
                  ) : null}
                </h3>
                <span className="mono shrink-0 text-[11px] text-[var(--soft)]">{item.meta}</span>
              </div>
              <p className="mono mt-1.5 text-[11px] text-[var(--muted)]">{item.org}</p>
              <p className="copy mt-3">{item.detail}</p>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
