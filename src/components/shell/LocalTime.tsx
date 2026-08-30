"use client";

import { useEffect, useState } from "react";

/**
 * Abhinav's local time, ticking. Rendered empty on the server so the markup
 * matches on hydration, then filled in on the client.
 */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date());

    setTime(format());
    const timer = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span suppressHydrationWarning>{time ? `${time} in Ghaziabad` : "Ghaziabad"}</span>
  );
}
