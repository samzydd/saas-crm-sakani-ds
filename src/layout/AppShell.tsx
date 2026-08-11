import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutPanelTop, ChartColumnBig, CircleUser, Boxes, Megaphone, ChartPie, Settings2,
  UsersRound, PlugZap, Settings, PanelRightClose,
} from 'lucide-react';
import {
  Sidebar, SidebarHeader, SidebarGroupLabel, SidebarItem, SidebarPromo,
  TopBar, Avatar, Menu, MenuItem, Tooltip,
} from 'sakani-design-system';
import { Fragment, useState } from 'react';
import { SearchExpand } from '../components/SearchExpand';
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
          toggleIcon={PanelRightClose}
        />
        <div className={[styles.navScroll, collapsed ? styles['navScroll--collapsed'] : ''].filter(Boolean).join(' ')}>
          {NAV.map((group) => (
            <div key={group.label} className={styles.navGroup}>
              <div className={[styles.navGroupLabelWrap, collapsed ? styles['navGroupLabelWrap--collapsed'] : ''].filter(Boolean).join(' ')}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              </div>
              {group.items.map((item) => {
                const navItem = (
                  <SidebarItem
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.to}
                    onClick={() => navigate(item.to)}
                    collapsed={collapsed}
                    nativeTooltip={!collapsed}
                  />
                );
                return collapsed ? (
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
        <div className={[styles.promoWrap, collapsed ? styles['promoWrap--collapsed'] : ''].filter(Boolean).join(' ')}>
          <SidebarPromo
            title="Upgrade to Pro"
            description="Unlock advanced reporting and unlimited seats."
            ctaLabel="Upgrade now"
          />
        </div>
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
          rightSlot={<SearchExpand />}
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
