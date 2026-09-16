import { useEffect, useMemo, useState } from 'react';
import { Search, PackageCheck, ArrowRight } from 'lucide-react';
import { fetchProductsFromPublicSheet } from '../services/googleSheetsService';
import { Product } from '../types';

interface CatalogPageProps {
  onOpenProduct: (productId: number) => void;
}

const getReference = (product: Product) => product.reference || `RYM-${String(product.id).padStart(4, '0')}`;

export default function CatalogPage({ onOpenProduct }: CatalogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const publicProducts = await fetchProductsFromPublicSheet();
        if (!cancelled) {
          setProducts(publicProducts);
        }
      } catch (error) {
        console.warn('No se pudo cargar el catálogo público desde Google Sheets:', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();

    const syncInterval = window.setInterval(() => {
      if (!cancelled) {
        loadProducts();
      }
    }, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(syncInterval);
    };
  }, []);

  const categories = ['Todos', ...Array.from(new Set(products.map((product) => product.category)))];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      const reference = getReference(product).toLowerCase();
      const haystack = `${reference} ${product.name} ${product.category} ${product.specs}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <section className="bg-[#070d18] py-20 md:py-28 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <PackageCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Inventario oficial</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              CATÁLOGO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">PRODUCTOS</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
              Consulta el inventario disponible en la base de datos de Google Sheets, filtrado por referencia, categoría o nombre del artículo.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-300 self-start md:self-end">
            <span className="text-amber-400 font-bold font-mono text-xl mr-2">{filteredProducts.length}</span>
            referencias disponibles
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-[#0c1322] px-4 py-3 text-sm text-slate-300">
            Cargando catálogo desde Google Sheets...
          </div>
        )}

        <div className="bg-[#0c1322] rounded-2xl border border-slate-800/80 p-4 md:p-6 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Buscar por referencia RYM-0001, nombre o especificación..."
              />
            </label>

            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 border border-slate-700 px-3 py-2 rounded-xl whitespace-nowrap">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Fuente: Google Sheets / Inventario oficial
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0b1019] shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-[0.12em] text-[10px]">
                <tr>
                  <th className="px-4 py-3">Referencia</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Especificación</th>
                  <th className="px-4 py-3">Precio / metro</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const reference = getReference(product);
                    return (
                      <tr key={product.id} className="border-t border-slate-800 hover:bg-slate-900/60 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#ffd200] whitespace-nowrap">{reference}</td>
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{product.category}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{product.name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 max-w-[420px]">
                          {[product.hoseType && `Tipo: ${product.hoseType}`, product.diameter && `Diámetro: ${product.diameter}"`, product.specs]
                            .filter(Boolean)
                            .join(' | ')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-amber-400">
                          {product.salePricePerMeter
                            ? `$${product.salePricePerMeter.toLocaleString('es-CO')} COP`
                            : 'Por cotizar'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenProduct(product.id)}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-[#ffd200] text-slate-950 hover:bg-[#ffe259] border border-[#ffd200]"
                          >
                            Ver más
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="w-8 h-8 text-slate-500" />
                        <p className="text-base font-medium">No se encontraron referencias con ese filtro.</p>
                        <p className="text-sm text-slate-500">Prueba con otra referencia o limpia la búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </section>
  );
}
