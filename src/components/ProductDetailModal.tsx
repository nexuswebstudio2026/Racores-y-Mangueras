import { useEffect, useState } from 'react';
import { Product } from '../types';
import { X, CheckCircle, Plus, PhoneCall, ShieldCheck, Tag } from 'lucide-react';

const hoseTypes = ['R1', 'R2', 'R5', 'R6', 'R12', 'R13', 'R15', 'R115'];
const hoseDiameters = ['3/16', '1/4', '5/16', '3/8', '1/2', '5/8', '3/4', '1', '1 1/4', '1 1/2', '2'];

function getHoseType(product: Product): string | null {
  if (product.hoseType) return product.hoseType.toUpperCase();
  const productText = `${product.name} ${product.description} ${product.specs}`;
  const match = productText.match(/\b(R115|R12|R13|R15|R1|R2|R5|R6)\b/i);
  return match ? match[1].toUpperCase() : null;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToQuote,
}: ProductDetailModalProps) {
  const [selectedHoseType, setSelectedHoseType] = useState(hoseTypes[0]);
  const [selectedDiameter, setSelectedDiameter] = useState(hoseDiameters[0]);

  useEffect(() => {
    if (!product) return;
    const detectedType = getHoseType(product);
    setSelectedHoseType(detectedType || hoseTypes[0]);
    setSelectedDiameter(
      product.diameter && hoseDiameters.includes(product.diameter) ? product.diameter : hoseDiameters[0]
    );
  }, [product]);

  if (!product) return null;

  const isHose = product.category.toLowerCase().includes('manguera');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-slate-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header Image Bar */}
        <div className="relative h-64 sm:h-80 bg-slate-950">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 bg-radial from-slate-900 to-black"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-amber-500 text-slate-950 font-mono font-bold text-xs px-3 py-1 rounded-lg">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
              {product.name}
            </h3>
            {product.estimatedPrice && (
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Precio Ref.</span>
                <span className="text-amber-400 font-mono font-bold text-xl">
                  ${product.estimatedPrice.toLocaleString('es-CO')} COP
                </span>
              </div>
            )}
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Technical Specs List */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Tag className="w-4 h-4" />
              <span>Especificación Técnica Industrial:</span>
            </div>
            <p className="text-sm font-mono text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {product.specs}
            </p>
            {isHose && (
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <label className="block">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tipo de manguera
                  </span>
                  <select
                    value={selectedHoseType}
                    onChange={(event) => setSelectedHoseType(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-mono font-bold text-amber-400 outline-none focus:border-amber-400"
                  >
                    {hoseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Diámetro (pulgadas)
                  </span>
                  <select
                    value={selectedDiameter}
                    onChange={(event) => setSelectedDiameter(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-mono font-bold text-amber-400 outline-none focus:border-amber-400"
                  >
                    {hoseDiameters.map((diameter) => (
                      <option key={diameter} value={diameter}>
                        {diameter}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantía de estanqueidad
              </span>
              <span>•</span>
              <span>Material certificado</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onAddToQuote(product);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar a la Cotización</span>
            </button>

            <a
              href={`https://wa.me/573154781702?text=${encodeURIComponent(
                `Hola, estoy interesado en cotizar el producto: ${product.name} (${product.category}) - ${product.specs}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-700 hover:border-amber-500 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 px-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
