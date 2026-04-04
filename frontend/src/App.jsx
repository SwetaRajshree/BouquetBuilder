
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuth }                    from './context/AuthContext';

import Navbar           from './components/Navbar';
import Footer           from './components/Footer';
import { FloraWidget }  from './components/FloraChat';

import HomePage         from './pages/HomePage';
import AuthPage         from './pages/AuthPage';
import ShopsPage        from './pages/ShopsPage';
import ShopPage         from './pages/ShopPage';

const SubscriptionPage      = lazy(() => import('./pages/SubscriptionPage'));
const SchedulePage          = lazy(() => import('./pages/SchedulePage'));
const CalendarPage          = lazy(() => import('./pages/CalanderPage'));
const PaymentPage           = lazy(() => import('./pages/PaymentPage'));
const CartPage              = lazy(() => import('./pages/CartPage'));
const TrackingPage          = lazy(() => import('./pages/TrackingPage'));
const OccasionPage          = lazy(() => import('./pages/OccasionPage'));
const OurStoryPage          = lazy(() => import('./pages/OurStoryPage'));
const AdminPage             = lazy(() => import('./pages/AdminPage'));
const AdminLoginPage        = lazy(() => import('./pages/AdminLoginPage'));
const AccountPage           = lazy(() => import('./pages/AccountPage'));
const BouquetBuilderPage    = lazy(() => import('./pages/BouquetBuilderPage'));
const BouquetCustomizePage  = lazy(() => import('./pages/BouquetCustomizePage'));
const DigitalCardPage       = lazy(() => import('./pages/DigitalCardPage'));
const ViewBouquetPage       = lazy(() => import('./pages/ViewBouquetPage'));
const PostcardPage          = lazy(() => import('./pages/PostcardPage'));
const DigitalPostcardPage   = lazy(() => import('./pages/DigitalPostcardPage'));
const HandcraftPage         = lazy(() => import('./pages/HandcraftPage'));
const KeepsakePage          = lazy(() => import('./pages/KeepsakePage'));
const ArtistApplyPage       = lazy(() => import('./pages/ArtistApplyPage'));
const CollectionPage        = lazy(() => import('./pages/CollectionPage'));
const ForeverFlowersPage    = lazy(() => import('./pages/ForeverFlowersPage'));
const InstantGiftsPage      = lazy(() => import('./pages/InstantGiftsPage'));
const GiftHampersPage       = lazy(() => import('./pages/GiftHampersPage'));
const GiftShopsPage         = lazy(() => import('./pages/GiftShopsPage'));
const DigitalGiftingPage    = lazy(() => import('./pages/DigitalGiftingPage'));
const BuyPage               = lazy(() => import('./pages/BuyPage'));
const CakePage              = lazy(() => import('./pages/CakePage'));
const GiftsPage             = lazy(() => import('./pages/GiftsPage'));
const DigiLovePage          = lazy(() => import('./pages/DigiLovePage'));
const YourLovePage          = lazy(() => import('./pages/YourLovePage'));
const SharedGardenPage      = lazy(() => import('./pages/SharedGardenPage'));
const SharedPolaroidPage    = lazy(() => import('./pages/SharedPolaroidPage'));

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
const NO_FOOTER_PAGES = ['/handcraft', '/artist-apply'];
const NO_NAVBAR_PAGES = ['/handcraft', '/artist-apply'];

// keepsake pages are fullscreen — hide nav/footer for any /keepsake/* path
const isKeepsakePath = (p) => p.startsWith('/keepsake/');

export default function App() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER_PAGES.includes(pathname) && !isKeepsakePath(pathname);
  const showNavbar  = !NO_NAVBAR_PAGES.includes(pathname) && !isKeepsakePath(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {showNavbar && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={<div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>🌸</div>}>
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
          <Route path="/keepsake/:id"           element={<KeepsakePage />} />
          <Route path="/story"        element={<OurStoryPage />}     />
          <Route path="/admin-login"   element={<AdminLoginPage />}   />
          <Route path="/admin"         element={<AdminPage />}        />
          <Route path="/digilove"      element={<Navigate to="/digital-gifting" replace />} />
          <Route path="/digital-bouquet" element={<Navigate to="/bouquet-builder" replace />} />
          <Route path="/handcraft"     element={<HandcraftPage />} />
          <Route path="/artist-apply"   element={<ArtistApplyPage />} />
          {/* Fallback */}
          <Route path="*"             element={<HomePage />}         />
        </Routes>
        </Suspense>
      </main>

      {showFooter && <Footer />}
      <FloraWidget />
    </div>
  );
}
