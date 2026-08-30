import { STACK_GROUPS, TECH_STACK } from "@/lib/site";
import { TechIcon } from "@/components/shell/TechIcon";

export function StackSection() {
  return (
    <div className="col px-6 py-7 sm:px-8">
      <dl className="space-y-5">
        {STACK_GROUPS.map((group) => (
          <div key={group} className="grid gap-2 sm:grid-cols-[132px_1fr] sm:gap-5">
            <dt className="mono pt-[3px] text-[10.5px] uppercase tracking-[0.12em] text-[var(--soft)]">
              {group}
            </dt>
            <dd className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
              {TECH_STACK.filter((tech) => tech.group === group).map((tech) => (
                <span
                  key={tech.name}
                  className="mono flex items-center gap-1.5 text-[12px] text-[var(--muted)]"
                >
                  <TechIcon name={tech.name} size={12} />
                  {tech.name}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
