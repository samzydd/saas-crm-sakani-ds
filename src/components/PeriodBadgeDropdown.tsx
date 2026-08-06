import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Badge, Menu, MenuItem } from 'sakani-design-system';
import styles from './PeriodBadgeDropdown.module.css';

const DEFAULT_OPTIONS = ['This month', 'Last month', 'This quarter', 'This year'];

interface PeriodBadgeDropdownProps {
  defaultValue?: string;
  options?: string[];
  onChange?: (value: string) => void;
}

/** Badge-styled (not ghost-button) period picker — same dropdown mechanics
 * as PeriodDropdown, but reads as a pill with a trailing chevron instead of
 * a button, for panels that want the "This month" badge to be interactive. */
export function PeriodBadgeDropdown({
  defaultValue = 'This month', options = DEFAULT_OPTIONS, onChange,
}: PeriodBadgeDropdownProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (option: string) => {
    setValue(option);
    setOpen(false);
    onChange?.(option);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Badge variant="neutral" emphasis="subtle" rightIcon={<ChevronDown size={12} strokeWidth={1.5} />}>
          {value}
        </Badge>
      </button>
      {open && (
        <div className={styles.menu}>
          <Menu aria-label="Select period">
            {options.map((option) => (
              <MenuItem
                key={option}
                state={option === value ? 'checked' : 'default'}
                onSelect={() => select(option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
}
