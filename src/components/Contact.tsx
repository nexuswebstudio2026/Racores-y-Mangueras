import { useState, type FormEvent } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { companyInfo } from '../data/companyData';
import { QuoteCartItem } from '../types';

interface ContactProps {
  quoteItems: QuoteCartItem[];
  onRemoveQuoteItem: (id: number) => void;
  onClearQuote: () => void;
}

export default function Contact({ quoteItems, onRemoveQuoteItem, onClearQuote }: ContactProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    empresa: '',
    sector: 'Transporte de Carga Pesada',
    tipoSolicitud: 'Cotización de Mangueras / Racores',
    mensaje: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmitWeb = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleSendWhatsApp = () => {
    let msg = `*SOLICITUD TÉCNICA - RACORES Y MANGUERAS DE NARIÑO*\n\n`;
    msg += `• *Cliente:* ${formData.nombre || 'No especificado'}\n`;
    msg += `• *Teléfono:* ${formData.telefono || 'No especificado'}\n`;
    if (formData.empresa) msg += `• *Empresa/Taller:* ${formData.empresa}\n`;
    msg += `• *Sector:* ${formData.sector}\n`;
    msg += `• *Tipo de Solicitud:* ${formData.tipoSolicitud}\n\n`;

    if (quoteItems.length > 0) {
      msg += `*Productos seleccionados para cotizar:*\n`;
      quoteItems.forEach((item, i) => {
        msg += `${i + 1}. ${item.product.name} - Cant: ${item.quantity}\n`;
      });
      msg += `\n`;
    }

    if (formData.mensaje) {
      msg += `*Detalle / Mensaje:* \n${formData.mensaje}\n\n`;
    }

    msg += `Solicito confirmación de disponibilidad y precio. Gracias.`;

    const url = `https://wa.me/573154781702?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-[#090c12] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Atención Inmediata en Pasto</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            COTIZA CON NUESTROS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
              ASESORES TÉCNICOS
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
            Visítanos en nuestro mostrador o envía tu requerimiento para recibir asesoría precisa en roscas, presiones y ensambles garantizados.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Contact Cards & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111520] border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="font-heading font-bold text-xl text-white pb-4 border-b border-slate-800">
                Información de Contacto
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Ubicación del Taller
                  </h4>
                  <p className="text-white text-sm font-semibold mt-0.5">
                    {companyInfo.address}
                  </p>
                  <p className="text-xs text-slate-400">
                    {companyInfo.city} (Frente a la Av. Las Américas)
                  </p>
                  <a
                    href="https://maps.google.com/?q=Carrera+19+15-39+Pasto+Narino+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold mt-2"
                  >
                    <span>Ver en Google Maps</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Líneas Telefónicas Directas
                  </h4>
                  <p className="text-white text-sm font-semibold mt-0.5 font-mono">
                    {companyInfo.phoneMain}
                  </p>
                  <p className="text-white text-sm font-semibold font-mono">
                    {companyInfo.phoneWhatsapp} (WhatsApp Taller)
                  </p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Línea para emergencias mecánicas
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Correo Electrónico
                  </h4>
                  <p className="text-white text-sm font-semibold mt-0.5 font-mono">
                    {companyInfo.email}
                  </p>
                  <p className="text-xs text-slate-400">
                    Cotizaciones formales y órdenes de compra
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Horario de Atención
                  </h4>
                  <p className="text-slate-200 text-xs mt-0.5">
                    {companyInfo.hoursWeekday}
                  </p>
                  <p className="text-slate-200 text-xs">
                    {companyInfo.hoursSaturday}
                  </p>
                  <p className="text-amber-400/90 text-xs mt-1">
                    {companyInfo.hoursSunday}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Mock/Embed Frame */}
            <div className="bg-[#111520] border border-slate-800 rounded-3xl p-3 overflow-hidden">
              <iframe
                title="Mapa de ubicación Racores y Mangueras de Nariño"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.9189033320297!2d-77.28318852378822!3d1.2166666987714856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed48508e7cff5%3A0x2965bfd5cbb12345!2sPasto%2C%20Nari%C3%B1o!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                className="w-full h-52 rounded-2xl border-0 grayscale contrast-125 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Interactive Quotation Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#111520] border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              {submitted ? (
                <div className="py-16 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-white">
                    ¡Solicitud Recibida con Éxito!
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Gracias por contactar a <strong className="text-white">Racores y Mangueras de Nariño</strong>. Uno de nuestros técnicos revisará tus especificaciones y se comunicará a la brevedad.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleSendWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Agilizar por WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-slate-400 hover:text-white text-xs font-semibold py-2 px-4 cursor-pointer"
                    >
                      Enviar otra cotización
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitWeb} className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="font-heading font-bold text-xl text-white">
                      Formulario de Cotización Técnica
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Completa los datos para recibir una propuesta con referencias y disponibilidad inmediata.
                    </p>
                  </div>

                  {/* Quoted Products Preview */}
                  {quoteItems.length > 0 && (
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Productos a Cotizar ({quoteItems.length}):
                        </span>
                        <button
                          type="button"
                          onClick={onClearQuote}
                          className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                        >
                          Limpiar lista
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                        {quoteItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-xs text-white"
                          >
                            <span className="font-bold text-amber-400">{item.quantity}x</span>
                            <span className="truncate max-w-[160px]">{item.product.name}</span>
                            <button
                              type="button"
                              onClick={() => onRemoveQuoteItem(item.product.id)}
                              className="text-slate-500 hover:text-red-400 text-xs ml-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Ing. Carlos Pérez"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 315 123 4567"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="nombre@empresa.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    {/* Company / Workshop */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Empresa / Taller / Obra
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Transportes del Sur / Taller Don Jairo"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Sector Productivo
                      </label>
                      <select
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                      >
                        <option>Transporte de Carga Pesada</option>
                        <option>Construcción y Maquinaria Amarilla</option>
                        <option>Minería y Canteras</option>
                        <option>Sector Agroindustrial / Tractores</option>
                        <option>Taller Mecánico / Rectificadora</option>
                        <option>Otro sector industrial</option>
                      </select>
                    </div>

                    {/* Request Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Tipo de Requerimiento
                      </label>
                      <select
                        value={formData.tipoSolicitud}
                        onChange={(e) => setFormData({ ...formData, tipoSolicitud: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                      >
                        <option>Cotización de Mangueras / Racores</option>
                        <option>Ensamble y Prensado Urgente</option>
                        <option>Fabricación Especial en Torno</option>
                        <option>Soldadura TIG de Precisión</option>
                        <option>Líneas de Aire / Frenos VIGIA</option>
                        <option>Visita Técnica a Taller / Flota</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Technical Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Detalles Técnicos (Medidas, presión, rosca o aplicación)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Indica longitud de la manguera, presión estimada (bar/PSI), tipo de terminal (macho/hembra, NPT, JIC, milimétrica) o describe el fallo."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Cotizar Vía WhatsApp</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <span>Enviar Solicitud Web</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
