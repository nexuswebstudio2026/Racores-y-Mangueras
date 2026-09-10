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
  Wrench
} from 'lucide-react';
import { companyInfo } from '../data/companyData';
import { QuoteCartItem } from '../types';

interface NavbarProps {
  quoteItems: QuoteCartItem[];
  onOpenQuote: () => void;
}

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Mangueras', href: '#mangueras' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Sectores', href: '#sectores' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar({ quoteItems, onOpenQuote }: NavbarProps) {
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
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notification / Information Bar */}
      <div className="bg-[#080a0e] text-slate-400 border-b border-slate-800/80 text-xs py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{companyInfo.address}, {companyInfo.city}</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className={isOpenNow ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                {isOpenNow ? 'Abierto ahora: 7:45 AM - 6:00 PM' : 'Atención telefónica disponible'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href={`tel:${companyInfo.phoneMain.replace(/\s+/g, '')}`} 
              className="hover:text-amber-400 transition-colors flex items-center gap-1 font-mono"
            >
              <Phone className="w-3 h-3 text-amber-500" />
              <span>{companyInfo.phoneMain}</span>
            </a>
            <span className="text-slate-700">|</span>
            <a 
              href={`https://wa.me/573174781702?text=${encodeURIComponent('Hola, me comunico desde el sitio web de Racores y Mangueras de Nariño.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
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
            ? 'bg-[#0a0d14]/95 backdrop-blur-md shadow-2xl shadow-black/80 border-b border-amber-500/20 py-3'
            : 'bg-[#0d1017]/90 backdrop-blur-sm border-b border-slate-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <a 
            href="#inicio" 
            onClick={(e) => handleNavClick(e, '#inicio')} 
            className="flex items-center gap-3.5 group cursor-pointer"
            id="brand-logo"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
                <Wrench className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg md:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  RACORES Y MANGUERAS
                </span>
              </div>
              <p className="text-[10px] md:text-xs tracking-[0.2em] font-semibold text-amber-500 uppercase font-heading">
                DE NARIÑO • S.A.S.
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/40 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions & Quotation Cart Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuote}
              className="relative bg-slate-800/80 hover:bg-slate-700 text-slate-100 hover:text-amber-400 p-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              title="Ver cotización de productos"
              id="quote-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Cotización</span>
              {totalQuoteQuantity > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-md animate-bounce">
                  {totalQuoteQuantity}
                </span>
              )}
            </button>

            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, '#contacto')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all whitespace-nowrap"
            >
              <span>Solicitar Cotización</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700"
              aria-label="Abrir menú"
              id="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0c0f17] border-b border-slate-800 px-4 py-6 mt-3 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-3 rounded-lg text-slate-200 hover:text-amber-400 hover:bg-slate-800/60 text-base font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenQuote();
                }}
                className="w-full flex items-center justify-between bg-slate-800/80 px-4 py-3 rounded-xl text-white font-medium"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-500" />
                  <span>Productos en Cotización</span>
                </span>
                <span className="bg-amber-500 text-slate-950 text-xs font-bold rounded-full px-2.5 py-0.5">
                  {totalQuoteQuantity}
                </span>
              </button>

              <a
                href="#contacto"
                onClick={(e) => handleNavClick(e, '#contacto')}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-3 rounded-xl font-bold text-center"
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
