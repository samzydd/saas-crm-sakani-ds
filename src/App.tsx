import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { SalesPage } from './pages/SalesPage';
import { CustomersPage } from './pages/CustomersPage';
import { useEmbeddedThemeControl } from './hooks/useEmbeddedThemeControl';

export default function App() {
  useEmbeddedThemeControl();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
