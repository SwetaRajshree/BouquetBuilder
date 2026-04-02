
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect }                  from 'react';

import Navbar           from './components/Navbar';
import Footer           from './components/Footer';

import HomePage         from './pages/HomePage';
import FlashSalePage    from './pages/FlashSalePage';
import ShopsPage        from './pages/ShopsPage';
import ShopPage         from './pages/ShopPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SchedulePage     from './pages/SchedulePage';
import AIPage           from './pages/AIPage';
import CalendarPage     from './pages/CalanderPage';
import PaymentPage      from './pages/PaymentPage';
import CartPage         from './pages/CartPage';
import TrackingPage     from './pages/TrackingPage';
import FlowersPage     from './pages/FlowersPage';
import AuthPage        from './pages/AuthPage';
import OccasionPage    from './pages/OccasionPage';
import OurStoryPage     from './pages/OurStoryPage';
import AdminPage       from './pages/AdminPage';
import AdminLoginPage  from './pages/AdminLoginPage';
import AccountPage     from './pages/AccountPage';
import BouquetBuilderPage from './pages/BouquetBuilderPage';
import DigitalCardPage    from './pages/DigitalCardPage';
import ViewBouquetPage   from './pages/ViewBouquetPage';
import BouquetCustomizePage from './pages/BouquetCustomizePage';
import PostcardPage      from './pages/PostcardPage';
import PlantShop         from './pages/PlantShop';
import DigitalGiftingPage from './pages/DigitalGiftingPage';
import SharedGardenPage  from './pages/SharedGardenPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Pages that have their own full-height panel layout (no standard Footer gap)
const NO_FOOTER_PAGES = [];

export default function App() {
  const { pathname } = useLocation();
  const showFooter   = !NO_FOOTER_PAGES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/"             element={<HomePage />}         />
          <Route path="/sale"         element={<FlashSalePage />}    />
          <Route path="/shops"        element={<ShopsPage />}        />
          <Route path="/shop/:id"     element={<ShopPage />}         />
          <Route path="/flowers"      element={<FlowersPage />}       />
          <Route path="/auth"         element={<AuthPage />}          />
          <Route path="/occasion/:slug" element={<OccasionPage />}    />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/schedule"     element={<SchedulePage />}     />
          <Route path="/ai"           element={<AIPage />}           />
          <Route path="/calendar"     element={<CalendarPage />}     />
          <Route path="/payment"      element={<PaymentPage />}      />
          <Route path="/cart"         element={<CartPage />}         />
          <Route path="/tracking"     element={<TrackingPage />}     />
          <Route path="/story"        element={<OurStoryPage />}     />
          <Route path="/admin-login"   element={<AdminLoginPage />}   />
          <Route path="/admin"         element={<AdminPage />}        />
          <Route path="/account"       element={<AccountPage />}      />
          <Route path="/bouquet-builder" element={<BouquetBuilderPage />} />
          <Route path="/digital-card"   element={<DigitalCardPage />}  />
          <Route path="/view-bouquet/:id" element={<ViewBouquetPage />}  />
          <Route path="/bouquet-customize" element={<BouquetCustomizePage />} />
          <Route path="/postcard"           element={<PostcardPage />} />
          <Route path="/plants"             element={<PlantShop />}    />
          <Route path="/digital-gifting"     element={<DigitalGiftingPage />} />
          <Route path="/shared-garden/:id"   element={<SharedGardenPage />} />
          <Route path="/digital-bouquet"   element={<Navigate to="/bouquet-builder" replace />} />
          {/* Fallback */}
          <Route path="*"             element={<HomePage />}         />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
