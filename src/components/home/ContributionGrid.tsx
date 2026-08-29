import type { ActivityContributionCalendar } from "@/lib/activity";

/** Monochrome ramp — density is read as lightness, never as hue. */
const LEVEL_MIX = [0, 14, 32, 58, 90] as const;

function cellStyle(level: number) {
  if (level === 0) return { background: "var(--chip-strong)" };
  return {
    background: `color-mix(in oklab, var(--fg) ${LEVEL_MIX[level]}%, var(--chip-strong))`,
  };
}

const CELL = 10;
const GAP = 3;

export function ContributionGrid({
  calendar,
}: {
  calendar: ActivityContributionCalendar;
}) {
  return (
    <div>
      {/* Month scale, aligned to the week columns beneath it */}
      <div className="mono mb-1.5 flex overflow-hidden text-[9px] uppercase tracking-[0.1em] text-[var(--soft)]">
        {calendar.months.map((month) => (
          <span
            key={`${month.name}-${month.year}-${month.firstDay}`}
            style={{ width: month.totalWeeks * (CELL + GAP) }}
            className="shrink-0 overflow-hidden whitespace-nowrap"
          >
            {month.name.slice(0, 3)}
          </span>
        ))}
      </div>

      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {calendar.weeks.map((week) => (
          <div key={week.firstDay} className="flex shrink-0 flex-col gap-[3px]">
            {week.contributionDays.map((day) => (
              <span
                key={day.date}
                title={`${day.contributionCount} contribution${
                  day.contributionCount === 1 ? "" : "s"
                } on ${day.date}`}
                style={{
                  width: CELL,
                  height: CELL,
                  ...cellStyle(day.contributionLevel),
                }}
                className="rounded-[2px]"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mono mt-2 flex items-center justify-end gap-1.5 text-[9px] uppercase tracking-[0.1em] text-[var(--soft)]">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            style={{ width: CELL, height: CELL, ...cellStyle(level) }}
            className="rounded-[2px]"
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
