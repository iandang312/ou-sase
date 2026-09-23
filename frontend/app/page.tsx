import { FeatureCards } from "@/components/home/FeatureCards";
import { Hero } from "@/components/home/Hero";
import { JoinCta } from "@/components/home/JoinCta";
import { StatRow } from "@/components/home/StatRow";
import { TabletopSection } from "@/components/home/TabletopSection";
import { listEventPhotos } from "@/lib/firestore";

/**
 * Re-render from Firestore at most once a minute.
 *
 * Without this Next prerenders this page at BUILD time and bakes the data in,
 * so anything an exec changes in /admin would never appear on the live site
 * until someone redeployed. 60s keeps Firestore reads bounded while making
 * admin edits show up on their own.
 */
export const revalidate = 60;

export default async function Home() {
  const photos = await listEventPhotos();

  return (
    <>
      <Hero />
      <TabletopSection photos={photos} />
      <FeatureCards />
      <StatRow />
      <JoinCta />
    </>
  );
}
