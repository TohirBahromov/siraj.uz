"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDict } from "@/i18n/context";
import { PatternFormat } from "react-number-format";
import { submitContactForm } from "@/api/contact-api";
import { Loader } from "lucide-react";
import { CompanyInfo } from "@/api/company-api";
import { formatWorkingHours } from "@/lib/working-hours-formatter";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n/config";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: {
    duration: 0.65,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    delay,
  },
});

interface Props {
  contact: CompanyInfo;
}

export function ContactUs({ contact }: Props) {
  const { lang } = useParams<{ lang: Locale }>();
  const dict = useDict();
  const d = dict.contactUs;

  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: string,
  ) =>
    setForm((prev) => ({ ...prev, [e.target.name]: value || e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await submitContactForm(form);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact-us"
      className="relative py-28 bg-[#f5f5f7] overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-125 h-125 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-100 h-100 rounded-full bg-violet-200/40 blur-3xl" />

      {/* Section header */}
      <div className="mx-4">
        <motion.div className="text-center mb-16" {...fadeUp()}>
          <span className="inline-block mb-4 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            {d.badge}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1d1d1f] leading-tight">
            {d.headline}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-[#6e6e73] leading-relaxed">
            {d.subline}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Contact Info Panel */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            {...fadeUp(0.1)}
          >
            <div className=" bg-linear-to-br from-[#4f46e5] via-[#7c3aed] to-[#a855f7] p-4 lg:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-8">{d.infoTitle}</h3>

                <div className="flex flex-col gap-6">
                  {/* Address */}
                  {contact.address && (
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                          <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
                          Address
                        </p>
                        <p className="text-sm text-white/90 leading-relaxed">
                          {contact.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {contact.phoneNumber && (
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.88A16 16 0 0 0 15.12 16.1l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
                          Phone
                        </p>
                        <p className="text-sm text-white/90">
                          {contact.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {contact.email && (
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
                          Email
                        </p>
                        <p className="text-sm text-white/90">{contact.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  {contact.startAt && contact.endAt && (
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
                          Hours
                        </p>
                        <p className="text-sm text-white/90">
                          {formatWorkingHours(
                            {
                              startAt: contact.startAt,
                              endAt: contact.endAt,
                              startDay: contact.startDay,
                              endDay: contact.endDay,
                            },
                            lang,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative circles */}
              <div className="mt-10 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="w-8 h-8 rounded-full bg-white/30" />
              </div>
            </div>
          </motion.div>

          {/* Form Panel */}
          <motion.div className="lg:col-span-3" {...fadeUp(0.2)}>
            <div className="bg-white shadow-xl shadow-black/5 p-4 lg:p-8 h-full">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full min-h-80 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-[#1d1d1f]">
                    {d.success}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 h-full"
                >
                  {/* Name */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact-name"
                        className="text-xs font-semibold text-[#1d1d1f]/60 uppercase tracking-wide"
                      >
                        {d.nameLabel}
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder={d.namePlaceholder}
                        value={form.name}
                        onChange={handleChange}
                        className="rounded-xl border border-black/10 bg-[#f5f5f7] px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#1d1d1f]/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact-phone"
                        className="text-xs font-semibold text-[#1d1d1f]/60 uppercase tracking-wide"
                      >
                        {d.phoneLabel}
                      </label>
                      <PatternFormat
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        format="+998 ## ###-##-##"
                        allowEmptyFormatting
                        required
                        mask="_"
                        placeholder={d.phonePlaceholder}
                        value={form.phone}
                        onChange={handleChange}
                        className="rounded-xl border border-black/10 bg-[#f5f5f7] px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#1d1d1f]/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-semibold text-[#1d1d1f]/60 uppercase tracking-wide"
                    >
                      {d.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder={d.messagePlaceholder}
                      value={form.message}
                      onChange={handleChange}
                      className="rounded-xl border border-black/10 bg-[#f5f5f7] px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#1d1d1f]/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none h-full"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                  >
                    {loading ? <Loader /> : d.cta}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
