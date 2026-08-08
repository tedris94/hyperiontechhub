import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes,
  type CalculationParameters,
} from 'adhan'
import type { PrayerTime } from './types'

export type PrayerCalculationMethod =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey'

export type PrayerMadhab = 'Shafi' | 'Hanafi'

/** Tenant-configurable prayer location — the only user input for timings */
export type PrayerLocationConfig = {
  latitude: number
  longitude: number
  /** IANA timezone, e.g. Africa/Lagos */
  timezone: string
  calculationMethod: PrayerCalculationMethod
  madhab: PrayerMadhab
  /** Display label e.g. "Abuja, FCT" */
  locationLabel: string
}

/** Galadimawa / Abuja defaults (Anas bn Malik showcase) */
export const ABUJA_PRAYER_LOCATION: PrayerLocationConfig = {
  latitude: 9.0145,
  longitude: 7.3986,
  timezone: 'Africa/Lagos',
  calculationMethod: 'MuslimWorldLeague',
  madhab: 'Shafi',
  locationLabel: 'Abuja, FCT',
}

function buildParams(loc: PrayerLocationConfig): CalculationParameters {
  const factories: Record<PrayerCalculationMethod, () => CalculationParameters> = {
    MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
    Egyptian: CalculationMethod.Egyptian,
    Karachi: CalculationMethod.Karachi,
    UmmAlQura: CalculationMethod.UmmAlQura,
    Dubai: CalculationMethod.Dubai,
    MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
    NorthAmerica: CalculationMethod.NorthAmerica,
    Kuwait: CalculationMethod.Kuwait,
    Qatar: CalculationMethod.Qatar,
    Singapore: CalculationMethod.Singapore,
    Tehran: CalculationMethod.Tehran,
    Turkey: CalculationMethod.Turkey,
  }
  const params = (factories[loc.calculationMethod] || CalculationMethod.MuslimWorldLeague)()
  params.madhab = loc.madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi
  return params
}

/** Calendar Y-M-D in the tenant timezone for a given instant */
export function zonedYmd(
  instant: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

/**
 * Build a Date adhan can use for that civil day.
 * Noon UTC on that Y-M-D avoids DST edge cases for most calculation paths.
 */
function dateForPrayerCalc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
}

export function formatPrayerClock(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/** Short clock without AM/PM for weekly tables (e.g. 5:12) */
export function formatPrayerClockShort(date: Date, timeZone: string): string {
  const full = formatPrayerClock(date, timeZone)
  return full.replace(/\s*(AM|PM)/i, '').trim()
}

export function calculatePrayerTimesForDate(
  loc: PrayerLocationConfig,
  instant: Date = new Date(),
): PrayerTime[] {
  const { year, month, day } = zonedYmd(instant, loc.timezone)
  const date = dateForPrayerCalc(year, month, day)
  const coords = new Coordinates(loc.latitude, loc.longitude)
  const times = new PrayerTimes(coords, date, buildParams(loc))
  const tz = loc.timezone

  return [
    { name: 'Fajr', time: formatPrayerClock(times.fajr, tz) },
    { name: 'Sunrise', time: formatPrayerClock(times.sunrise, tz) },
    { name: 'Dhuhr', time: formatPrayerClock(times.dhuhr, tz) },
    { name: 'Asr', time: formatPrayerClock(times.asr, tz) },
    { name: 'Maghrib', time: formatPrayerClock(times.maghrib, tz) },
    { name: 'Isha', time: formatPrayerClock(times.isha, tz) },
  ]
}

export type WeeklyPrayerRow = {
  day: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

/** Monday-based week containing `instant` (in tenant timezone) */
export function calculateWeeklyPrayerRows(
  loc: PrayerLocationConfig,
  instant: Date = new Date(),
): WeeklyPrayerRow[] {
  const { year, month, day } = zonedYmd(instant, loc.timezone)
  // Find Monday of this week in tenant TZ
  const noonUtc = dateForPrayerCalc(year, month, day)
  // weekday in tenant TZ: Mon=1 … Sun=0 in getUTCDay after we adjust — use formatter
  const weekdayName = new Intl.DateTimeFormat('en-US', {
    timeZone: loc.timezone,
    weekday: 'short',
  }).format(instant)
  const shortToOffset: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  }
  const offset = shortToOffset[weekdayName] ?? 0
  const monday = new Date(noonUtc)
  monday.setUTCDate(monday.getUTCDate() - offset)

  const coords = new Coordinates(loc.latitude, loc.longitude)
  const params = buildParams(loc)
  const tz = loc.timezone

  return WEEKDAYS.map((dayName, i) => {
    const d = new Date(monday)
    d.setUTCDate(monday.getUTCDate() + i)
    const pt = new PrayerTimes(coords, d, params)
    return {
      day: dayName,
      fajr: formatPrayerClockShort(pt.fajr, tz),
      sunrise: formatPrayerClockShort(pt.sunrise, tz),
      dhuhr: formatPrayerClockShort(pt.dhuhr, tz),
      asr: formatPrayerClockShort(pt.asr, tz),
      maghrib: formatPrayerClockShort(pt.maghrib, tz),
      isha: formatPrayerClockShort(pt.isha, tz),
    }
  })
}

export function prayerMethodLabel(method: PrayerCalculationMethod): string {
  const labels: Record<PrayerCalculationMethod, string> = {
    MuslimWorldLeague: 'Muslim World League',
    Egyptian: 'Egyptian General Authority',
    Karachi: 'University of Islamic Sciences, Karachi',
    UmmAlQura: 'Umm al-Qura, Makkah',
    Dubai: 'Dubai',
    MoonsightingCommittee: 'Moonsighting Committee',
    NorthAmerica: 'ISNA (North America)',
    Kuwait: 'Kuwait',
    Qatar: 'Qatar',
    Singapore: 'Singapore',
    Tehran: 'Tehran',
    Turkey: 'Turkey',
  }
  return labels[method] || method
}
