import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button, Menu, MenuItem } from 'sakani-design-system';
import styles from './PeriodDropdown.module.css';

const OPTIONS = ['1 month', '2 months', '3 months', '6 months'];

interface PeriodDropdownProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/** "Last N months" chart-range picker — ghost/sm button that opens a Menu. */
export function PeriodDropdown({ defaultValue = '6 months', onChange }: PeriodDropdownProps) {
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
      <Button
        variant="ghost"
        size="sm"
        rightIcon={<ChevronDown size={16} strokeWidth={1.5} />}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Last {value}
      </Button>
      {open && (
        <div className={styles.menu}>
          <Menu aria-label="Select time range">
            {OPTIONS.map((option) => (
              <MenuItem
                key={option}
                state={option === value ? 'checked' : 'default'}
                onSelect={() => select(option)}
              >
                Last {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
}
