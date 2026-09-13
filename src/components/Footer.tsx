import { type MouseEvent } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ShieldCheck, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { companyInfo } from '../data/companyData';
import Logo from './Logo';

interface FooterProps {
  onOpenGoogleSheets?: () => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenGoogleSheets, onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050b17] border-t border-[#122e66] text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Logo 
                variant="horizontal" 
                showText={true} 
                showSlogan={true} 
                size="md" 
                invertSloganForDark={true}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Especialistas en soluciones hidráulicas, neumáticas y ensamble de mangueras de alta presión para el transporte pesado, maquinaria amarilla y sector agroindustrial en Pasto, Nariño.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1d3d] border border-[#ffd200]/30 text-xs text-[#ffd200] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#ffd200]" />
              <span>Garantía Oficial de Calidad y Servicio</span>
            </div>

            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
              <p>NIT: {companyInfo.nit}</p>
              <p>Fundada el 17 de junio de 2010 • Pasto, Nariño</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-[#14326d] pb-1.5">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Inicio', href: '#inicio' },
                { label: 'Productos', href: '#productos' },
                { label: 'Contactos', href: '#contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-[#ffd200] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categorías */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-[#14326d] pb-1.5">
              Líneas de Producto
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
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
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-[#14326d] pb-1.5">
              Atención en Taller
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-slate-200">
                {companyInfo.address}
                <br />
                {companyInfo.city}
              </p>

              <div className="pt-2 font-mono space-y-1">
                <p className="text-[#ffd200] font-bold text-sm">
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
        <div className="mt-12 pt-8 border-t border-[#122e66] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {companyInfo.fullName}. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 hover:text-[#ffd200] text-slate-300 transition-colors p-2 bg-[#091834] hover:bg-[#0e244d] rounded-lg border border-[#163673] hover:border-[#ffd200]/40 cursor-pointer text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffd200]" />
                <span>Ingresar (Portal de Usuarios)</span>
              </button>
            )}

            {onOpenGoogleSheets && (
              <button
                onClick={onOpenGoogleSheets}
                className="flex items-center gap-1.5 hover:text-emerald-300 text-slate-300 transition-colors p-2 bg-[#091834] hover:bg-emerald-950/50 rounded-lg border border-[#163673] hover:border-emerald-500/40 cursor-pointer text-xs font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Base de Datos Google Sheets</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:text-[#ffd200] text-slate-300 transition-colors p-2 bg-[#091834] hover:bg-[#0e244d] rounded-lg border border-[#163673] cursor-pointer"
              aria-label="Volver al inicio"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#ffd200]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
