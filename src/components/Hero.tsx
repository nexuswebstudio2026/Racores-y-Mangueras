import { ArrowRight, CheckCircle2, Shield, Wrench, Sparkles, PhoneCall, Award, Clock } from 'lucide-react';
import { businessMetrics, companyInfo } from '../data/companyData';
import Logo from './Logo';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenQuote: () => void;
}

export default function Hero({ onExploreCatalog }: HeroProps) {
  const handleScrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#060e1e]">
      {/* Background Graphic & Texture Overlay with Royal Navy & Gold ambiance */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://static.readdy.ai/image/fd02d3b9d4ed169a20721d0e75352c2a/c10a8b25eb0c0023edb0c0a29dc59247.png"
          alt="Maquinaria pesada y taller industrial de racores y mangueras en Pasto"
          className="w-full h-full object-cover object-center opacity-25 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Navy gradients to blend smoothly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e1e] via-[#08152e]/90 to-[#060e1e]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e1e] via-[#060e1e]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ffd200]/15 via-[#0b2559]/40 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffd200]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0b2559]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7">
            {/* Slogan & Heritage Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0b2559]/70 border border-[#ffd200]/40 text-[#ffd200] text-xs md:text-sm font-bold mb-6 backdrop-blur-md shadow-lg shadow-[#060e1e]">
              <Sparkles className="w-4 h-4 text-[#ffd200] animate-pulse" />
              <span className="tracking-wide">CALIDAD Y SERVICIO • TALLER ESPECIALIZADO EN PASTO</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-6.5xl text-white tracking-tight leading-[1.08] mb-6">
              POTENCIA HIDRÁULICA Y <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd200] via-[#ffe043] to-[#f5b800]">
                PRESIÓN SIN LÍMITES
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-2xl">
              Soluciones técnicas de precisión en <strong className="text-white font-semibold">ensamble de mangueras de alta y extrema presión</strong>, racores en bronce y acero milimétrico, soldadura certificada y mantenimiento integral de flotas y maquinaria pesada en Nariño.
            </p>

            {/* Key Advantages Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-sm text-slate-200">
              <div className="flex items-center gap-2.5 bg-[#091730]/60 p-2.5 rounded-xl border border-[#14326d]/60">
                <CheckCircle2 className="w-5 h-5 text-[#ffd200] shrink-0" />
                <span className="font-medium">Prensado express en 15 minutos</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#091730]/60 p-2.5 rounded-xl border border-[#14326d]/60">
                <CheckCircle2 className="w-5 h-5 text-[#ffd200] shrink-0" />
                <span className="font-medium">Mangueras SAE 100R2 a R15 (700 bar)</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#091730]/60 p-2.5 rounded-xl border border-[#14326d]/60">
                <CheckCircle2 className="w-5 h-5 text-[#ffd200] shrink-0" />
                <span className="font-medium">Despachos a Nariño y Putumayo</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#091730]/60 p-2.5 rounded-xl border border-[#14326d]/60">
                <CheckCircle2 className="w-5 h-5 text-[#ffd200] shrink-0" />
                <span className="font-medium">Soporte y atención para flotas</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => handleScrollTo('#contacto')}
                className="bg-gradient-to-r from-[#ffd200] via-[#f5b800] to-[#e8a800] hover:from-[#ffe259] hover:to-[#ffd200] text-[#060e1f] font-black px-8 py-4 rounded-xl shadow-xl shadow-[#ffd200]/25 hover:shadow-[#ffd200]/40 transition-all flex items-center justify-center gap-3 text-base group cursor-pointer border border-[#ffe566]/70"
                id="hero-cta-quote"
              >
                <span>Solicitar Cotización Inmediata</span>
                <ArrowRight className="w-5 h-5 text-[#060e1f] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCatalog}
                className="border-2 border-[#193a7a] hover:border-[#ffd200] bg-[#0a1b38]/80 hover:bg-[#0e2752] text-white hover:text-[#ffd200] font-bold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 text-base backdrop-blur-sm cursor-pointer shadow-lg"
                id="hero-cta-catalog"
              >
                <Wrench className="w-4 h-4 text-[#ffd200]" />
                <span>Catálogo de Racores y Mangueras</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Impact Brand Emblem Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-gradient-to-b from-[#0a1a36]/90 via-[#08152e]/95 to-[#050d1c] border-2 border-[#ffd200]/35 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#030712] relative backdrop-blur-md group hover:border-[#ffd200]/60 transition-all duration-300">
              {/* Corner decorative accent */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-gradient-to-bl from-[#ffd200]/20 to-transparent rounded-tr-2xl pointer-events-none" />

              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-[#122b5e] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#ffd200]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Sello Oficial de Calidad
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#ffd200]/15 text-[#ffd200] px-2 py-0.5 rounded border border-[#ffd200]/30">
                  NIT: {companyInfo.nit}
                </span>
              </div>

              {/* Central Official Logo Presentation */}
              <div className="flex flex-col items-center justify-center text-center py-2">
                <div className="p-3 rounded-full bg-gradient-to-br from-[#0b2559]/80 to-[#060e1e] border-2 border-[#ffd200]/40 shadow-xl shadow-[#040a16] mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Logo size="xl" variant="badge" invertSloganForDark={true} />
                </div>

                <h3 className="font-heading font-black text-xl text-white tracking-tight">
                  RACORES Y MANGUERAS DE NARIÑO
                </h3>
                <p className="text-sm font-black text-[#ffd200] uppercase tracking-[0.25em] mt-1 font-mono">
                  ★ CALIDAD Y SERVICIO ★
                </p>
                <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
                  Líderes departamentales en prensado hidráulico certificado, racores milimétricos y ensamble de mangueras para trabajo pesado.
                </p>
              </div>

              {/* Quick Contact & WhatsApp Pill inside Card */}
              <div className="mt-6 pt-5 border-t border-[#122b5e] grid grid-cols-2 gap-3 text-xs">
                <a
                  href={`tel:${companyInfo.phoneMain.replace(/\s+/g, '')}`}
                  className="bg-[#0b1c3c] hover:bg-[#122c5e] text-slate-200 hover:text-[#ffd200] p-2.5 rounded-xl border border-[#163673] flex items-center justify-center gap-2 transition-colors font-medium text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#ffd200]" />
                  <span>Llamar Mostrador</span>
                </a>
                <a
                  href={`https://wa.me/573174781702?text=${encodeURIComponent('Hola, deseo una cotización express con Racores y Mangueras de Nariño.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ffd200] hover:bg-[#ffe043] text-[#060e1f] p-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-black text-center shadow-md"
                >
                  <span>WhatsApp 24/7</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#060e1f]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stat Counter Bar with Royal Navy & Gold Theme */}
        <div className="mt-16 pt-8 border-t border-[#102754] grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {businessMetrics.map((metric) => (
            <div 
              key={metric.label} 
              className="bg-[#08152e]/80 border border-[#14326d] hover:border-[#ffd200]/40 p-4 sm:p-5 rounded-2xl backdrop-blur-sm shadow-lg transition-all"
            >
              <div className="font-heading font-black text-3xl sm:text-4xl text-[#ffd200] font-mono">
                {metric.value}
              </div>
              <div className="text-white font-bold text-sm mt-1">
                {metric.label}
              </div>
              <div className="text-slate-300 text-xs mt-0.5">
                {metric.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
