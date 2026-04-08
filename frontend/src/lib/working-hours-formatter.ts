import { WEEKDAY_KEYS, WEEKDAY_SHORT_LABELS } from "@/constants/weekdays";
import { Locale } from "@/i18n/config";

interface WorkingHoursParams {
  startDay: number;
  endDay: number;
  startAt: string;
  endAt: string;
}

export const formatWorkingHours = (
  data: WorkingHoursParams,
  locale: Locale = "uz",
): string => {
  const { startDay, endDay, startAt, endAt } = data;

  const startKey = WEEKDAY_KEYS[startDay];
  const endKey = WEEKDAY_KEYS[endDay];

  const startLabel = WEEKDAY_SHORT_LABELS[locale][startKey];
  const endLabel = WEEKDAY_SHORT_LABELS[locale][endKey];

  const timeRange = `${startAt} – ${endAt}`;
  const dayRange =
    startDay === endDay ? startLabel : `${startLabel} – ${endLabel}`;

  return `${dayRange}, ${timeRange}`;
};
