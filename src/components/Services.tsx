import { 
  Wrench, 
  Flame, 
  Settings, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Sparkles,
  Gauge,
  CheckCircle2
} from 'lucide-react';

const serviceList = [
  {
    id: 1,
    title: 'Prensado Hidráulico Express',
    badge: 'Servicio Inmediato (15 min)',
    icon: Gauge,
    description: 'Ensamble y prensado de mangueras hidráulicas de 1/4" a 2" con tecnología de prensado controlado para presiones de hasta 700 bar (10.150 PSI). Terminales originales en acero forjado.',
    features: [
      'Prensado para SAE 100R2, R12, R15',
      'Casquillos y férulas de alto torque',
      'Prueba de estanqueidad',
      'Entrega inmediata en mostrador'
    ]
  },
  {
    id: 2,
    title: 'Fabricación y Torneado de Racores',
    badge: 'A Medida',
    icon: Settings,
    description: 'Mecanizado y adaptación de racores en bronce y acero C45 para maquinaria importada con pasos de rosca difíciles (BSP, JIC, ORFS, Métrico y NPT).',
    features: [
      'Roscas milimétricas y americanas',
      'Mecanizado en bronce y acero',
      'Acoples y niples especiales',
      'Replicado exacto de muestras'
    ]
  },
  {
    id: 3,
    title: 'Soldadura Especializada TIG y Autógena',
    badge: 'Alta Precisión',
    icon: Flame,
    description: 'Reparación y soldadura especializada para tuberías de alta presión, intercambiadores, tanques y conexiones hidráulicas en aluminio, cobre y acero inoxidable.',
    features: [
      'Soldadura TIG de precisión',
      'Soldadura autógena en plata y bronce',
      'Reparación de tubos de inyección',
      'Hermetismo 100% garantizado'
    ]
  },
  {
    id: 4,
    title: 'Conformado de Tubería Rígida',
    badge: 'Curvado Técnico',
    icon: Wrench,
    description: 'Curvado y abocardado milimétrico de tubos metálicos para sistemas de frenos de aire, líneas de inyección diésel y circuitos de refrigeración industrial.',
    features: [
      'Tubos en acero, cobre y aluminio',
      'Abocardado simple y doble',
      'Líneas de frenos de aire',
      'Acoples VIGIA y Prestolook'
    ]
  },
  {
    id: 5,
    title: 'Asesoría y Diagnóstico de Flotas',
    badge: 'Ingeniería Aplicada',
    icon: ShieldCheck,
    description: 'Acompañamiento técnico para gerentes de mantenimiento, transportadores y constructores. Diagnóstico de presiones, prevención de golpes de ariete y optimización de vida útil.',
    features: [
      'Diagnóstico de presiones y temperatura',
      'Selección de fluidos y compatibilidad',
      'Planes de mantenimiento preventivo',
      'Capacitación técnica a mecánicos'
    ]
  },
  {
    id: 6,
    title: 'Despachos a Nivel Departamental',
    badge: 'Cobertura Nariño',
    icon: Truck,
    description: 'Envío ágil y coordinado de repuestos y mangueras armadas a Ipiales, Tumaco, La Unión, Túquerres y toda la región del Putumayo y sur del país.',
    features: [
      'Despachos el mismo día',
      'Alianzas con transportadoras líderes',
      'Embalaje de seguridad industrial',
      'Rastreo continuo de envíos'
    ]
  }
];

export default function Services() {
  const handleScrollToContact = () => {
    const el = document.querySelector('#contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="py-20 md:py-28 bg-[#0a0d14] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span>Capacidad Técnica en Taller</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              SERVICIOS TÉCNICOS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
                ESPECIALIZADOS
              </span>
            </h2>
          </div>

          <p className="text-slate-400 text-base max-w-xl leading-relaxed">
            Más que suministrar repuestos, resolvemos emergencias mecánicas con mano de obra calificada, maquinaria de alta precisión y un equipo que comprende la urgencia de mantener tus vehículos trabajando.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {serviceList.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-[#111622] border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-13 h-13 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-amber-400 transition-colors mb-3">
                    {service.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleScrollToContact}
                  className="w-full bg-slate-900/90 hover:bg-amber-500 text-slate-300 hover:text-slate-950 text-xs font-bold py-3 rounded-xl border border-slate-800 hover:border-amber-500 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  <span>Solicitar este servicio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
