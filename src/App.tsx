import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MissionVision from './components/MissionVision';
import HosesSection from './components/HosesSection';
import Products from './components/Products';
import Services from './components/Services';
import Sectores from './components/Sectors';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import GoogleSheetsModal from './components/GoogleSheetsModal';
import LoginPage from './components/LoginPage';
import AdminPanelModal from './components/AdminPanelModal';
import CatalogPage from './components/CatalogPage';
import ProductDetailPage from './components/ProductDetailPage';
import { Product, QuoteCartItem, AdminUser } from './types';
import { getCurrentUser, logoutAdminUser } from './services/userService';
import { Check } from 'lucide-react';

export default function App() {
  const [quoteItems, setQuoteItems] = useState<QuoteCartItem[]>([]);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [currentView, setCurrentView] = useState<'store' | 'login' | 'admin' | 'catalog' | 'contact' | 'product'>('store');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentAdminUser(getCurrentUser());
  }, []);

  const handleOpenLogin = () => {
    if (currentAdminUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCatalogPage = () => {
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductPage = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    handleOpenCatalogPage();
  };

  const handleOpenContactPage = () => {
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentAdminUser(user);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Bienvenido al panel de control, ${user.name}`);
  };

  const handleSwitchUser = () => {
    setCurrentAdminUser(null);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Selecciona el perfil de usuario para ingresar');
  };

  const handleLogout = () => {
    logoutAdminUser();
    setCurrentAdminUser(null);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Sesión cerrada');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToQuote = (product: Product) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`"${product.name}" agregado a tu lista de cotización`);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setQuoteItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveQuoteItem = (productId: number) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  const handleScrollToCatalog = () => {
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToContact = () => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.querySelector('#contacto');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector('#contacto');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quotedProductIds = quoteItems.map((item) => item.product.id);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col selection:bg-[#ffd200] selection:text-[#060e1f] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0c1a35] border border-[#ffd200] text-white text-xs font-semibold py-3 px-4 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#ffd200]/20 text-[#ffd200] flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        quoteItems={quoteItems}
        onOpenGoogleSheets={() => setIsSheetsOpen(true)}
        onOpenAdmin={handleOpenLogin}
        currentAdminUser={currentAdminUser}
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateLogin={handleOpenLogin}
        onOpenCatalog={handleOpenCatalogPage}
        onOpenContact={handleOpenContactPage}
      />

      {/* Main Content View (In-Page) */}
      <main className="flex-1">
        {currentView === 'catalog' ? (
          <CatalogPage
            onOpenProduct={handleOpenProductPage}
          />
        ) : currentView === 'product' && selectedProductId !== null ? (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={handleBackToCatalog}
            onAddToQuote={handleAddToQuote}
          />
        ) : currentView === 'contact' ? (
          <Contact
            quoteItems={quoteItems}
            onRemoveQuoteItem={handleRemoveQuoteItem}
            onClearQuote={handleClearQuote}
            onOpenGoogleSheets={() => setIsSheetsOpen(true)}
          />
        ) : currentView === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={handleNavigateHome}
            onNotify={showToast}
          />
        ) : currentView === 'admin' ? (
          currentAdminUser ? (
            <AdminPanelModal
              isOpen={true}
              inline={true}
              currentUser={currentAdminUser}
              onClose={handleNavigateHome}
              onSwitchUser={handleSwitchUser}
              onLogout={handleLogout}
              onNotify={showToast}
            />
          ) : (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={handleNavigateHome}
              onNotify={showToast}
            />
          )
        ) : (
          <>
            <Hero
              onExploreCatalog={handleScrollToCatalog}
            />
            <About />
            <MissionVision />
            <HosesSection
              onAddToQuote={handleAddToQuote}
              onOpenConsultation={handleScrollToContact}
            />
            <Products
              onAddToQuote={handleAddToQuote}
              quotedProductIds={quotedProductIds}
            />
            <Services />
            <Sectores />
            <Testimonials />
            <Contact
              quoteItems={quoteItems}
              onRemoveQuoteItem={handleRemoveQuoteItem}
              onClearQuote={handleClearQuote}
              onOpenGoogleSheets={() => setIsSheetsOpen(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onOpenGoogleSheets={() => setIsSheetsOpen(true)} 
        onOpenAdmin={handleOpenLogin}
      />

      {/* Google Sheets Management Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
        onNotify={showToast}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
