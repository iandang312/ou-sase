"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Layout";
import { ScrollScene, useSceneValue } from "@/components/ui/ScrollScene";
import { TRACKS } from "./content";
import { TONE_BORDER, TONE_INK_TEXT, TONE_SOFT_BG } from "./tones";

/**
 * A bento grid that assembles tile by tile as the reader scrolls, rather than
 * swapping full-screen steps like the other scenes — the tiles need to end up
 * sitting together in one grid, not replacing each other. Each tile drives
 * its own opacity/y off the same scene progress via useSceneValue, staggered
 * so they land one after another. In static mode useSceneValue pins every
 * tile at its finished state, so the grid renders complete and normal.
 */
function Tile({
  index,
  count,
  name,
  description,
  tone,
}: {
  index: number;
  count: number;
  name: string;
  description: string;
  tone: (typeof TRACKS)[number]["tone"];
}) {
  const start = 0.05 + (index / count) * 0.75;
  const end = start + 0.2;
  const opacity = useSceneValue([start, end], [0, 1]);
  const y = useSceneValue([start, end], [28, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`flex flex-col gap-1.5 rounded-xl border p-4 sm:gap-2 sm:p-6 ${TONE_SOFT_BG[tone]} ${TONE_BORDER[tone]} ${
        index === 0 ? "col-span-2" : ""
      }`}
    >
      <span className={`text-caption-strong uppercase tracking-[0.08em] ${TONE_INK_TEXT[tone]}`}>
        Track {index + 1}
      </span>
      <h3 className="font-display text-title-md text-ink sm:text-title-lg">{name}</h3>
      <p className="text-caption text-body sm:text-body-sm">{description}</p>
    </motion.div>
  );
}

export function Tracks() {
  return (
    <ScrollScene length={3} className="bg-surface-soft" aria-label="SASEHacks tracks">
      <div className="flex h-full w-full items-center pt-16">
        <Container className="flex w-full flex-col gap-8">
          <div className="text-center">
            <span className="text-caption-strong uppercase tracking-[0.08em] text-brand-ink">
              Tracks
            </span>
            <h2 className="font-display mt-2 text-display-sm text-ink md:text-display-md">
              Pick a track, or don&apos;t
            </h2>
            <p className="mx-auto mt-2 max-w-[52ch] text-body-md text-body">
              Track names below are placeholders — final tracks and sponsor prompts land closer to
              the event.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {TRACKS.map((track, i) => (
              <Tile
                key={track.name}
                index={i}
                count={TRACKS.length}
                name={track.name}
                description={track.description}
                tone={track.tone}
              />
            ))}
          </div>
        </Container>
      </div>
    </ScrollScene>
  );
}
