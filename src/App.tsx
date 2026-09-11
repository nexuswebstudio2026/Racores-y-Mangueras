import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MissionVision from './components/MissionVision';
import HosesSection from './components/HosesSection';
import Products from './components/Products';
import Services from './components/Services';
import Sectors from './components/Sectors';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuoteDrawer from './components/QuoteDrawer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import GoogleSheetsModal from './components/GoogleSheetsModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanelModal from './components/AdminPanelModal';
import { Product, QuoteCartItem, AdminUser } from './types';
import { getCurrentUser, logoutAdminUser } from './services/userService';
import { Check, ShoppingBag } from 'lucide-react';

export default function App() {
  const [quoteItems, setQuoteItems] = useState<QuoteCartItem[]>([]);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentAdminUser(getCurrentUser());
  }, []);

  const handleOpenAdmin = () => {
    if (currentAdminUser) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentAdminUser(user);
    setIsAdminPanelOpen(true);
    showToast(`Bienvenido al panel, ${user.name}`);
  };

  const handleSwitchUser = () => {
    setIsAdminPanelOpen(false);
    setIsAdminLoginOpen(true);
  };

  const handleLogout = () => {
    logoutAdminUser();
    setCurrentAdminUser(null);
    setIsAdminPanelOpen(false);
    showToast('Sesión administrativa cerrada');
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
    const el = document.querySelector('#catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToContact = () => {
    const el = document.querySelector('#contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const quotedProductIds = quoteItems.map((item) => item.product.id);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#121622] border border-amber-500 text-white text-xs font-semibold py-3 px-4 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="ml-2 underline text-amber-400 hover:text-amber-300 font-bold"
          >
            Ver
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        quoteItems={quoteItems}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenGoogleSheets={() => setIsSheetsOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        currentAdminUser={currentAdminUser}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onExploreCatalog={handleScrollToCatalog}
          onOpenQuote={() => setIsQuoteOpen(true)}
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
        <Sectors />
        <Testimonials />
        <Contact
          quoteItems={quoteItems}
          onRemoveQuoteItem={handleRemoveQuoteItem}
          onClearQuote={handleClearQuote}
          onOpenGoogleSheets={() => setIsSheetsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer 
        onOpenGoogleSheets={() => setIsSheetsOpen(true)} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Quote Drawer */}
      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={quoteItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveQuoteItem}
        onClearQuote={handleClearQuote}
        onGoToContact={handleScrollToContact}
      />

      {/* Google Sheets Management Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
        onNotify={showToast}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Panel Modal */}
      {currentAdminUser && (
        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          currentUser={currentAdminUser}
          onClose={() => setIsAdminPanelOpen(false)}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          onNotify={showToast}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
