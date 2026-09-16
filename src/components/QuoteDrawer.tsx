import { useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  PhoneCall, 
  ShoppingBag, 
  FileText, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { QuoteCartItem } from '../types';
import { companyInfo } from '../data/companyData';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteCartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearQuote: () => void;
  onGoToContact: () => void;
}

export default function QuoteDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearQuote,
  onGoToContact,
}: QuoteDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalEstimated = items.reduce((acc, item) => {
    return acc + (item.product.estimatedPrice || 0) * item.quantity;
  }, 0);

  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendWhatsApp = () => {
    let msg = `*SOLICITUD DE COTIZACIÓN - RACORES Y MANGUERAS DE NARIÑO*\n\n`;
    msg += `Hola, deseo consultar disponibilidad y cotización de los siguientes repuestos:\n\n`;
    
    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.product.name}* (${item.product.category})\n`;
      msg += `   • Cantidad: ${item.quantity} ${item.product.category === 'Mangueras' ? 'metros/ensambles' : 'unidades'}\n`;
      msg += `   • Specs: ${item.product.specs}\n`;
      if (item.product.estimatedPrice) {
        msg += `   • Ref: $${(item.product.estimatedPrice * item.quantity).toLocaleString('es-CO')} COP\n`;
      }
      msg += `\n`;
    });

    if (totalEstimated > 0) {
      msg += `*Subtotal Estimado Referencial:* $${totalEstimated.toLocaleString('es-CO')} COP\n\n`;
    }
    msg += `Agradezco su pronta respuesta técnica.`;

    const url = `https://wa.me/573154781702?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-end"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg min-h-full max-h-[100dvh] bg-[#0e121a] border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        id="quote-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
      >
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#131722]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="quote-drawer-title" className="font-heading font-black text-lg text-white">
                Tu Lista de Cotización
              </h3>
              <p className="text-xs text-slate-400">
                {totalUnits} {totalUnits === 1 ? 'ítem agregado' : 'ítems agregados'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar cotizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Items List */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">No hay ítems en tu cotización</h4>
                <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
                  Explora el catálogo o la sección de mangueras y haz clic en &quot;Cotizar&quot; para agregar piezas a esta lista.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                <span>Producto & Cantidad</span>
                <button
                  onClick={onClearQuote}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar todo</span>
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex gap-3 items-center group hover:border-slate-700 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-950 p-1.5 shrink-0 flex items-center justify-center overflow-hidden border border-slate-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Eliminar de la cotización"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {product.specs}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-white min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price estimate */}
                      {product.estimatedPrice && (
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            ${(product.estimatedPrice * quantity).toLocaleString('es-CO')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with Actions */}
        {items.length > 0 && (
          <div className="shrink-0 max-h-[42dvh] overflow-y-auto overscroll-contain p-4 sm:p-6 border-t border-slate-800 bg-[#131722] space-y-4">
            {/* Total summary */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Subtotal Estimado:</span>
                <span className="text-[10px] text-slate-500">*Sujeto a confirmación según medidas y terminales</span>
              </div>
              <span className="font-mono text-2xl font-black text-amber-400">
                ${totalEstimated.toLocaleString('es-CO')} COP
              </span>
            </div>

            {/* WhatsApp Send button */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar a WhatsApp para Cotizar</span>
            </button>

            {/* Web Form Option */}
            <button
              onClick={() => {
                onClose();
                onGoToContact();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-3 px-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Adjuntar en Formulario Web</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
