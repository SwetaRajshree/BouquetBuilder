
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect }                  from 'react';

import Navbar           from './components/Navbar';
import Footer           from './components/Footer';
import { FloraWidget }  from './components/FloraChat';

import HomePage         from './pages/HomePage';
import ShopsPage        from './pages/ShopsPage';
import ShopPage         from './pages/ShopPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SchedulePage     from './pages/SchedulePage';
import CalendarPage     from './pages/CalanderPage';
import PaymentPage      from './pages/PaymentPage';
import CartPage         from './pages/CartPage';
import TrackingPage     from './pages/TrackingPage';
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
import PostcardPage           from './pages/PostcardPage';
import DigitalPostcardPage    from './pages/DigitalPostcardPage';
import HandcraftPage          from './pages/HandcraftPage';
import CollectionPage         from './pages/CollectionPage';

import DigitalGiftingPage from './pages/DigitalGiftingPage';
import BuyPage            from './pages/BuyPage';
import CakePage           from './pages/CakePage';
import GiftsPage          from './pages/GiftsPage';
import DigiLovePage       from './pages/DigiLovePage';
import YourLovePage       from './pages/YourLovePage';
import SharedGardenPage  from './pages/SharedGardenPage';
import SharedPolaroidPage from './pages/SharedPolaroidPage';

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
          <Route path="/sale"         element={<Navigate to="/buy" replace />} />
          <Route path="/flowers"      element={<Navigate to="/buy" replace />} />
          <Route path="/plants"       element={<Navigate to="/buy" replace />} />
          <Route path="/ai"           element={<Navigate to="/buy" replace />} />
          <Route path="/shops"        element={<ShopsPage />}        />
          <Route path="/shop/:id"     element={<ShopPage />}         />
          <Route path="/auth"         element={<AuthPage />}          />
          <Route path="/occasion/:slug" element={<OccasionPage />}    />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/schedule"     element={<SchedulePage />}     />
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
          <Route path="/digital-postcard"    element={<DigitalPostcardPage />} />

          <Route path="/your-love"     element={<YourLovePage />}       />
          <Route path="/cake"          element={<CakePage />}           />
          <Route path="/gifts"         element={<GiftsPage />}          />
          <Route path="/digilove"      element={<Navigate to="/digital-gifting" replace />} />
          <Route path="/digital-gifting"     element={<DigitalGiftingPage />} />
          <Route path="/shared-garden/:id"   element={<SharedGardenPage />} />
          <Route path="/shared-polaroid/:id"  element={<SharedPolaroidPage />} />
          <Route path="/buy"               element={<BuyPage />}                              />
          <Route path="/digital-bouquet"   element={<Navigate to="/bouquet-builder" replace />} />
          <Route path="/handcraft"          element={<HandcraftPage />} />
          <Route path="/collection"          element={<CollectionPage />} />
          {/* Fallback */}
          <Route path="*"             element={<HomePage />}         />
        </Routes>
      </main>

      {showFooter && <Footer />}
      <FloraWidget />
    </div>
  );
}
