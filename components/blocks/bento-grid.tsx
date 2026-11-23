import Bento37 from "./bento-37";
import Bento33 from "./bento-33";

/**
 * Bento grid composed with the React Bits Bento Builder.
 *
 * The span classes live on the wrappers, never on the tiles, so any tile can
 * be moved to any cell by editing this file alone. The grid uses dense
 * auto-flow: reorder the wrappers or change a span and the browser re-packs
 * the layout at every breakpoint.
 */
export default function BentoGrid() {
  return (
    <section className="w-full min-h-[var(--rb-section-min-h,100vh)] flex items-start lg:items-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:auto-rows-[minmax(380px,auto)] grid-flow-dense">
          <div>
            <Bento37 />
          </div>
          <div>
            <Bento33 />
          </div>
        </div>
      </div>
    </section>
  );
}
