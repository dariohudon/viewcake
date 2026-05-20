import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col bg-gray-950 text-white">

      {/* ─────────────────── HERO ─────────────────────────────── */}
      <section className="relative min-h-svh flex flex-col overflow-hidden">

        {/* Background image */}
        <Image
          src="/viewcake-hero-futuristic.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />

        {/* Dark base — crushes mid-image brightness uniformly */}
        <div
          className="absolute inset-0 bg-black/70"
          aria-hidden="true"
        />

        {/* Radial vignette — edges darker, centre lets the teal glow breathe */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Hero content — flex-1 so it fills the viewport, text centered */}
        <div className="relative z-10 flex flex-col flex-1 items-center justify-center text-center px-6 pt-8 pb-20">

          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-teal-400/70 mb-5">
            Real‑time presentation amplification
          </p>

          <h1
            className="font-bold tracking-tighter leading-none text-white mb-6"
            style={{ fontSize: "clamp(3.25rem, 11vw, 7.5rem)" }}
          >
            Viewcake
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-[36rem] mb-10 leading-relaxed">
            Upload a deck, share a code, and let your audience save
            slides, add notes, ask questions, and leave with their
            own private takeaways.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-teal-500 text-black px-8 py-3.5 text-sm font-bold hover:bg-teal-400 active:bg-teal-600 transition-colors"
            >
              Presenter login
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 text-white px-8 py-3.5 text-sm font-semibold hover:border-teal-500/50 hover:bg-white/[0.06] backdrop-blur-sm transition-colors"
            >
              Join a session
            </Link>
          </div>
        </div>

        {/* Hard fade at the bottom into the next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-gray-950 to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ─────────────────── WHAT WE DO ───────────────────────── */}
      <section className="bg-gray-950 py-20 px-6">
        <div className="max-w-4xl mx-auto">

          <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-teal-500 mb-3 text-center">
            What Viewcake does
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            One session. Something useful for everyone.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Live slide control",
                body: "Navigate your deck in real time. The audience view follows along instantly — no refresh needed.",
              },
              {
                title: "Audience interaction",
                body: "Audience members save slides, add private notes, and send questions directly to the presenter.",
              },
              {
                title: "Private takeaways",
                body: "Every participant gets a private link to their saved slides and notes. No account required.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white/[0.04] border border-white/[0.08] px-6 py-6 hover:border-teal-800/50 transition-colors"
              >
                <h3 className="text-sm font-semibold text-teal-300 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────────── */}
      <section className="bg-[#060c0b] py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">

          <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-teal-500 mb-3 text-center">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Three simple steps.
          </h2>

          <div className="space-y-10">
            {[
              {
                n: "01",
                title: "Upload your deck",
                body: "Export your slides as a PDF and upload it to Viewcake. Each page becomes a live slide ready to present.",
              },
              {
                n: "02",
                title: "Share the code",
                body: "Start a session and share the short join code. Audience joins from any browser — no app, no account.",
              },
              {
                n: "03",
                title: "Everyone keeps what matters",
                body: "Audience members save slides, write private notes, ask questions. When it ends, everyone has a takeaways page they can revisit.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <span className="font-mono text-2xl font-bold text-teal-500 tabular-nums shrink-0 pt-0.5">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA ──────────────────────────────── */}
      <section className="bg-gray-950 py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">

          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Ready to use it?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 flex flex-col hover:border-teal-800/50 transition-colors">
              <h3 className="text-sm font-semibold text-teal-300 mb-1.5">
                For presenters
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-1">
                Log in, upload a PDF deck, and start a live session in minutes.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-teal-500 text-black px-5 py-2.5 text-sm font-bold hover:bg-teal-400 transition-colors"
              >
                Presenter login
              </Link>
            </div>

            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 flex flex-col hover:border-teal-800/50 transition-colors">
              <h3 className="text-sm font-semibold text-teal-300 mb-1.5">
                For audience
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-1">
                Enter the session code and follow along. Save what matters to you.
              </p>
              <Link
                href="/join"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 text-white px-5 py-2.5 text-sm font-semibold hover:border-teal-500/50 hover:bg-white/[0.06] transition-colors"
              >
                Join a session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ───────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-8 px-6 bg-gray-950">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/viewcake-logo.png"
            alt="Viewcake"
            width={16}
            height={16}
            className="rounded-full opacity-40"
          />
          <span className="text-xs text-gray-600">Viewcake</span>
        </div>
      </footer>

    </div>
  );
}
