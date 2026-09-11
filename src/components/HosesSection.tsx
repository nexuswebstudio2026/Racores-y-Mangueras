import { useState } from 'react';
import { 
  Gauge, 
  Thermometer, 
  Layers, 
  CheckCircle, 
  ArrowRight, 
  Plus, 
  Info, 
  ShieldCheck, 
  PhoneCall, 
  Wrench,
  Search
} from 'lucide-react';
import { hoseTypes } from '../data/hoseTypes';
import { Product } from '../types';

interface HosesSectionProps {
  onAddToQuote: (product: Product) => void;
  onOpenConsultation: () => void;
}

const filterCategories = [
  { id: 'all', label: 'Todas las Mangueras' },
  { id: 'high-pressure', label: 'Alta y Ultra Presión (R2, R12, R15)' },
  { id: 'medium-pressure', label: 'Media y Baja Presión (R5, R6, R7)' },
  { id: 'automotive', label: 'Automotriz y Frenos (DOT / Dirección)' },
  { id: 'special', label: 'Especiales (Silicona, Gas, Vapor, Aire)' },
];

export default function HosesSection({ onAddToQuote, onOpenConsultation }: HosesSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedHose, setSelectedHose] = useState<typeof hoseTypes[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHoses = hoseTypes.filter((hose) => {
    // Search query filter
    const matchesSearch = 
      hose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hose.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hose.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'high-pressure') {
      return ['r2', 'r12', 'r15', 'r115'].includes(hose.id);
    }
    if (activeFilter === 'medium-pressure') {
      return ['r5', 'r6', 'r7'].includes(hose.id);
    }
    if (activeFilter === 'automotive') {
      return ['freno', 'direccion', 'aire'].includes(hose.id);
    }
    if (activeFilter === 'special') {
      return ['gas', 'silicona', 'vapor', 'quimicos'].includes(hose.id) || !['r2', 'r5', 'r6', 'r7', 'r12', 'r15', 'r115', 'freno', 'direccion'].includes(hose.id);
    }
    return true;
  });

  const handleAddHoseToQuote = (hose: typeof hoseTypes[0]) => {
    const productLike: Product = {
      id: 9000 + Math.abs(hose.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)),
      category: 'Mangueras',
      name: hose.name,
      description: `${hose.subtitle} - ${hose.description}`,
      specs: hose.specs.join(' | '),
      image: hose.image,
      estimatedPrice: 150000,
    };
    onAddToQuote(productLike);
  };

  return (
    <section id="mangueras" className="py-20 md:py-28 bg-[#060e1f] border-t border-[#122e66] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b2559]/70 border border-[#ffd200]/30 text-[#ffd200] text-xs font-bold uppercase tracking-wider mb-4">
            <Gauge className="w-3.5 h-3.5 text-[#ffd200]" />
            <span>Guía Técnica Especializada • Calidad y Servicio</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            MANGUERAS HIDRÁULICAS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd200] via-[#ffe043] to-[#f5b800]">
              Y DE FLUIDOS INDUSTRIALES
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            Ensambladas con terminales originales y prensadas bajo estrictas normas internacionales <strong>SAE 100, DIN EN 853, DIN EN 856 y FMVSS 106</strong>. Resistencia probada hasta 700 bar (10.150 PSI) con garantía total.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar manguera o norma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Hoses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHoses.map((hose) => (
            <div
              key={hose.id}
              className="bg-gradient-to-b from-[#141923] to-[#0f131c] border border-slate-800/90 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-black flex flex-col group"
            >
              {/* Image Container with Pressure Tag */}
              <div className="relative h-52 bg-slate-950 overflow-hidden">
                <img
                  src={hose.image}
                  alt={hose.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141923] via-transparent to-transparent" />

                {/* Subtitle / Norm Tag */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/70 text-amber-400 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg">
                  {hose.subtitle}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-amber-400 transition-colors mb-2">
                    {hose.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5">
                    {hose.description}
                  </p>

                  {/* Technical Highlights Badges */}
                  <div className="space-y-1.5 mb-6">
                    {hose.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-800/60">
                        {spec.includes('Presión') ? (
                          <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : spec.includes('Temp') ? (
                          <Thermometer className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-800/70">
                  <button
                    onClick={() => handleAddHoseToQuote(hose)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cotizar Ensamble</span>
                  </button>

                  <button
                    onClick={() => setSelectedHose(hose)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                    title="Ver especificación completa"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workshop Consultation Box */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-[#161c28] to-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Servicio de Prensado Inmediato</span>
            </div>
            <h3 className="font-heading font-black text-2xl md:text-3xl text-white">
              ¿Tienes una muestra o manguera reventada?
            </h3>
            <p className="text-slate-300 text-sm md:text-base mt-2">
              Tráela a nuestro mostrador en <strong className="text-white">Av. Las Américas (Pasto)</strong> o envíanos una fotografía nítida del terminal y la referencia escrita para prensarla de inmediato con componentes certificados.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/573154781702?text=Hola,%20tengo%20una%20manguera%20hidr%C3%A1ulica%20para%20ensamblar.%20Adjunto%20foto%20y%20especificaciones."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Single Hose Spec Inspection */}
      {selectedHose && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-60 bg-black">
              <img
                src={selectedHose.image}
                alt={selectedHose.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedHose(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors border border-white/20"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                {selectedHose.subtitle}
              </span>
              <h3 className="font-heading font-black text-2xl text-white mt-1 mb-3">
                {selectedHose.name}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                {selectedHose.description}
              </p>

              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Especificaciones Técnicas:
                </p>
                {selectedHose.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-200 font-mono">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleAddHoseToQuote(selectedHose);
                    setSelectedHose(null);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-colors text-center"
                >
                  Agregar a Cotización
                </button>
                <button
                  onClick={() => setSelectedHose(null)}
                  className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl transition-colors font-semibold text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
