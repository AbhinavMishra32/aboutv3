import type { ReactNode } from "react";
import { BlogShell } from "@/components/blog/BlogShell";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <BlogShell>{children}</BlogShell>;
}
