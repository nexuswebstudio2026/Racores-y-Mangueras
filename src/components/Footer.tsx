import { type MouseEvent } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Wrench, 
  ArrowUp, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07090e] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
                <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-heading font-black text-lg tracking-tight text-white block">
                  RACORES Y MANGUERAS
                </span>
                <span className="text-[10px] tracking-[0.2em] font-semibold text-amber-500 uppercase font-heading">
                  DE NARIÑO • S.A.S.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Especialistas en soluciones hidráulicas, neumáticas y ensamble de mangueras de alta presión para el transporte pesado, maquinaria amarilla y sector agroindustrial en Pasto, Nariño.
            </p>

            <div className="pt-2 text-xs font-mono text-slate-500 space-y-1">
              <p>NIT: {companyInfo.nit}</p>
              <p>Fundada el 17 de junio de 2010 • Pasto, Nariño</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Inicio', href: '#inicio' },
                { label: 'Quiénes Somos', href: '#nosotros' },
                { label: 'Mangueras Hidráulicas', href: '#mangueras' },
                { label: 'Catálogo de Racores', href: '#catalogo' },
                { label: 'Servicios Técnicos', href: '#servicios' },
                { label: 'Sectores Atendidos', href: '#sectores' },
                { label: 'Contacto & Cotizaciones', href: '#contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categorías */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Líneas de Producto
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Mangueras SAE 100R2 hasta R15</li>
              <li>Racores de Bronce (B2 a B102)</li>
              <li>Acoples Rápidos Hidráulicos</li>
              <li>Adaptadores JIC, NPT, BSP, ORFS</li>
              <li>Sistemas de Aire & VIGIA</li>
              <li>Tubería Conformable de Freno</li>
              <li>Válvulas Relay y de Ahogo</li>
              <li>Abrazaderas de Alta Presión</li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Atención en Taller
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                {companyInfo.address}
                <br />
                {companyInfo.city}
              </p>

              <div className="pt-2 font-mono space-y-1">
                <p className="text-amber-400 font-bold">
                  {companyInfo.phoneMain}
                </p>
                <p className="text-slate-300">
                  {companyInfo.phoneWhatsapp}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                <p>{companyInfo.hoursWeekday}</p>
                <p>{companyInfo.hoursSaturday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {companyInfo.fullName}. Todos los derechos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-amber-400 transition-colors p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
            aria-label="Volver al inicio"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
