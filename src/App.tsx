import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'sileo';
import { PurchaseNotifications } from './components/PurchaseNotifications';
import { SalesAssistantWidget } from './components/SalesAssistantWidget';
import { DashboardLayout } from './components/DashboardLayout';
import { RequireAuth } from './components/RequireAuth';
import { GuestOnly } from './components/GuestOnly';
import { LoggedInRedirect } from './components/LoggedInRedirect';
import {
  LandingPage,
  InvitationsPage,
  BookDemoPage,
  MeetingsPage,
  PlaceholderPage,
} from './pages';
import './App.css';

function AppLayout() {
  const { user } = useAuth();

  return (
    <>
      {!user && <PurchaseNotifications />}
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <LoggedInRedirect to="/meetings">
              <LandingPage />
            </LoggedInRedirect>
          }
        />
        <Route
          path="/book-demo"
          element={
            <GuestOnly>
              <BookDemoPage />
            </GuestOnly>
          }
        />
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="invitations" element={<InvitationsPage />} />
            <Route path="subscription" element={<PlaceholderPage />} />
            <Route path="settings" element={<PlaceholderPage />} />
            <Route path="terms" element={<PlaceholderPage />} />
          </Route>
        </Route>
        <Route path="/dashboard" element={<Navigate to="/meetings" replace />} />
      </Routes>
      {!user && <Footer />}
      {!user && <SalesAssistantWidget />}
    </>
  );
}

function App() {
  return (
    <>
      <Toaster
        position="bottom-left"
        offset={{ bottom: 18, left: 18 }}
        theme="light"
      />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
