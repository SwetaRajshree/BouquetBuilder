
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect }                  from 'react';
import { useAuth }                    from './context/AuthContext';

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
import ForeverFlowersPage     from './pages/ForeverFlowersPage';
import InstantGiftsPage       from './pages/InstantGiftsPage';
import GiftHampersPage        from './pages/GiftHampersPage';
import GiftShopsPage          from './pages/GiftShopsPage';

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

// Auth guard
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (!user) return <Navigate to={`/auth?redirect=${pathname}`} replace />;
  return children;
}

// Pages that have their own full-height panel layout (no standard Footer gap)
const NO_FOOTER_PAGES = ['/handcraft'];
const NO_NAVBAR_PAGES = ['/handcraft'];

export default function App() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER_PAGES.includes(pathname);
  const showNavbar  = !NO_NAVBAR_PAGES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {showNavbar && <Navbar />}

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
          <Route path="/subscription" element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
          <Route path="/schedule"     element={<PrivateRoute><SchedulePage /></PrivateRoute>}     />
          <Route path="/calendar"     element={<PrivateRoute><CalendarPage /></PrivateRoute>}     />
          <Route path="/payment"      element={<PrivateRoute><PaymentPage /></PrivateRoute>}      />
          <Route path="/cart"         element={<PrivateRoute><CartPage /></PrivateRoute>}         />
          <Route path="/tracking"     element={<PrivateRoute><TrackingPage /></PrivateRoute>}     />
          <Route path="/account"       element={<PrivateRoute><AccountPage /></PrivateRoute>}      />
          <Route path="/bouquet-builder" element={<PrivateRoute><BouquetBuilderPage /></PrivateRoute>} />
          <Route path="/bouquet-customize" element={<PrivateRoute><BouquetCustomizePage /></PrivateRoute>} />
          <Route path="/postcard"           element={<PrivateRoute><PostcardPage /></PrivateRoute>} />
          <Route path="/digital-postcard"    element={<PrivateRoute><DigitalPostcardPage /></PrivateRoute>} />
          <Route path="/your-love"     element={<YourLovePage />}       />
          <Route path="/cake"          element={<PrivateRoute><CakePage /></PrivateRoute>}           />
          <Route path="/gifts"         element={<PrivateRoute><GiftsPage /></PrivateRoute>}          />
          <Route path="/digital-gifting"     element={<PrivateRoute><DigitalGiftingPage /></PrivateRoute>} />
          <Route path="/buy"               element={<PrivateRoute><BuyPage /></PrivateRoute>}                              />
          <Route path="/collection"          element={<PrivateRoute><CollectionPage /></PrivateRoute>} />
          <Route path="/forever-flowers"     element={<PrivateRoute><ForeverFlowersPage /></PrivateRoute>} />
          <Route path="/instant-gifts"        element={<PrivateRoute><InstantGiftsPage /></PrivateRoute>} />
          <Route path="/gift-hampers"          element={<PrivateRoute><GiftHampersPage /></PrivateRoute>} />
          <Route path="/gift-shops"             element={<PrivateRoute><GiftShopsPage /></PrivateRoute>} />
          <Route path="/digital-card"   element={<PrivateRoute><DigitalCardPage /></PrivateRoute>}  />
          <Route path="/view-bouquet/:id" element={<ViewBouquetPage />}  />
          <Route path="/shared-garden/:id"   element={<SharedGardenPage />} />
          <Route path="/shared-polaroid/:id"  element={<SharedPolaroidPage />} />
          <Route path="/story"        element={<OurStoryPage />}     />
          <Route path="/admin-login"   element={<AdminLoginPage />}   />
          <Route path="/admin"         element={<AdminPage />}        />
          <Route path="/digilove"      element={<Navigate to="/digital-gifting" replace />} />
          <Route path="/digital-bouquet" element={<Navigate to="/bouquet-builder" replace />} />
          <Route path="/handcraft"     element={<HandcraftPage />} />
          {/* Fallback */}
          <Route path="*"             element={<HomePage />}         />
        </Routes>
      </main>

      {showFooter && <Footer />}
      <FloraWidget />
    </div>
  );
}
