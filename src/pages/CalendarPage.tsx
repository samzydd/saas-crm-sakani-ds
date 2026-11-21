import { useMemo } from 'react';
import { MonthCalendarBlock } from '@sakaniui/react/blocks';
import { CRM_CALENDARS, crmEvents } from '../lib/calendarEvents';
import styles from './Page.module.css';

/** Demos, calls and renewals on a month. Drag an event to another day to move it; click one for its card. */
export function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const events = useMemo(() => crmEvents(today), [today]);
  return (
    <>
      <div className={styles.pageHeaderRow}>
        <p className={styles.pageHeaderDesc}>Demos, customer calls and renewals in one place. Drag an event to move it.</p>
      </div>
      <MonthCalendarBlock events={events} calendars={CRM_CALENDARS} defaultDate={today} today={today} />
    </>
  );
}
