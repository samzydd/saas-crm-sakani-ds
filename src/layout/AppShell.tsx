import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutPanelTop, ChartColumnBig, CircleUser, Boxes, Megaphone, ChartPie, Settings2,
  UsersRound, PlugZap, Settings, Search, PanelRightOpen,
} from 'lucide-react';
import {
  Sidebar, SidebarHeader, SidebarGroupLabel, SidebarItem, SidebarPromo,
  TopBar, IconButton, Avatar, Menu, MenuItem,
} from 'sakani-design-system';
import { useState } from 'react';
import styles from './AppShell.module.css';

const NAV = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/', icon: LayoutPanelTop, label: 'Dashboard' },
      { to: '/sales', icon: ChartColumnBig, label: 'Sales' },
      { to: '/customers', icon: CircleUser, label: 'Customers' },
      { to: '/products', icon: Boxes, label: 'Products' },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      { to: '/marketing', icon: Megaphone, label: 'Marketing' },
      { to: '/analytics', icon: ChartPie, label: 'Analytics' },
      { to: '/operations', icon: Settings2, label: 'Operations' },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { to: '/team', icon: UsersRound, label: 'Team' },
      { to: '/integrations', icon: PlugZap, label: 'Integrations' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const current = ALL_ITEMS.find((item) => item.to === location.pathname) ?? ALL_ITEMS[0];
  const CurrentIcon = current.icon;

  return (
    <div className={styles.root}>
      <Sidebar collapsed={collapsed}>
        <SidebarHeader
          type="brand-toggle"
          title="csakani"
          subtitle="Workspace"
          logo="S"
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          toggleIcon={PanelRightOpen}
        />
        <div className={styles.navScroll}>
          {NAV.map((group) => (
            <div key={group.label} className={styles.navGroup}>
              {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
              {group.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  onClick={() => navigate(item.to)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          ))}
        </div>
        {!collapsed && (
          <div className={styles.promoWrap}>
            <SidebarPromo
              title="Upgrade to Pro"
              description="Unlock advanced reporting and unlimited seats."
              ctaLabel="Upgrade now"
            />
          </div>
        )}
      </Sidebar>

      <div className={styles.main}>
        <TopBar
          type="minimal"
          showToggle={false}
          left={
            <div className={styles.topbarLeft}>
              <CurrentIcon size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className={styles.topbarTitle}>{current.label}</span>
            </div>
          }
          rightSlot={<IconButton icon={Search} variant="ghost" size="sm" aria-label="Search" />}
          showActions
          showHelp={false}
          hasUnread
          account={
            <div className={styles.accountWrap}>
              <button
                type="button"
                className={styles.accountTrigger}
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <Avatar size="sm" initials="SD" />
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
