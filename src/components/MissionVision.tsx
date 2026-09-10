import { Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="py-16 md:py-24 bg-[#090c12] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Misión */}
          <div className="bg-gradient-to-br from-[#121622] to-[#0d1017] border border-slate-800/90 rounded-3xl p-8 lg:p-10 shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-colors">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Target className="w-7 h-7" />
              </div>

              <span className="text-amber-500 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
                Propósito Fundamental
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mb-4">
                Nuestra Misión
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Ser el aliado estratégico indispensable de las empresas de transporte, construcción, minería y agroindustria en Nariño, proporcionando racores, mangueras y servicios técnicos con los más altos estándares de calidad y durabilidad, garantizando que sus maquinarias y flotas permanezcan operativas y productivas.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
              {['Disponibilidad Inmediata', 'Seguridad Certificada', 'Respaldo Técnico'].map((tag) => (
                <span key={tag} className="text-xs bg-slate-900 border border-slate-700/60 text-slate-300 px-3 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visión */}
          <div className="bg-gradient-to-br from-[#181d2c] to-[#121622] border border-slate-800/90 rounded-3xl p-8 lg:p-10 shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-colors">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Compass className="w-7 h-7" />
              </div>

              <span className="text-amber-500 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
                Rumbo Estratégico 2030
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mb-4">
                Nuestra Visión
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Consolidarnos como el centro técnico de ensamblaje hidráulico y suministro de racorería más confiable e innovador del Suroccidente colombiano, reconocidos por la excelencia de nuestra mano de obra, la modernización continua de nuestros procesos y el compromiso inquebrantable con el desarrollo regional.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
              {['Liderazgo Regional', 'Innovación Continua', 'Eficiencia Logística'].map((tag) => (
                <span key={tag} className="text-xs bg-slate-900 border border-slate-700/60 text-amber-400/90 px-3 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
