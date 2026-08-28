import { PROFILE } from "@/lib/site";

export function About() {
  return (
    <div className="col space-y-4 px-6 py-7 sm:px-8">
      {PROFILE.about.map((paragraph) => (
        <div key={paragraph} className="copy flex gap-2">
          <span aria-hidden="true" className="select-none text-[var(--soft)]">
            •
          </span>
          <p>{paragraph}</p>
        </div>
      ))}
    </div>
  );
}
