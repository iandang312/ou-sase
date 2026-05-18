import Image from "next/image";

export default function Home() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden">
      <Image
        src="/homepage.JPG"
        alt=""
        fill
        sizes="100vw"
        preload
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6 px-6 text-center text-white">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/80">
          University of Oklahoma
        </p>
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Society of Asian Scientists &amp; Engineers
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
          Empowering Asian heritage scientists and engineers at OU to achieve their full
          career potential through professional development, cultural awareness, and community.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <a
            href="#join"
            className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-black transition-colors hover:bg-white/90"
          >
            Join SASE
          </a>
          <a
            href="#about"
            className="flex h-12 items-center justify-center rounded-full border border-white/60 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sponsor Us
          </a>
        </div>
      </div>
    </section>
  );
}
