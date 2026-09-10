import { Star, Quote, ShieldCheck, ThumbsUp } from 'lucide-react';
import { testimonials } from '../data/catalogData';

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-[#0c0f17] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
            <span>Casos de Éxito y Respaldo</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            LA CONFIANZA DE QUIENES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
              TRABAJAN DÍA A DÍA CON NOSOTROS
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
            Más de 500 empresas de transporte, talleres y operadores de maquinaria pesada en Nariño confían en el ensamble y la racorería de nuestro taller.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#111622] border border-slate-800/90 hover:border-amber-500/40 rounded-3xl p-6 lg:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 relative group"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic mb-6">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3.5">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-amber-500/40 shrink-0"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-amber-400/90 font-medium">
                    {t.position}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
