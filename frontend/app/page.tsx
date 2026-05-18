import ScrollExpandHero from "@/components/ui/scroll-expansion-hero";

export default function Home() {
  return (
    <ScrollExpandHero
      mediaSrc="/homepage.JPG"
      bgColor="#F5F0E8"
      kicker="University of Oklahoma"
      title="Society of Asian Scientists & Engineers"
      subtitle="Empowering Asian heritage scientists and engineers at OU to achieve their full career potential through professional development, cultural awareness, and community."
      ctas={
        <>
          <a
            href="#about"
            className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-black transition-colors hover:bg-white/90"
          >
            Join SASE
          </a>
          <a
            href="#about"
            className="flex h-12 items-center justify-center rounded-full border border-white/60 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Learn More
          </a>
        </>
      }
    >
      <div id="about" className="mx-auto max-w-3xl text-[#0a0a0a]">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">About SASE at OU</h2>
        <p className="mb-6 text-lg leading-relaxed">
          The OU chapter of the Society of Asian Scientists and Engineers brings together
          STEM students from across the University of Oklahoma. We exist to help our
          members achieve their full career potential through professional development,
          cultural awareness, and community engagement.
        </p>
        <p className="text-lg leading-relaxed">
          Whether you&apos;re looking for your first internship, your next research lab,
          mentorship from upperclassmen and alumni, or simply a community that gets it —
          you&apos;ll find your people here.
        </p>
      </div>
    </ScrollExpandHero>
  );
}
