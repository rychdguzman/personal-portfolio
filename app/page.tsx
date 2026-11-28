import Hero34 from "@/components/blocks/hero-34";
import BentoGrid from "@/components/blocks/bento-grid";
import Features17 from "@/components/blocks/features-17";
import Showcase10 from "@/components/blocks/showcase-10";
import Cta8 from "@/components/blocks/cta-8";
import Careers3 from "@/components/blocks/careers-3";
import Contact3 from "@/components/blocks/contact-3";
import Footer2 from "@/components/blocks/footer-2";
import Features16 from "@/components/blocks/features-16";
import Features9 from "@/components/blocks/features-9";
import Integration1 from "@/components/blocks/integration-1";

/**
 * Personal Portfolio
 *
 * Composed with the React Bits Landing Builder.
 *
 * The wrapper below sets `--rb-section-min-h: 0px`, which lets content
 * sections take their natural height instead of each filling the viewport.
 * Remove it and every section reverts to full-screen, which is the correct
 * behaviour when a block is used on its own.
 */
export default function Page() {
  return (
    <main
      className="w-full dark"
      style={{ "--rb-section-min-h": "0px" } as React.CSSProperties}
    >
      <Hero34 />
      <BentoGrid />
      <Features17 />
      {/* <Showcase10 /> */}
      <Integration1 />
      <Cta8 />
      {/* <Features16 /> */}
      <Features9 />
      <Careers3 />
      <Contact3 />
      <Footer2 />
    </main>
  );
}
