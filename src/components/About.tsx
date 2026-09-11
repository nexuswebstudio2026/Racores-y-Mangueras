import { ShieldCheck, Award, Clock, Users, Wrench, CheckCircle, Sparkles } from 'lucide-react';
import { coreValues } from '../data/companyData';
import Logo from './Logo';

export default function About() {
  return (
    <section id="nosotros" className="py-20 md:py-28 bg-[#071124] border-t border-[#122e66] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#153473]">
              <img
                src="https://static.readdy.ai/image/fd02d3b9d4ed169a20721d0e75352c2a/198a439a9319fad13a79dedf448c1524.png"
                alt="Técnico especializado en ensamble hidráulico en Pasto"
                className="w-full h-[450px] sm:h-[540px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071124] via-transparent to-transparent" />

              {/* Floating Badge with Logo & Slogan */}
              <div className="absolute top-6 left-6 bg-[#07142e]/95 backdrop-blur-md border-2 border-[#ffd200]/40 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
                <Logo size="sm" variant="badge" invertSloganForDark={true} />
                <div>
                  <p className="font-heading font-black text-xl text-white font-mono leading-none">
                    +16 Años
                  </p>
                  <p className="text-xs font-bold text-[#ffd200] mt-1 uppercase tracking-wider">
                    Calidad y Servicio
                  </p>
                </div>
              </div>

              {/* Bottom Quote inside Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0a1b38]/90 backdrop-blur-md p-4 rounded-xl border border-[#193d84] text-xs text-slate-200">
                <p className="italic">
                  &quot;Fundada el 17 de junio de 2010 con el propósito de ofrecer a los transportadores y constructores repuestos de alta durabilidad, soporte técnico genuino y la garantía de Calidad y Servicio.&quot;
                </p>
              </div>
            </div>

            {/* Subtle glow effect behind */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#ffd200]/15 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#0b2559]/40 rounded-full blur-3xl -z-10" />
          </div>

          {/* Narrative Content Side */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b2559]/70 border border-[#ffd200]/30 text-[#ffd200] text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-3.5 h-3.5 text-[#ffd200]" />
              <span>Quiénes Somos • Calidad y Servicio</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              EXPERIENCIA Y <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd200] via-[#ffe043] to-[#f5b800]">
                CONFIANZA INDUSTRIAL
              </span>
            </h2>

            <div className="space-y-4 text-slate-200 text-base leading-relaxed mb-8">
              <p>
                <strong className="text-white">Racores y Mangueras de Nariño</strong> nació en la ciudad de Pasto hace más de una década bajo la premisa indiscutible de <span className="text-[#ffd200] font-bold">Calidad y Servicio</span>, respondiendo a la exigencia crítica de transportadores, talleres y contratistas de maquinaria pesada.
              </p>
              <p>
                Hoy lideramos el mercado regional con un taller dotado de prensas digitales de última tecnología, un inventario superior a 1.200 referencias certificadas en bodega y un equipo técnico experto en sistemas hidráulicos, neumáticos y racores de alta presión.
              </p>
            </div>

            {/* Core Value Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreValues.map((val) => (
                <div 
                  key={val.title}
                  className="bg-[#091834] border border-[#143574] hover:border-[#ffd200]/40 p-4 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-2 text-[#ffd200] font-bold text-sm mb-1.5">
                    <CheckCircle className="w-4 h-4 text-[#ffd200] shrink-0" />
                    <span>{val.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
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
