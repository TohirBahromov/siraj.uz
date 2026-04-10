"use client";

import {
  getCompanyInfo,
  updateCompanyInfo,
  UpdateCompanyInfoDto,
} from "@/api/company-api";
import { WEEKDAY_KEYS, WEEKDAY_LABELS } from "@/constants/weekdays";
import { Locale } from "@/i18n/config";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PatternFormat } from "react-number-format";
import YandexMapPicker from "./ymaps/Picker";
import { MAP_DEFAULT_CENTER } from "@/constants";

function buildFormState(
  overrides?: Partial<UpdateCompanyInfoDto>,
): UpdateCompanyInfoDto {
  return {
    latitude: 0,
    longitude: 0,
    address: "",
    phoneNumber: "",
    email: "",
    startDay: 1, // Monday
    endDay: 4, // Friday
    startAt: "09:00",
    endAt: "18:00",
    ...overrides,
  };
}

function isFormDirty(
  current: UpdateCompanyInfoDto,
  saved: UpdateCompanyInfoDto,
): boolean {
  return (
    current.latitude !== saved.latitude ||
    current.longitude !== saved.longitude ||
    current.address !== saved.address ||
    current.phoneNumber !== saved.phoneNumber ||
    current.email !== saved.email ||
    current.startDay !== saved.startDay ||
    current.endDay !== saved.endDay ||
    current.startAt !== saved.startAt ||
    current.endAt !== saved.endAt
  );
}

export default function CompanyInfoForm({
  googleMapsApiKey,
}: {
  googleMapsApiKey: string;
}) {
  const { lang } = useParams<{ lang: Locale }>();
  const LABELS = WEEKDAY_LABELS[lang];

  const [saved, setSaved] = useState<UpdateCompanyInfoDto>(buildFormState);
  const [form, setForm] = useState<UpdateCompanyInfoDto>(buildFormState);

  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    let cancelled = false;
    getCompanyInfo()
      .then((data) => {
        if (cancelled) return;
        const populated = buildFormState({
          ...data,
          longitude: Number(data.longitude),
          latitude: Number(data.latitude),
        });
        setForm(populated);
        setSaved(populated);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const load = (): Promise<void> =>
      new Promise((resolve, reject) => {
        if (window.ymaps?.ready) {
          window.ymaps.ready(resolve);
          return;
        }
        const existing = document.getElementById("ymaps-script");
        if (existing) {
          existing.addEventListener("load", () => window.ymaps.ready(resolve));
          existing.addEventListener("error", reject);
          return;
        }
        const script = document.createElement("script");
        script.id = "ymaps-script";
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${googleMapsApiKey}&lang=${lang}_UZ`;
        script.async = true;
        script.onload = () => window.ymaps.ready(resolve);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    load()
      .then(() => setMapsReady(true))
      .catch(() => setMapsError(true));
  }, [googleMapsApiKey, lang]);

  const dirty = isFormDirty(form, saved);

  const handleLocationPick = useCallback(
    (lat: number, lng: number, address: string) => {
      setForm((f) => ({
        ...f,
        latitude: lat,
        longitude: lng,
        address: address || f.address,
      }));
      setErrors((e) => ({ ...e, location: undefined, address: undefined }));
    },
    [],
  );

  const setField = <K extends keyof UpdateCompanyInfoDto>(
    key: K,
    value: UpdateCompanyInfoDto[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleStartDayChange = (idx: number) => {
    setForm((f) => ({
      ...f,
      startDay: idx,
      endDay: f.endDay <= idx ? Math.min(idx + 1, 6) : f.endDay,
    }));
    setErrors((e) => ({ ...e, endDay: undefined }));
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (form.latitude == null || form.longitude == null)
      errs.location = "Pick a location on the map.";
    if (!form.address.trim()) errs.address = "Address is required.";
    const rawPhone = form.phoneNumber.replace(/\D/g, "");
    if (rawPhone.length < 12) errs.phoneNumber = "Enter a valid phone number.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email.";
    if (form.endDay <= form.startDay)
      errs.endDay = "End day must be after start day.";
    if (form.endAt <= form.startAt)
      errs.endTime = "End time must be after start time.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await updateCompanyInfo(form);
      setSaved({ ...form });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    [
      "w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all",
      "focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400",
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-stone-200 hover:border-stone-300",
    ].join(" ");

  const selectCls = (field: string) => inputCls(field) + " cursor-pointer";

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {[280, 160, 220].map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-100 p-6 animate-pulse"
            >
              <div className="h-4 bg-stone-100 rounded w-24 mb-5" />
              <div className={`h-[${h}px] bg-stone-100 rounded-xl`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Company</h1>
      </div>
      <div>
        <div className="space-y-6">
          <Section num="01" title="Location">
            <Field label="Address" error={errors.address}>
              <input
                type="text"
                className={inputCls("address")}
                placeholder="e.g. Yunusobod, Anorzor, 99"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </Field>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Pin on map
                <span className="ml-1 font-normal normal-case text-stone-400">
                  — click to place marker
                </span>
              </label>
              {mapsError ? (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <span>⚠</span> Yandex Maps failed to load. Check your API key.
                </div>
              ) : !mapsReady ? (
                <div className="w-full h-64 rounded-xl bg-stone-100 animate-pulse" />
              ) : (
                <YandexMapPicker
                  lat={form.latitude || MAP_DEFAULT_CENTER[0]}
                  lng={form.longitude || MAP_DEFAULT_CENTER[1]}
                  onPick={handleLocationPick}
                />
              )}
              {errors.location && (
                <p className="mt-1 text-xs text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="flex gap-3 mt-3">
              <CoordBadge label="Latitude" value={form.latitude} />
              <CoordBadge label="Longitude" value={form.longitude} />
            </div>
          </Section>

          {/* ── 02 Contact ── */}
          <Section num="02" title="Contact">
            <Field label="Phone number" error={errors.phoneNumber}>
              <PatternFormat
                format="+998 ## ###-##-##"
                mask="_"
                allowEmptyFormatting
                className={inputCls("phoneNumber")}
                value={form.phoneNumber}
                onChange={(e) => {
                  setField("phoneNumber", e.target.value);
                  setErrors((e) => ({ ...e, phoneNumber: undefined }));
                }}
              />
            </Field>

            <Field label="Email address" error={errors.email}>
              <input
                type="email"
                className={inputCls("email")}
                placeholder="hello@company.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </Field>
          </Section>

          {/* ── 03 Working Hours ── */}
          <Section num="03" title="Working Hours">
            <div className="grid grid-cols-2 gap-4">
              <Field label="From day" error={undefined}>
                <select
                  className={selectCls("startDay")}
                  value={form.startDay}
                  onChange={(e) => handleStartDayChange(Number(e.target.value))}
                >
                  {WEEKDAY_KEYS.slice(0, -1).map((d, i) => (
                    <option key={i} value={i}>{LABELS[d]}</option>
                  ))}
                </select>
              </Field>

              <Field label="To day" error={errors.endDay}>
                <select
                  className={selectCls("endDay")}
                  value={form.endDay}
                  onChange={(e) => {
                    setField("endDay", Number(e.target.value));
                    setErrors((e) => ({ ...e, endDay: undefined }));
                  }}
                >
                  {WEEKDAY_KEYS.map((d, i) => ({ d, i }))
                    .filter(({ i }) => i > form.startDay)
                    .map(({ d, i }) => (
                      <option key={i} value={i}>{LABELS[d]}</option>
                    ))}
                </select>
              </Field>

              <Field label="Opens at" error={undefined}>
                <input
                  type="time"
                  className={inputCls("startTime")}
                  value={form.startAt}
                  onChange={(e) => setField("startAt", e.target.value)}
                />
              </Field>

              <Field label="Closes at" error={errors.endTime}>
                <input
                  type="time"
                  className={inputCls("endTime")}
                  value={form.endAt}
                  onChange={(e) => setField("endAt", e.target.value)}
                />
              </Field>
            </div>

            {/* Live preview */}
            <div className="mt-4 flex items-center gap-2 text-sm text-stone-600 bg-stone-100 rounded-lg px-4 py-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                {LABELS[WEEKDAY_KEYS[form.startDay]]} –{" "}
                {LABELS[WEEKDAY_KEYS[form.endDay]]},{" "}
                <span className="font-medium">{form.startAt}</span> →{" "}
                <span className="font-medium">{form.endAt}</span>
              </span>
            </div>
          </Section>

          {/* ── Submit ── */}
          <div className="flex items-center justify-between pt-2 pb-10">
            {!dirty ? (
              <p className="text-xs text-stone-400">No changes to save.</p>
            ) : (
              <span />
            )}
            <button
              className={[
                "ml-auto px-6 py-2.5 rounded-lg text-sm font-semibold transition-all",
                dirty && !submitting
                  ? "bg-stone-800 text-white hover:bg-stone-700 shadow-sm"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed",
              ].join(" ")}
              onClick={handleSubmit}
              disabled={!dirty || submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save company info"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-bold text-stone-400 tabular-nums">
          {num}
        </span>
        <h2 className="text-base font-semibold text-stone-700">{title}</h2>
        <div className="flex-1 h-px bg-stone-100" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function CoordBadge({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-4 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </p>
      <p className="text-sm font-mono text-stone-700 mt-0.5">
        {value != null ? value : "—"}
      </p>
    </div>
  );
}
