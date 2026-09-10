import { ShieldCheck, Award, Clock, Users, Wrench, CheckCircle } from 'lucide-react';
import { coreValues } from '../data/companyData';

export default function About() {
  return (
    <section id="nosotros" className="py-20 md:py-28 bg-[#0c0f17] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <img
                src="https://static.readdy.ai/image/fd02d3b9d4ed169a20721d0e75352c2a/198a439a9319fad13a79dedf448c1524.png"
                alt="Técnico especializado en ensamble hidráulico en Pasto"
                className="w-full h-[450px] sm:h-[540px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-[#0a0d14]/90 backdrop-blur-md border border-amber-500/40 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl text-white font-mono leading-none">
                    +16 Años
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Liderazgo en Pasto y Nariño
                  </p>
                </div>
              </div>

              {/* Bottom Quote inside Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                <p className="italic">
                  &quot;Fundada el 17 de junio de 2010 con el propósito de ofrecer a los transportadores y constructores repuestos de alta durabilidad y soporte técnico genuino.&quot;
                </p>
              </div>
            </div>

            {/* Subtle glow effect behind */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -z-10" />
          </div>

          {/* Narrative Content Side */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Quiénes Somos</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              EXPERIENCIA Y <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
                CONFIANZA INDUSTRIAL
              </span>
            </h2>

            <div className="space-y-4 text-slate-300 text-base leading-relaxed mb-8">
              <p>
                <strong className="text-white">Racores y Mangueras de Nariño</strong> nació en Pasto hace más de una década para responder a la necesidad crítica del sector transportador, agrícola e industrial de la región: contar con componentes que soporten las exigentes carreteras andinas y la rigurosidad del trabajo pesado.
              </p>
              <p>
                Hoy nos destacamos por nuestro taller dotado de prensas de última tecnología, un inventario permanente de más de 1.200 referencias y un equipo técnico con conocimiento profundo en tolerancias mecánicas, pasos de rosca internacionales y fluidos industriales.
              </p>
            </div>

            {/* Core Value Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreValues.map((val) => (
                <div 
                  key={val.title}
                  className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{val.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
