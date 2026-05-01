import { getActivitySnapshot } from "@/lib/activity";
import { ActivityDeskClient } from "@/components/site/ActivityDeskClient";

export async function ActivitySection({ page = false }: { page?: boolean }) {
  const snapshot = await getActivitySnapshot();

  return <ActivityDeskClient initialSnapshot={snapshot} page={page} />;
}
