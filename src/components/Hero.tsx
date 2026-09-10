import { ArrowRight, CheckCircle2, Shield, Wrench, Sparkles, PhoneCall } from 'lucide-react';
import { businessMetrics, companyInfo } from '../data/companyData';

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
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0a0d14]">
      {/* Background Graphic & Texture Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://static.readdy.ai/image/fd02d3b9d4ed169a20721d0e75352c2a/c10a8b25eb0c0023edb0c0a29dc59247.png"
          alt="Maquinaria pesada y taller industrial de racores y mangueras"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Gradients to blend smoothly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Taller Especializado en Pasto • Desde 2010</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-6">
            POTENCIA HIDRÁULICA Y <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
              PRESIÓN SIN LÍMITES
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-2xl">
            Soluciones técnicas inmediatas en <strong className="text-white font-semibold">ensamble de mangueras de alta presión</strong>, racores de precisión en bronce y acero, soldadura especializada y mantenimiento de flotas de carga pesada y maquinaria amarilla en Nariño.
          </p>

          {/* Key Advantages Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Prensado express en mostrador (15 minutos)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Mangueras SAE 100R2 hasta R15 (700 bar)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Despachos urgentes a todo Nariño y Putumayo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Atención para tractomulas y flotas 24/7</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => handleScrollTo('#contacto')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-3 text-base group cursor-pointer"
              id="hero-cta-quote"
            >
              <span>Solicitar Cotización Inmediata</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreCatalog}
              className="border-2 border-slate-700 hover:border-amber-500 bg-slate-900/60 hover:bg-slate-900/90 text-slate-200 hover:text-amber-400 font-semibold px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base backdrop-blur-sm cursor-pointer"
              id="hero-cta-catalog"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Ver Catálogo y Mangueras</span>
            </button>
          </div>
        </div>

        {/* Floating Stat Counter Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {businessMetrics.map((metric) => (
            <div key={metric.label} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm">
              <div className="font-heading font-black text-3xl sm:text-4xl text-amber-400 font-mono">
                {metric.value}
              </div>
              <div className="text-white font-semibold text-sm mt-1">
                {metric.label}
              </div>
              <div className="text-slate-400 text-xs mt-0.5">
                {metric.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
