import type { CalendarEventColor, CalendarEventData } from '@sakaniui/react';

export interface CrmCalendar {
  id: string;
  name: string;
  color: CalendarEventColor;
}

/** What the CRM's team books time for. An event's `meta.calendar` is one of these ids. */
export const CRM_CALENDARS: CrmCalendar[] = [
  { id: 'demos', name: 'Demos', color: 'blue' },
  { id: 'calls', name: 'Customer calls', color: 'green' },
  { id: 'renewals', name: 'Renewals', color: 'orange' },
  { id: 'internal', name: 'Internal', color: 'purple' },
];

/**
 * A month of CRM work, placed around today so the page always looks current. This week is busy (the Monday of this week
 * is day 0 of the first group); the rest is spread over the whole month shown, from its first day, and skips this week.
 * Swap this for your own query.
 */
export function crmEvents(today: Date): CalendarEventData[] {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const week = (day: number, h: number, m = 0) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + day, h, m);
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const month = (day: number, h: number, m = 0) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + day, h, m);
  const color = (id: string) => CRM_CALENDARS.find((c) => c.id === id)!.color;
  let n = 0;
  const ev = (title: string, cal: string, start: Date, end: Date, extra: Partial<CalendarEventData> = {}): CalendarEventData => ({
    id: `crm-${++n}`,
    title,
    start,
    end,
    color: color(cal),
    meta: { calendar: cal },
    ...extra,
  });

  // this week: a full, busy few days
  const busy = [
    ev('Weekly sales sync', 'internal', week(0, 9, 30), week(0, 10, 15), { location: 'Room 4B' }),
    ev('Call: Harbor & Co', 'calls', week(0, 14), week(0, 14, 30), { location: 'Google Meet' }),
    ev('Demo: Fieldstone Bank', 'demos', week(1, 10), week(1, 11), { location: 'Zoom' }),
    ev('Renewal: Atlas Freight', 'renewals', week(1, 15), week(1, 15, 45)),
    ev('Onboarding: Brightpath', 'calls', week(2, 9), week(2, 10), { location: 'Zoom' }),
    ev('Demo: Orbit Health', 'demos', week(2, 13), week(2, 14), { location: 'Google Meet' }),
    ev('Forecast review', 'internal', week(2, 16), week(2, 17)),
    ev('Call: Meridian Foods', 'calls', week(3, 10, 30), week(3, 11)),
    ev('Renewal: Juniper Labs', 'renewals', week(3, 14), week(3, 15), { location: 'Zoom' }),
    ev('Demo: Cedar Capital', 'demos', week(3, 16), week(3, 17)),
    ev('Quarter close', 'renewals', week(4, 0), week(4, 23, 59), { allDay: true }),
    ev('Customer advisory board', 'calls', week(4, 11), week(4, 12, 30), { location: 'HQ, floor 3' }),
    ev('Team lunch', 'internal', week(4, 12, 30), week(4, 13, 30)),
  ];

  // the rest of the month, a couple of things a week; days inside this week are left to the group above
  const weekStart = monday.getTime();
  const weekEnd = week(7, 0).getTime();
  const outsideThisWeek = (e: CalendarEventData) => e.end.getTime() < weekStart || e.start.getTime() >= weekEnd;
  const rest = [
    ev('Pipeline review', 'internal', month(1, 10), month(1, 11)),
    ev('Demo: Northwind Studio', 'demos', month(2, 14), month(2, 15), { location: 'Zoom' }),
    ev('Call: Lumen Logistics', 'calls', month(3, 11, 30), month(3, 12)),
    ev('Renewal: Quartz Software', 'renewals', month(4, 10), month(4, 11)),
    ev('Sales kickoff', 'internal', month(6, 0), month(7, 23, 59), { allDay: true }),
    ev('Demo: Willow Retail', 'demos', month(8, 15), month(8, 16)),
    ev('Call: Summit Energy', 'calls', month(9, 11), month(9, 11, 30)),
    ev('Renewal: Pinecrest', 'renewals', month(10, 10), month(10, 11)),
    ev('Demo: Ironwood Group', 'demos', month(11, 14), month(11, 15), { location: 'Zoom' }),
    ev('Onboarding: Coral Systems', 'calls', month(12, 9, 30), month(12, 10, 30)),
    ev('Product roadmap', 'internal', month(14, 10), month(14, 11, 30), { location: 'Room 2A' }),
    ev('Renewal: Bluebird', 'renewals', month(15, 13), month(15, 14)),
    ev('Demo: Granite Insurance', 'demos', month(16, 11), month(16, 12)),
    ev('Call: Aster Dental', 'calls', month(17, 9, 30), month(17, 10)),
    ev('Conference: SaaS Connect', 'internal', month(19, 0), month(21, 23, 59), { allDay: true }),
    ev('Call: Lakeside Dental', 'calls', month(22, 9, 30), month(22, 10)),
    ev('Demo: Redwood Partners', 'demos', month(23, 15), month(23, 16)),
    ev('Renewal: Opal Media', 'renewals', month(24, 10), month(24, 11)),
    ev('Forecast review', 'internal', month(25, 16), month(25, 17)),
    ev('Demo: Sable Analytics', 'demos', month(27, 13), month(27, 14), { location: 'Google Meet' }),
    ev('Renewal: Tidewater', 'renewals', month(28, 11), month(28, 12)),
    ev('Month-end review', 'internal', month(29, 15), month(29, 16)),
  ].filter(outsideThisWeek);

  return [...rest, ...busy];
}
