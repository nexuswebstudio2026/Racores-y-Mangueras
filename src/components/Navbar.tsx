import { useState, useEffect, type MouseEvent } from 'react';
import { 
  Phone, 
  Clock, 
  MapPin, 
  Menu, 
  X, 
  ShoppingCart, 
  ArrowUpRight,
  ShieldCheck,
  Wrench,
  FileSpreadsheet,
  Users,
  ArrowLeft
} from 'lucide-react';
import { companyInfo } from '../data/companyData';
import { QuoteCartItem, AdminUser } from '../types';
import Logo from './Logo';

interface NavbarProps {
  quoteItems: QuoteCartItem[];
  onOpenQuote: () => void;
  onOpenGoogleSheets?: () => void;
  onOpenAdmin?: () => void;
  currentAdminUser?: AdminUser | null;
  currentView?: 'store' | 'login' | 'admin' | 'catalog' | 'contact';
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
  onOpenCatalog?: () => void;
  onOpenContact?: () => void;
}

const navLinks = [
  { label: 'Inicio', href: '/Inicio' },
  { label: 'Catálogo de productos', href: '/Productos' },
  { label: 'Contactos y redes sociales', href: '/Contactos' },
];

export default function Navbar({ 
  quoteItems, 
  onOpenQuote, 
  onOpenGoogleSheets,
  onOpenAdmin,
  currentAdminUser,
  currentView = 'store',
  onNavigateHome,
  onNavigateLogin,
  onOpenCatalog,
  onOpenContact,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check store open status (Mon-Fri 7:45-18:00, Sat 8:00-17:00)
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Sat
    const hour = now.getHours() + now.getMinutes() / 60;
    if (day >= 1 && day <= 5) {
      setIsOpenNow(hour >= 7.75 && hour < 18);
    } else if (day === 6) {
      setIsOpenNow(hour >= 8 && hour < 17);
    } else {
      setIsOpenNow(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalQuoteQuantity = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (href === '/Inicio') {
      onNavigateHome?.();
      return;
    }

    if (href === '/Productos') {
      onOpenCatalog?.();
      return;
    }

    if (href === '/Contactos') {
      onOpenContact?.();
      return;
    }

    if ((currentView === 'admin' || currentView === 'login') && onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Top Notification / Information Bar */}
      <div className="bg-[#050b18] text-slate-300 border-b border-[#0f2b68]/60 text-xs py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#ffd200]" />
              <span>{companyInfo.address}, {companyInfo.city}</span>
            </span>
            <span className="hidden md:inline text-blue-900">•</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-[#ffd200]'}`} />
              <span className={isOpenNow ? 'text-emerald-400 font-medium' : 'text-slate-300'}>
                {isOpenNow ? 'Atención en Mostrador Pasto: 7:45 AM - 6:00 PM' : 'Atención telefónica disponible'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href={`tel:${companyInfo.phoneMain.replace(/\s+/g, '')}`} 
              className="hover:text-[#ffd200] transition-colors flex items-center gap-1 font-mono text-slate-200"
            >
              <Phone className="w-3 h-3 text-[#ffd200]" />
              <span>{companyInfo.phoneMain}</span>
            </a>
            <span className="text-blue-900">|</span>
            <a 
              href={`https://wa.me/573174781702?text=${encodeURIComponent('Hola, me comunico desde el sitio web de Racores y Mangueras de Nariño.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#ffd200] hover:text-[#ffe259] font-bold flex items-center gap-1 transition-colors"
            >
              <span>WhatsApp Directo</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#060e20]/95 backdrop-blur-md shadow-2xl shadow-[#030711]/90 border-b border-[#ffd200]/25 py-2.5'
            : 'bg-[#08142c]/95 backdrop-blur-sm border-b border-[#0f2b68]/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <a 
            href="/Inicio" 
            onClick={(e) => handleNavClick(e, '/Inicio')} 
            className="flex items-center group cursor-pointer"
            id="brand-logo"
            aria-label="Racores y Mangueras de Nariño - Calidad y Servicio"
          >
            <Logo 
              variant="horizontal" 
              showText={true} 
              showSlogan={true} 
              size="md" 
              invertSloganForDark={true}
            />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-200 hover:text-[#ffd200] hover:bg-[#0f2b68]/40 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions & Quotation Cart Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentView === 'admin' ? (
              <button
                onClick={onNavigateHome}
                className="bg-[#0b1b3b] hover:bg-[#102754] text-[#ffd200] px-3.5 py-2 rounded-xl border border-[#ffd200]/40 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
                title="Volver a la vista del catálogo y tienda"
                id="back-to-store-nav-btn"
              >
                <ArrowLeft className="w-4 h-4 text-[#ffd200]" />
                <span className="hidden sm:inline">Volver a Inicio</span>
              </button>
            ) : currentView === 'login' ? (
              <button
                onClick={onNavigateHome}
                className="bg-[#0b1b3b] hover:bg-[#102754] text-[#ffd200] px-3.5 py-2 rounded-xl border border-[#ffd200]/40 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
                title="Volver a la vista del catálogo y tienda"
                id="back-to-store-from-login-btn"
              >
                <ArrowLeft className="w-4 h-4 text-[#ffd200]" />
                <span className="hidden sm:inline">Volver a Inicio</span>
              </button>
            ) : (
              (onNavigateLogin || onOpenAdmin) && (
                <button
                  onClick={() => {
                    if (onNavigateLogin) {
                      onNavigateLogin();
                    } else if (onOpenAdmin) {
                      onOpenAdmin();
                    }
                  }}
                  className="bg-[#0b1b3b] hover:bg-[#ffd200] text-slate-100 hover:text-[#060e1f] px-3.5 py-2 rounded-xl border border-[#ffd200]/40 hover:border-[#ffd200] transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm group"
                  title="Ingresar como usuario autorizado"
                  id="nav-login-btn"
                >
                  {currentAdminUser ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-[#ffd200] group-hover:text-[#060e1f] font-black">{currentAdminUser.name.split(' ')[0]}</span>
                      <span className="text-[10px] bg-[#ffd200]/20 group-hover:bg-[#060e1f]/20 px-1.5 py-0.2 rounded font-mono">Panel</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-[#ffd200] group-hover:text-[#060e1f]" />
                      <span className="font-extrabold tracking-wide">Ingresar</span>
                    </>
                  )}
                </button>
              )
            )}

            {onOpenGoogleSheets && (
              <button
                onClick={onOpenGoogleSheets}
                className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-emerald-200 p-2 sm:px-3 sm:py-2 rounded-xl border border-emerald-500/40 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm shadow-emerald-950/50"
                title="Base de Datos en Google Sheets"
                id="google-sheets-nav-btn"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Google Sheets</span>
              </button>
            )}

            <button
              onClick={onOpenQuote}
              className="relative bg-[#0c2046] hover:bg-[#122e65] text-slate-100 hover:text-[#ffd200] p-2.5 rounded-xl border border-[#1a3e80] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Ver cotización de productos"
              id="quote-cart-btn"
            >
              <ShoppingCart className="w-5 h-5 text-[#ffd200]" />
              <span className="hidden sm:inline text-xs font-bold">Cotización</span>
              {totalQuoteQuantity > 0 && (
                <span className="bg-[#ffd200] text-[#060e1f] text-xs font-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-md animate-bounce">
                  {totalQuoteQuantity}
                </span>
              )}
            </button>

            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, '#contacto')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#ffd200] via-[#f5b800] to-[#e8a800] hover:from-[#ffe259] hover:to-[#ffd200] text-[#060e1f] px-4 py-2.5 rounded-xl text-sm font-black shadow-md shadow-[#ffd200]/20 hover:shadow-[#ffd200]/40 transition-all whitespace-nowrap border border-[#ffe566]/60"
            >
              <span>Contactar</span>
              <ArrowUpRight className="w-4 h-4 text-[#060e1f]" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-200 hover:text-white bg-[#0f2552] border border-[#1b4394]"
              aria-label="Abrir menú"
              id="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-6 h-6 text-[#ffd200]" /> : <Menu className="w-6 h-6 text-[#ffd200]" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#071226] border-b border-[#14336c] px-4 py-6 mt-2 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 p-3 bg-[#0a1b38] rounded-xl border border-[#ffd200]/25">
              <Logo size="sm" variant="badge" invertSloganForDark={true} />
              <div>
                <p className="text-xs font-black text-white tracking-wide">RACORES Y MANGUERAS DE NARIÑO</p>
                <p className="text-[11px] font-bold text-[#ffd200] uppercase tracking-widest mt-0.5">Calidad y Servicio</p>
              </div>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-2.5 rounded-lg text-slate-200 hover:text-[#ffd200] hover:bg-[#0f2a58]/50 text-sm font-semibold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-[#122e66] space-y-2.5">
              {(currentView === 'admin' || currentView === 'login') ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigateHome?.();
                  }}
                  className="w-full flex items-center justify-between bg-[#0b1c3c] border border-[#ffd200]/40 px-4 py-2.5 rounded-xl text-[#ffd200] font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-[#ffd200]" />
                    <span>Volver a Inicio</span>
                  </span>
                  <span className="text-xs bg-[#ffd200] text-[#060e1f] px-2 py-0.5 rounded-md font-black">
                    Inicio
                  </span>
                </button>
              ) : (
                (onNavigateLogin || onOpenAdmin) && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      if (onNavigateLogin) {
                        onNavigateLogin();
                      } else if (onOpenAdmin) {
                        onOpenAdmin();
                      }
                    }}
                    className="w-full flex items-center justify-between bg-[#0b1c3c] border border-[#ffd200]/40 px-4 py-2.5 rounded-xl text-[#ffd200] font-bold text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#ffd200]" />
                      <span>
                        {currentAdminUser ? `Panel (${currentAdminUser.name.split(' ')[0]})` : 'Ingresar al Portal'}
                      </span>
                    </span>
                    <span className="text-xs bg-[#ffd200] text-[#060e1f] px-2 py-0.5 rounded-md font-black">
                      Ingresar
                    </span>
                  </button>
                )
              )}

              {onOpenGoogleSheets && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenGoogleSheets();
                  }}
                  className="w-full flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-emerald-300 font-semibold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Base de Datos Google Sheets</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Conectar
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenQuote();
                }}
                className="w-full flex items-center justify-between bg-[#0e244d] border border-[#1b4385] px-4 py-2.5 rounded-xl text-white font-semibold text-sm"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#ffd200]" />
                  <span>Productos en Cotización</span>
                </span>
                <span className="bg-[#ffd200] text-[#060e1f] text-xs font-black rounded-full px-2.5 py-0.5">
                  {totalQuoteQuantity}
                </span>
              </button>

              <a
                href="#contacto"
                onClick={(e) => handleNavClick(e, '#contacto')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffd200] to-[#f5b800] text-[#060e1f] px-4 py-3 rounded-xl font-black text-center text-sm shadow-md"
              >
                <span>Cotizar con Asesor Técnico</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
