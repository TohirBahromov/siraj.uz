import { Locale } from "@/i18n/config";

export const WEEKDAY_KEYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

export const WEEKDAY_LABELS: Record<Locale, Record<WeekdayKey, string>> = {
  en: {
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday",
  },
  ru: {
    Monday: "Понедельник",
    Tuesday: "Вторник",
    Wednesday: "Среда",
    Thursday: "Четверг",
    Friday: "Пятница",
    Saturday: "Суббота",
    Sunday: "Воскресенье",
  },
  uz: {
    Monday: "Dushanba",
    Tuesday: "Seshanba",
    Wednesday: "Chorshanba",
    Thursday: "Payshanba",
    Friday: "Juma",
    Saturday: "Shanba",
    Sunday: "Yakshanba",
  },
};

export const WEEKDAY_INDEX: Record<WeekdayKey, number> = Object.fromEntries(
  WEEKDAY_KEYS.map((d, i) => [d, i]),
) as Record<WeekdayKey, number>;

export const WEEKDAY_SHORT_LABELS: Record<
  Locale,
  Record<WeekdayKey, string>
> = {
  en: {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  },
  ru: {
    Monday: "Пн",
    Tuesday: "Вт",
    Wednesday: "Ср",
    Thursday: "Чт",
    Friday: "Пт",
    Saturday: "Сб",
    Sunday: "Вс",
  },
  uz: {
    Monday: "Du",
    Tuesday: "Se",
    Wednesday: "Cho",
    Thursday: "Pa",
    Friday: "Ju",
    Saturday: "Sha",
    Sunday: "Ya",
  },
};
