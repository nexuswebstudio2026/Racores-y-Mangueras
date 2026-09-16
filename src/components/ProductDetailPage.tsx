import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, PackageCheck, PhoneCall, Plus, ShieldCheck, Tag } from 'lucide-react';
import { fetchProductsFromPublicSheet } from '../services/googleSheetsService';
import { Product } from '../types';

const hoseTypes = ['R1', 'R2', 'R5', 'R6', 'R12', 'R13', 'R15', 'R115'];
const hoseDiameters = ['3/16', '1/4', '5/16', '3/8', '1/2', '5/8', '3/4', '1', '1 1/4', '1 1/2', '2'];

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onAddToQuote: (product: Product) => void;
}

function getHoseType(product: Product): string | null {
  if (product.hoseType) return product.hoseType.toUpperCase();
  const match = `${product.name} ${product.description} ${product.specs}`.match(/\b(R115|R12|R13|R15|R1|R2|R5|R6)\b/i);
  return match ? match[1].toUpperCase() : null;
}

export default function ProductDetailPage({ productId, onBack, onAddToQuote }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHoseType, setSelectedHoseType] = useState(hoseTypes[0]);
  const [selectedDiameter, setSelectedDiameter] = useState(hoseDiameters[0]);

  useEffect(() => {
    let cancelled = false;
    fetchProductsFromPublicSheet()
      .then((products) => {
        if (cancelled) return;
        const foundProduct = products.find((item) => item.id === productId) || null;
        setProduct(foundProduct);
        if (foundProduct) {
          setSelectedHoseType(getHoseType(foundProduct) || hoseTypes[0]);
          setSelectedDiameter(
            foundProduct.diameter && hoseDiameters.includes(foundProduct.diameter)
              ? foundProduct.diameter
              : hoseDiameters[0]
          );
        }
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return <div className="min-h-[70vh] bg-[#070d18] px-4 py-24 text-center text-slate-300">Cargando producto desde Google Sheets...</div>;
  }

  if (!product) {
    return (
      <section className="min-h-[70vh] bg-[#070d18] px-4 py-24 text-center">
        <p className="text-slate-300 mb-6">No se encontró este producto en Productos e Inventario.</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </button>
      </section>
    );
  }

  const isHose = product.category.toLowerCase().includes('manguera');

  return (
    <section className="min-h-[calc(100vh-120px)] bg-[#070d18] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-amber-400">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1322] shadow-2xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="min-h-[320px] bg-slate-950 flex items-center justify-center p-8">
              <img src={product.image} alt={product.name} className="max-h-[420px] w-full object-contain" />
            </div>
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                <PackageCheck className="w-4 h-4" /> {product.category}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">{product.name}</h1>
              {product.reference && <p className="mt-2 font-mono text-sm text-amber-400">Referencia: {product.reference}</p>}
              <p className="mt-5 text-base leading-relaxed text-slate-300">{product.description}</p>

              <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                <span className="block text-xs uppercase tracking-wider text-slate-400">Precio de venta por metro</span>
                <span className="font-mono text-2xl font-black text-amber-400">
                  {product.salePricePerMeter
                    ? `$${product.salePricePerMeter.toLocaleString('es-CO')} COP`
                    : 'Por cotizar'}
                </span>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Tag className="w-4 h-4" /> Información técnica
                </div>
                <p className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-sm text-slate-200">{product.specs}</p>
                {product.salePricePerMeter && (
                  <p className="text-sm font-bold text-amber-400">Precio de venta por metro: ${product.salePricePerMeter.toLocaleString('es-CO')} COP</p>
                )}
                {isHose && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tipo de manguera
                      <select value={selectedHoseType} onChange={(event) => setSelectedHoseType(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-amber-400">
                        {hoseTypes.map((type) => <option key={type}>{type}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Diámetro (pulgadas)
                      <select value={selectedDiameter} onChange={(event) => setSelectedDiameter(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-amber-400">
                        {hoseDiameters.map((diameter) => <option key={diameter}>{diameter}&quot;</option>)}
                      </select>
                    </label>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Material certificado</span>
                  {product.stockStatus && <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-400" /> {product.stockStatus}</span>}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => onAddToQuote(product)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-slate-950 hover:bg-amber-300">
                  <Plus className="w-5 h-5" /> Agregar a cotización
                </button>
                <a href={`https://wa.me/573154781702?text=${encodeURIComponent(`Hola, estoy interesado en ${product.name}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3.5 font-semibold text-white hover:border-amber-400">
                  <PhoneCall className="w-4 h-4 text-amber-400" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}