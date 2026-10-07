import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutPanelTop, ChartColumnBig, CircleUser, Boxes, Megaphone, ChartPie, Settings2,
  UsersRound, PlugZap, Settings, PanelRightClose, Menu as MenuIcon,
} from 'lucide-react';
import {
  Sidebar, SidebarHeader, SidebarGroupLabel, SidebarItem, SidebarPromo,
  TopBar, Avatar, Menu, MenuItem, Tooltip,
} from '@sakaniui/react';
import { Fragment, useEffect, useState } from 'react';
import { SearchExpand } from '../components/SearchExpand';
import { ThemeToggle } from '../components/ThemeToggle';
import styles from './AppShell.module.css';

// Only Dashboard/Sales/Customers have a real <Route> in App.tsx -- the
// rest are shown (real sidebar groups read better with a full list) but
// disabled, rather than navigating to a path with no matching route and
// silently rendering a blank <Outlet />.
const NAV = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/', icon: LayoutPanelTop, label: 'Dashboard', page: true },
      { to: '/sales', icon: ChartColumnBig, label: 'Sales', page: true },
      { to: '/customers', icon: CircleUser, label: 'Customers', page: true },
      { to: '/products', icon: Boxes, label: 'Products', page: false },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      { to: '/marketing', icon: Megaphone, label: 'Marketing', page: false },
      { to: '/analytics', icon: ChartPie, label: 'Analytics', page: false },
      { to: '/operations', icon: Settings2, label: 'Operations', page: false },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { to: '/team', icon: UsersRound, label: 'Team', page: false },
      { to: '/integrations', icon: PlugZap, label: 'Integrations', page: false },
      { to: '/settings', icon: Settings, label: 'Settings', page: false },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

/** True while the viewport is at or below `query`'s breakpoint. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// Below this width the sidebar leaves the layout and becomes a drawer.
const MOBILE_QUERY = '(max-width: 760px)';

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [navOpen, setNavOpen] = useState(false);
  // A drawer is always full width (labels shown); the icon-rail collapse is a
  // desktop-only state. Leaving mobile also closes any open drawer.
  const railCollapsed = isMobile ? false : collapsed;
  useEffect(() => { if (!isMobile) setNavOpen(false); }, [isMobile]);
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);
  const current = ALL_ITEMS.find((item) => item.to === location.pathname) ?? ALL_ITEMS[0];
  const CurrentIcon = current.icon;

  return (
    <div className={styles.root}>
      <div className={styles.scrim} data-open={navOpen} onClick={() => setNavOpen(false)} aria-hidden="true" />
      <div className={styles.sidebarWrap} data-open={navOpen}>
      <Sidebar collapsed={railCollapsed}>
        <SidebarHeader
          type="brand-toggle"
          title="csakani"
          subtitle="Workspace"
          logo="S"
          collapsed={railCollapsed}
          onToggle={() => (isMobile ? setNavOpen(false) : setCollapsed((c) => !c))}
          toggleIcon={PanelRightClose}
        />
        <div className={[styles.navScroll, railCollapsed ? styles['navScroll--collapsed'] : ''].filter(Boolean).join(' ')}>
          {NAV.map((group) => (
            <div key={group.label} className={styles.navGroup}>
              <div className={[styles.navGroupLabelWrap, railCollapsed ? styles['navGroupLabelWrap--collapsed'] : ''].filter(Boolean).join(' ')}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              </div>
              {group.items.map((item) => {
                const navItem = (
                  <SidebarItem
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.to}
                    disabled={!item.page}
                    badge={item.page ? undefined : 'Soon'}
                    onClick={item.page ? () => { navigate(item.to); setNavOpen(false); } : undefined}
                    collapsed={railCollapsed}
                    nativeTooltip={!railCollapsed}
                  />
                );
                return railCollapsed ? (
                  <Tooltip key={item.to} title={item.label} pointer="center-right">
                    {navItem}
                  </Tooltip>
                ) : (
                  <Fragment key={item.to}>{navItem}</Fragment>
                );
              })}
            </div>
          ))}
        </div>
        <div className={[styles.promoWrap, railCollapsed ? styles['promoWrap--collapsed'] : ''].filter(Boolean).join(' ')}>
          <SidebarPromo
            title="Upgrade to Pro"
            description="Unlock advanced reporting and unlimited seats."
            ctaLabel="Upgrade now"
          />
        </div>
      </Sidebar>
      </div>

      <div className={styles.main}>
        <TopBar
          type="minimal"
          showToggle={isMobile}
          toggleIcon={MenuIcon}
          onToggle={() => setNavOpen((o) => !o)}
          left={
            <div className={styles.topbarLeft}>
              <CurrentIcon size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className={styles.topbarTitle}>{current.label}</span>
            </div>
          }
          rightSlot={<>
            <ThemeToggle />
            <SearchExpand />
          </>}
          showActions
          showHelp={false}
          hasUnread
          accountOpen={accountOpen}
          account={
            <div className={styles.accountWrap}>
              <button
                type="button"
                className={styles.accountTrigger}
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <Avatar size="md" src="/avatars/account.png" alt="Account" />
              </button>
              {accountOpen && (
                <div className={styles.accountMenu}>
                  <Menu aria-label="Account menu">
                    <MenuItem onSelect={() => setAccountOpen(false)}>Profile</MenuItem>
                    <MenuItem onSelect={() => setAccountOpen(false)}>Billing</MenuItem>
                    <MenuItem onSelect={() => setAccountOpen(false)}>Sign out</MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          }
        />
        <div className={styles.page}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
