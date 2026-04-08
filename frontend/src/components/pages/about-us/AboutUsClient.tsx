"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import type { StaffMember } from "@/api/staff-api";
import type { Dictionary } from "@/i18n/dictionaries";

const VALUE_ICONS = [
  <svg key="innovation" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>,
  <svg key="quality" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  <svg key="sustainability" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.727-3.558" />
  </svg>,
  <svg key="community" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
  </svg>,
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
});

type AboutUsDict = Dictionary["aboutUs"];

interface Props {
  d: AboutUsDict;
  staff: StaffMember[];
}

export function AboutUsClient({ d, staff }: Props) {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-[#0a0a0b]">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <Container>
          <motion.div className="relative z-10 mx-auto max-w-4xl text-center" {...fadeUp()}>
            <span className="inline-block mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/50 backdrop-blur-sm">
              Who we are
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
              {d.heroTitle}
            </h1>
            <p className="mt-7 text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto font-light">
              {d.heroSubline}
            </p>
          </motion.div>
        </Container>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── Mission ─── */}
      <section className="py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp()}>
              <span className="inline-block mb-5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                {d.missionBadge}
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#0a0a0b] leading-[1.15] tracking-tight">
                {d.missionTitle}
              </h2>
              <p className="mt-6 text-lg text-[#6e6e73] leading-relaxed">
                {d.missionText}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              {...fadeUp(0.15)}
            >
              {[
                { number: "5+", label: "Years of excellence" },
                { number: "50K+", label: "Happy customers" },
                { number: "99%", label: "Satisfaction rate" },
                { number: "24/7", label: "Customer support" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#f0f0f0] bg-[#fafafa] p-6 text-center"
                >
                  <p className="text-3xl font-bold text-[#0a0a0b] tracking-tight">
                    {stat.number}
                  </p>
                  <p className="mt-1.5 text-sm text-[#6e6e73]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── Divider ─── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#e5e5e7] to-transparent mx-auto max-w-5xl" />

      {/* ─── Values ─── */}
      <section className="py-32 bg-white">
        <Container>
          <motion.div className="text-center mb-16" {...fadeUp()}>
            <span className="inline-block mb-5 rounded-full bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-600">
              {d.valuesBadge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0a0a0b] leading-tight tracking-tight">
              {d.valuesTitle}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {d.values.map((value, i) => (
              <motion.div
                key={i}
                className="group relative rounded-2xl border border-[#f0f0f0] bg-white p-7 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
                {...fadeUp(i * 0.08)}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                  {VALUE_ICONS[i]}
                </div>
                <h3 className="text-base font-semibold text-[#0a0a0b] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Staff / Team ─── */}
      <section className="py-32 bg-[#f5f5f7]">
        <Container>
          <motion.div className="text-center mb-16" {...fadeUp()}>
            <span className="inline-block mb-5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {d.staffBadge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0a0a0b] leading-tight tracking-tight">
              {d.staffTitle}
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base text-[#6e6e73] leading-relaxed">
              {d.staffSubline}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((member, i) => (
              <motion.div
                key={member.id}
                className="group relative"
                {...fadeUp(i * 0.08)}
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-[#0a0a0b]">
                  {/* Photo */}
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top opacity-90 group-hover:opacity-75 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                  />

                  {/* Persistent bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Name + position pinned to bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-400 ease-out">
                    {/* Accent line */}
                    <div className="w-8 h-0.5 rounded-full bg-indigo-400 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
                    <h3 className="text-[15px] font-semibold text-white leading-snug">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-white/60 tracking-wide uppercase">
                      {member.position}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
