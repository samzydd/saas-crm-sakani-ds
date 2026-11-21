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
 * A month of CRM work, placed around today so the page always looks current: the Monday of this week is day 0, and
 * every event is an offset from it. Swap this for your own query.
 */
export function crmEvents(today: Date): CalendarEventData[] {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const at = (day: number, h: number, m = 0) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + day, h, m);
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
  return [
    // last week
    ev('Pipeline review', 'internal', at(-6, 10), at(-6, 11)),
    ev('Demo: Northwind Studio', 'demos', at(-5, 14), at(-5, 15), { location: 'Zoom' }),
    ev('Call: Lumen Logistics', 'calls', at(-3, 11, 30), at(-3, 12)),
    // this week
    ev('Weekly sales sync', 'internal', at(0, 9, 30), at(0, 10, 15), { location: 'Room 4B' }),
    ev('Call: Harbor & Co', 'calls', at(0, 14), at(0, 14, 30), { location: 'Google Meet' }),
    ev('Demo: Fieldstone Bank', 'demos', at(1, 10), at(1, 11), { location: 'Zoom' }),
    ev('Renewal: Atlas Freight', 'renewals', at(1, 15), at(1, 15, 45)),
    ev('Onboarding: Brightpath', 'calls', at(2, 9), at(2, 10), { location: 'Zoom' }),
    ev('Demo: Orbit Health', 'demos', at(2, 13), at(2, 14), { location: 'Google Meet' }),
    ev('Forecast review', 'internal', at(2, 16), at(2, 17)),
    ev('Call: Meridian Foods', 'calls', at(3, 10, 30), at(3, 11)),
    ev('Renewal: Juniper Labs', 'renewals', at(3, 14), at(3, 15), { location: 'Zoom' }),
    ev('Demo: Cedar Capital', 'demos', at(3, 16), at(3, 17)),
    ev('Quarter close', 'renewals', at(4, 0), at(4, 23, 59), { allDay: true }),
    ev('Customer advisory board', 'calls', at(4, 11), at(4, 12, 30), { location: 'HQ, floor 3' }),
    ev('Team lunch', 'internal', at(4, 12, 30), at(4, 13, 30)),
    // next weeks
    ev('Sales kickoff', 'internal', at(7, 0), at(8, 23, 59), { allDay: true }),
    ev('Demo: Willow Retail', 'demos', at(7, 15), at(7, 16)),
    ev('Call: Summit Energy', 'calls', at(8, 11), at(8, 11, 30)),
    ev('Renewal: Pinecrest', 'renewals', at(9, 10), at(9, 11)),
    ev('Demo: Ironwood Group', 'demos', at(10, 14), at(10, 15), { location: 'Zoom' }),
    ev('Onboarding: Coral Systems', 'calls', at(11, 9, 30), at(11, 10, 30)),
    ev('Product roadmap', 'internal', at(14, 10), at(14, 11, 30), { location: 'Room 2A' }),
    ev('Renewal: Bluebird', 'renewals', at(15, 13), at(15, 14)),
    ev('Demo: Granite Insurance', 'demos', at(16, 11), at(16, 12)),
    ev('Conference: SaaS Connect', 'internal', at(17, 0), at(19, 23, 59), { allDay: true }),
    ev('Call: Lakeside Dental', 'calls', at(21, 9, 30), at(21, 10)),
    ev('Demo: Redwood Partners', 'demos', at(22, 15), at(22, 16)),
    ev('Renewal: Opal Media', 'renewals', at(24, 10), at(24, 11)),
  ];
}
