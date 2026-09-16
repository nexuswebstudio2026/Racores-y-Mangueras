import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, PackageCheck, PhoneCall, Plus, Printer, ShieldCheck, Tag } from 'lucide-react';
import { fetchProductsFromPublicSheet } from '../services/googleSheetsService';
import { Product } from '../types';

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onAddToQuote: (product: Product) => void;
}

function normalizeText(value?: string | null) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

const commonDiameterValues = [
  0.125, 0.1875, 0.25, 0.3125, 0.375, 0.5, 0.625, 0.75,
  1, 1.125, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.125, 3.1875, 3.25,
  4, 4.5, 5, 5.625, 6
];

function normalizeDiameterNumber(value?: string | null): number {
  const baseValue = parseInchValue(value);
  if (!Number.isFinite(baseValue)) return Number.NaN;

  let nearest = baseValue;
  let smallestDelta = Infinity;

  for (const standardValue of commonDiameterValues) {
    const delta = Math.abs(baseValue - standardValue);
    if (delta < smallestDelta) {
      nearest = standardValue;
      smallestDelta = delta;
    }
  }

  return smallestDelta <= 0.06 ? nearest : baseValue;
}

function parseInchValue(value?: string | null): number {
  if (!value) return Number.NaN;

  const normalized = value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/"/g, '')
    .replace(/pulgadas?/g, '')
    .replace(/inches?/g, '')
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return Number.NaN;

  const mixedFractionMatch = normalized.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedFractionMatch) {
    const integer = Number(mixedFractionMatch[1]);
    const numerator = Number(mixedFractionMatch[2]);
    const denominator = Number(mixedFractionMatch[3]);
    return integer + numerator / denominator;
  }

  const simpleFractionMatch = normalized.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (simpleFractionMatch) {
    const numerator = Number(simpleFractionMatch[1]);
    const denominator = Number(simpleFractionMatch[2]);
    return denominator > 0 ? numerator / denominator : Number.NaN;
  }

  const decimalMatch = normalized.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    return Number(decimalMatch[1]);
  }

  return Number.NaN;
}

function sortByInch(a: string, b: string) {
  const aValue = normalizeDiameterNumber(a);
  const bValue = normalizeDiameterNumber(b);
  if (Number.isNaN(aValue) && Number.isNaN(bValue)) return a.localeCompare(b, 'es', { numeric: true });
  if (Number.isNaN(aValue)) return 1;
  if (Number.isNaN(bValue)) return -1;
  return aValue - bValue;
}

function diameterMatches(a?: string | null, b?: string | null) {
  const aValue = normalizeDiameterNumber(a);
  const bValue = normalizeDiameterNumber(b);
  return Number.isFinite(aValue) && Number.isFinite(bValue)
    ? Math.abs(aValue - bValue) <= 0.06
    : (a ?? '').trim() === (b ?? '').trim();
}

function getHoseType(product: Product): string | null {
  if (product.hoseType) return product.hoseType.toUpperCase();
  const match = `${product.name} ${product.description} ${product.specs}`.match(/\b(R115|R12|R13|R15|R1|R2|R5|R6)\b/i);
  return match ? match[1].toUpperCase() : null;
}

export default function ProductDetailPage({ productId, onBack, onAddToQuote }: ProductDetailPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHoseType, setSelectedHoseType] = useState('');
  const [selectedDiameter, setSelectedDiameter] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchProductsFromPublicSheet()
      .then((allProducts) => {
        if (cancelled) return;
        setProducts(allProducts);

        const foundProduct = allProducts.find((item) => item.id === productId) || null;
        setProduct(foundProduct);

        if (foundProduct) {
          const inferredType = getHoseType(foundProduct) || foundProduct.hoseType || '';
          const sameTypeProducts = inferredType
            ? allProducts.filter((item) => normalizeText(getHoseType(item) || item.hoseType) === normalizeText(inferredType))
            : [foundProduct];

          const availableDiameters = Array.from(new Set(sameTypeProducts.map((item) => item.diameter).filter(Boolean) as string[]))
            .sort(sortByInch);

          setSelectedHoseType(inferredType);
          setSelectedDiameter(
            foundProduct.diameter && availableDiameters.includes(foundProduct.diameter)
              ? foundProduct.diameter
              : availableDiameters[0] || ''
          );
        } else {
          setSelectedHoseType('');
          setSelectedDiameter('');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setProduct(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const availableHoseTypes = useMemo(
    () => Array.from(new Set(products.map((item) => getHoseType(item) || item.hoseType).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, 'es', { numeric: true })),
    [products]
  );

  const availableDiameters = useMemo(() => {
    const type = selectedHoseType || getHoseType(product ?? {}) || product?.hoseType || '';
    if (!type) return [];

    return Array.from(
      new Set(
        products
          .filter((item) => normalizeText(getHoseType(item) || item.hoseType) === normalizeText(type))
          .map((item) => item.diameter)
          .filter(Boolean) as string[]
      )
    ).sort(sortByInch);
  }, [products, product, selectedHoseType]);

  const sameTypeProducts = useMemo(() => {
    if (!product) return [];
    const type = selectedHoseType || getHoseType(product) || product.hoseType || '';
    return type
      ? products.filter((item) => normalizeText(getHoseType(item) || item.hoseType) === normalizeText(type))
      : [product];
  }, [product, products, selectedHoseType]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return sameTypeProducts.find((item) => diameterMatches(item.diameter, selectedDiameter))
      || sameTypeProducts.find((item) => item.id === product.id)
      || sameTypeProducts[0]
      || product;
  }, [product, sameTypeProducts, selectedDiameter]);

  if (loading) {
    return <div className="min-h-[70vh] bg-[#070d18] px-4 py-24 text-center text-slate-300">Cargando producto desde Google Sheets...</div>;
  }

  if (!product || !selectedVariant) {
    return (
      <section className="min-h-[70vh] bg-[#070d18] px-4 py-24 text-center">
        <p className="text-slate-300 mb-6">No se encontró este producto en Productos e Inventario.</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </button>
      </section>
    );
  }

  const isHose = (selectedVariant.category || product.category).toLowerCase().includes('manguera');

  const handleHoseTypeChange = (nextType: string) => {
    setSelectedHoseType(nextType);
    const nextDiameters = products
      .filter((item) => normalizeText(getHoseType(item) || item.hoseType) === normalizeText(nextType))
      .map((item) => item.diameter)
      .filter(Boolean) as string[];
    const uniqueDiameters = Array.from(new Set(nextDiameters)).sort(sortByInch);
    setSelectedDiameter(uniqueDiameters[0] || '');
  };

  const displayReference = selectedVariant.reference || selectedVariant.id;
  const displayImage = selectedVariant.image || product.image;
  const displayTitle = selectedVariant.name || product.name;
  const displayDescription = selectedVariant.description || product.description;
  const displaySpecs = selectedVariant.specs || product.specs;
  const displayPrice = selectedVariant.salePricePerMeter ?? product.salePricePerMeter;
  const displayStock = selectedVariant.stockStatus || product.stockStatus;
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }

          body * { visibility: hidden; }
          .product-print-area, .product-print-area * { visibility: visible; }
          .product-print-area { position: absolute; inset: 0; width: 100%; background: white; }
          .product-no-print { display: none !important; }
        }
      `}</style>

      <section className="product-print-area min-h-[calc(100vh-120px)] bg-[#070d18] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="product-no-print mb-8 flex flex-wrap items-center gap-3">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-amber-400">
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1322] shadow-2xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="min-h-[320px] bg-slate-950 flex items-center justify-center p-8">
              <img src={displayImage} alt={displayTitle} className="max-h-[420px] w-full object-contain" />
            </div>
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                <PackageCheck className="w-4 h-4" /> {selectedVariant.category || product.category}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">{displayTitle}</h1>
              {displayReference && <p className="mt-2 font-mono text-sm text-amber-400">Referencia: {displayReference}</p>}

              <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                <span className="block text-xs uppercase tracking-wider text-slate-400">Precio de venta por metro</span>
                <span className="font-mono text-2xl font-black text-amber-400">
                  {displayPrice
                    ? `$${displayPrice.toLocaleString('es-CO')} COP`
                    : 'Por cotizar'}
                </span>
              </div>

              <p className="mt-5 text-base leading-relaxed text-slate-300">{displayDescription}</p>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Tag className="w-4 h-4" /> Información técnica
                </div>
                <p className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-sm text-slate-200">{displaySpecs}</p>
                {displayPrice && (
                  <p className="text-sm font-bold text-amber-400">Precio de venta por metro: ${displayPrice.toLocaleString('es-CO')} COP</p>
                )}
                {isHose && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tipo de manguera
                      <select
                        value={selectedHoseType || ''}
                        onChange={(event) => handleHoseTypeChange(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-amber-400"
                      >
                        {availableHoseTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Diámetro (pulgadas)
                      <select
                        value={selectedDiameter}
                        onChange={(event) => setSelectedDiameter(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-amber-400"
                      >
                        {availableDiameters.map((diameter) => <option key={diameter} value={diameter}>{diameter}</option>)}
                      </select>
                    </label>
                  </div>
                )}
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
                  <span className="font-bold text-amber-400">Referencia seleccionada:</span> {displayReference}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Material certificado</span>
                  {displayStock && <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-400" /> {displayStock}</span>}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => onAddToQuote(selectedVariant)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-slate-950 hover:bg-amber-300">
                  <Plus className="w-5 h-5" /> Agregar a cotización
                </button>
                <a href={`https://wa.me/573154781702?text=${encodeURIComponent(`Hola, estoy interesado en ${displayTitle}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3.5 font-semibold text-white hover:border-amber-400">
                  <PhoneCall className="w-4 h-4 text-amber-400" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
    </>
  );
}