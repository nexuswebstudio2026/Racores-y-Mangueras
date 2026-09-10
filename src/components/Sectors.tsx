import { 
  Truck, 
  HardHat, 
  Pickaxe, 
  Sprout, 
  Wrench, 
  Factory,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const sectorsList = [
  {
    id: 1,
    title: 'Transporte Pesado y Pasajeros',
    desc: 'Tractocamiones, volquetas, flotas intermunicipales y remolques. Sistemas de frenos de aire (VIGIA), dirección hidráulica y líneas de enfriamiento.',
    icon: Truck,
    vehicles: ['Kenworth', 'International', 'Freightliner', 'Chevrolet Kodiak'],
  },
  {
    id: 2,
    title: 'Construcción y Movimiento de Tierra',
    desc: 'Excavadoras de oruga, retroexcavadoras, motoniveladoras y rodillos. Mangueras de alta presión SAE 100R12/R15 para martillos y brazos articulados.',
    icon: HardHat,
    vehicles: ['Caterpillar', 'Komatsu', 'Case', 'Hyundai Heavy'],
  },
  {
    id: 3,
    title: 'Minería y Canteras',
    desc: 'Equipos sometidos a abrasión extrema, trituradoras, perforadoras y plantas de asfalto. Mangueras con protección metálica espiralada.',
    icon: Pickaxe,
    vehicles: ['Atlas Copco', 'Sandvik', 'Trituradoras estacionarias'],
  },
  {
    id: 4,
    title: 'Agroindustria Nariñense',
    desc: 'Tractores agrícolas, equipos de fumigación a alta presión, sistemas de ordeño y cosecha de papa, maíz y cebolla en el altiplano de Nariño.',
    icon: Sprout,
    vehicles: ['John Deere', 'New Holland', 'Massey Ferguson', 'Kubota'],
  },
  {
    id: 5,
    title: 'Talleres y Rectificadoras',
    desc: 'Suministro mayorista de racores de bronce, acoples rápidos, terminales y abrazaderas para mecánicos independientes y talleres aliados.',
    icon: Wrench,
    vehicles: ['Talleres diésel', 'Sistemas de frenos', 'Mecánica hidráulica'],
  },
  {
    id: 6,
    title: 'Plantas y Sector Industrial',
    desc: 'Sistemas neumáticos de automatización, líneas de vapor a alta temperatura, plantas lácteas y procesamiento de alimentos en Nariño.',
    icon: Factory,
    vehicles: ['Calderas', 'Compresores de tornillo', 'Embotelladoras'],
  }
];

export default function Sectors() {
  const handleScrollToContact = () => {
    const el = document.querySelector('#contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="sectores" className="py-20 md:py-28 bg-[#0a0d14] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>Mercados Atendidos</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            SECTORES QUE MUEVEN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
              NUESTRA ECONOMÍA REGIONAL
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
            Adaptamos la resistencia y normatividad de cada racor y manguera a las condiciones específicas de operación en carretera, mina, campo o fábrica.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sectorsList.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.id}
                className="bg-[#111520] border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-6 lg:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-amber-400 transition-colors mb-2">
                    {sector.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {sector.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
                    Maquinaria / Marcas Habituales:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sector.vehicles.map((v) => (
                      <span key={v} className="text-xs font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner with Brand Partnerships */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
            Componentes y Compatibilidad con Marcas Líderes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-sm font-bold font-mono">
            {['CATERPILLAR', 'KOMATSU', 'VOLVO TRUCKS', 'KENWORTH', 'JOHN DEERE', 'PARKER', 'EATON AEROQUIP', 'GATES'].map((brand) => (
              <span key={brand} className="hover:text-amber-400 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
