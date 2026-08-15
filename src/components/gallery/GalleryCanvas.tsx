"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { galleryPhotos } from "@/content/gallery";
import { generatePositions, type PlacedPhoto } from "./layout";

/**
 * The gallery as a world you look around rather than a grid you scan.
 *
 * Photographs are scattered across a coordinate space several times the size of
 * the viewport, and moving the pointer pans a virtual camera across it. The
 * claim on the rest of the site is two thousand frames captured; this is the
 * section where that stops being a figure and becomes a room with more in it
 * than fits on screen.
 *
 * The camera is two motion values and a spring. The raw values are the target
 * the pointer sets; the springs are what actually gets rendered, and that split
 * is the entire feel of the thing — the view eases toward where the pointer is
 * pointing instead of being welded to it.
 */

const CAMERA_DAMPING = 20;
const CAMERA_STIFFNESS = 60;

/** Below this the device has no pointer to drive a camera with. */
const DESKTOP_MIN = 1024;

function WorldImage({
  photo,
  index,
  onHoverChange,
}: {
  photo: PlacedPhoto;
  index: number;
  onHoverChange: (hovering: boolean) => void;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: photo.x,
        top: 0,
        // Centred on its own coordinate. Without these the whole world clumps
        // toward the top left, because every photo would hang off its point.
        marginLeft: -photo.size / 2,
        marginTop: -photo.size / 2,
        width: photo.size,
        height: photo.size,
        transformOrigin: "center center",
      }}
      // Vertical placement rides the entry animation rather than `top`, so the
      // photograph arrives from below instead of appearing in place.
      initial={{ y: photo.y + 500, opacity: 0, scale: 0.6 }}
      animate={{ y: photo.y, opacity: 1, scale: 1 }}
      transition={{
        y: { type: "spring", damping: 25, stiffness: 70 },
        opacity: { duration: 0.4, delay: index * 0.02 },
        scale: { duration: 0.4, delay: index * 0.02 },
      }}
      whileHover={{ scale: 1.05, zIndex: 100, transition: { duration: 0.2 } }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <Link
        href={`/gallery/${photo.slug}`}
        className="group block size-full overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* A plain img, not next/image: these are absolutely positioned into a
            transformed world at sizes the optimizer cannot infer, and the fill
            layout would fight the explicit box. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
        <img
          src={photo.image}
          alt={photo.title}
          loading="lazy"
          className="size-full object-cover"
          draggable={false}
        />
        <span className="sr-only">{photo.title}</span>
      </Link>
    </motion.div>
  );
}

/**
 * Below the breakpoint there is no pointer, so there is no camera. A degraded
 * pannable version would be worse than a different composition — this is a
 * separate static hero rather than the same one with its input removed.
 */
function StaticHero() {
  const picks = useMemo(() => {
    const shuffled = [...galleryPhotos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  // Hardcoded scatter. Four positions chosen to sit clear of the centred
  // headline rather than generated, so the type is never covered.
  const spots = [
    { left: "4vw", top: "12vh", rotate: -6 },
    { left: "52vw", top: "6vh", rotate: 5 },
    { left: "8vw", top: "58vh", rotate: 4 },
    { left: "56vw", top: "66vh", rotate: -5 },
  ];

  return (
    <div className="relative h-[100svh] overflow-hidden bg-ink">
      <h1 className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-(length:--text-h1) font-extrabold tracking-[-0.03em] text-white">
        Gallery
      </h1>

      {picks.map((photo, index) => {
        const spot = spots[index];
        return (
          <motion.div
            key={photo.id}
            className="absolute w-[38vw] max-w-[16rem]"
            style={{ left: spot.left, top: spot.top, rotate: spot.rotate }}
            initial={{ y: 80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 70,
              delay: index * 0.08,
            }}
          >
            <Link
              href={`/gallery/${photo.slug}`}
              className="block aspect-square overflow-hidden rounded-2xl shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- parity with the world */}
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                className="size-full object-cover"
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

export function GalleryCanvas() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [hoveringImage, setHoveringImage] = useState(false);
  const [fade, setFade] = useState(1);

  // Read once, then track. Null until mounted so the server and the first
  // client render agree — picking a branch from an unmeasured viewport would
  // mismatch and throw a hydration error.
  useEffect(() => {
    const read = () => setIsDesktop(window.innerWidth >= DESKTOP_MIN);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  /**
   * The world, built exactly once.
   *
   * The empty dependency list is deliberate and is the most important line in
   * this component: any dependency here re-runs the layout and reshuffles every
   * photograph on an unrelated render. Resizing therefore does not re-pack —
   * the scatter stays where the reader last saw it.
   */
  const world = useMemo(
    () =>
      generatePositions(
        galleryPhotos,
        typeof window === "undefined" ? 1440 : window.innerWidth,
      ),
    [],
  );

  const cameraX = useMotionValue(0);
  const cameraY = useMotionValue(0);
  const springConfig = {
    damping: CAMERA_DAMPING,
    stiffness: CAMERA_STIFFNESS,
    restDelta: 0.001,
  };
  const cameraXSpring = useSpring(cameraX, springConfig);
  const cameraYSpring = useSpring(cameraY, springConfig);

  const frameRef = useRef(0);

  useEffect(() => {
    if (!isDesktop) return;

    const onMove = (event: MouseEvent) => {
      // Reaching for a photograph must not move it. Without this the camera
      // keeps gliding while the pointer travels and the click target slides
      // out from under it.
      if (hoveringImage) return;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        // Exactly half the overflow: the pointer at a screen edge lands the
        // world precisely at its own edge, never past it and never short.
        const maxX = Math.max(0, (world.width - window.innerWidth) / 2);
        const maxY = Math.max(0, (world.height - window.innerHeight) / 2);

        // Normalised from the centre, so screen centre is rest at zero.
        const nx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ny = (event.clientY / window.innerHeight - 0.5) * 2;

        // Negated, and that is what makes it a camera: pointer right slides
        // the world left, which reads as panning right. Without the minus it
        // inverts into dragging the world around.
        cameraX.set(-nx * maxX);
        cameraY.set(-ny * maxY);
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isDesktop, hoveringImage, world.width, world.height, cameraX, cameraY]);

  /** Fades the canvas out as the reader scrolls past it to the page below. */
  useEffect(() => {
    const read = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      // Rounded before it is stored. The interpolation can land on a value
      // like 0.05 at the tail, which never satisfies an equality test against
      // zero — so the faded layer would keep pointer-events and go on
      // swallowing clicks meant for the page scrolled up over it.
      if (y < vh * 0.5) setFade(1);
      else if (y < vh) {
        const next = 1 - (y - vh * 0.5) / (vh * 0.5);
        setFade(next < 0.02 ? 0 : next);
      } else setFade(0);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  // Nothing rendered until the viewport has been measured.
  if (isDesktop === null) return <div className="h-[100svh] bg-ink" />;
  if (!isDesktop) return <StaticHero />;

  return (
    <div
      data-nav-invert
      className="fixed inset-0 overflow-hidden bg-ink"
      style={{
        opacity: fade,
        // A fully faded layer must stop swallowing clicks meant for the page
        // that has scrolled up over it.
        pointerEvents: fade === 0 ? "none" : "auto",
      }}
    >
      {/* Pinned, and deliberately outside the transformed node — inside it the
          headline would pan with the photographs and the parallax would read
          as flat. */}
      <h1 className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center text-(length:--text-mega) font-extrabold tracking-[-0.04em] text-white mix-blend-difference">
        Gallery
      </h1>

      {/* Exactly one element carries the camera transform. Thirty individually
          animated nodes will not stay smooth; one composited transform will. */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{ x: cameraXSpring, y: cameraYSpring }}
      >
        {world.photos.map((photo, index) => (
          <WorldImage
            key={photo.id}
            photo={photo}
            index={index}
            onHoverChange={setHoveringImage}
          />
        ))}
      </motion.div>
    </div>
  );
}
