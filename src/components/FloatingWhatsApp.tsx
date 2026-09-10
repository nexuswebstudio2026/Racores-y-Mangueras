import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpen = () => {
    const text = encodeURIComponent('Hola Racores y Mangueras de Nariño, deseo consultar una cotización.');
    window.open(`https://wa.me/573154781702?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-[#121622] border border-slate-700 text-slate-200 text-xs py-2 px-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <span>¿Necesitas una manguera urgente? Escríbenos por WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <button
        onClick={handleOpen}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-pointer relative group"
        aria-label="Contactar por WhatsApp"
        id="floating-whatsapp-btn"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400" />
        </span>
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
