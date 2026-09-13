import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  SlidersHorizontal, 
  Check, 
  Sparkles,
  PackageCheck,
  ChevronDown
} from 'lucide-react';
import { products as rawProducts } from '../data/catalogData';
import { Product } from '../types';
import ProductDetailModal from './ProductDetailModal';

interface ProductsProps {
  onAddToQuote: (product: Product) => void;
  quotedProductIds: number[];
}

const categories = [
  'Todos',
  'Racores',
  'Mangueras',
  'Acoples',
  'Adaptadores',
  'Aire',
  'Tubos',
  'Abrazaderas',
  'Válvulas',
  'Herramienta'
];

const priceMapping: Record<string, number> = {
  'Manguera Hidráulica SAE 100R2': 150000,
  'Manguera Neumática Poliuretano 8mm': 45000,
  'Bronce B2': 25000,
  'Bronce B3': 28000,
  'Bronce B21': 35000,
  'Bronce B23': 40000,
  'Bronce B24': 38000,
  'Bronce B46': 32000,
  'Bronce B60': 22000,
  'Bronce B61': 29000,
  'Bronce B62': 31000,
  'Bronce B64': 18000,
  'Bronce B66': 20000,
  'Bronce B68': 33000,
  'Bronce B69': 42000,
  'Bronce B100': 26000,
  'Bronce B101': 34000,
  'Bronce B102': 37000,
  'Prensadora Hidráulica de Mangueras': 3850000,
  'Cortadora de Mangueras Manual': 320000,
};

export default function Products({ onAddToQuote, quotedProductIds }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Process products with standard prices
  const allProducts: Product[] = useMemo(() => {
    return rawProducts.map((p) => {
      let price = priceMapping[p.name];
      if (!price) {
        switch (p.category) {
          case 'Racores': price = 28000; break;
          case 'Acoples': price = 45000; break;
          case 'Adaptadores': price = 32000; break;
          case 'Válvulas': price = 85000; break;
          case 'Tubos': price = 55000; break;
          case 'Abrazaderas': price = 14000; break;
          case 'Aire': price = 42000; break;
          case 'Mangueras': price = 135000; break;
          case 'Herramienta': price = 240000; break;
          default: price = 30000; break;
        }
      }
      return {
        ...p,
        estimatedPrice: price,
      };
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="productos" className="py-20 md:py-28 bg-[#090b10] border-t border-slate-800/80 relative">
      <span id="catalogo" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <PackageCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Inventario Disponible en Bodega</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              CATÁLOGO INDUSTRIAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
                Y RACORES DE PRECISIÓN
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-3 max-w-2xl leading-relaxed">
              Disponemos de más de 1.200 referencias en bronce, acero forjado C45, aluminio e inoxidable. Roscas milimétricas, NPT, BSP, JIC 37°, y sellos ORFS.
            </p>
          </div>

          <div className="text-slate-400 text-sm flex items-center gap-2 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0 self-start md:self-end">
            <span className="text-amber-400 font-bold font-mono text-base">{filteredProducts.length}</span>
            <span>referencias encontradas</span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="space-y-4 mb-10">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const count = cat === 'Todos' ? allProducts.length : allProducts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(12);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    selectedCategory === cat ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código (ej: B21, B60, NPT, JIC, 1/2)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const isQuoted = quotedProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-[#11151e] border border-slate-800/80 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-black/70 flex flex-col group"
                >
                  {/* Image with zoom on hover */}
                  <div 
                    onClick={() => setModalProduct(product)}
                    className="relative h-48 bg-slate-950/80 p-4 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 text-amber-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                      {product.category}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalProduct(product);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-slate-300 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 cursor-pointer"
                      title="Vista rápida"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => setModalProduct(product)}
                        className="font-heading font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="mt-3 bg-slate-900/90 rounded-lg p-2 border border-slate-800/80">
                        <span className="text-[11px] font-mono text-slate-300 line-clamp-1">
                          {product.specs}
                        </span>
                      </div>
                    </div>

                    {/* Price and Add to Quote Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Ref.</span>
                        <span className="font-mono text-amber-400 font-bold text-sm">
                          ${product.estimatedPrice?.toLocaleString('es-CO')}
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToQuote(product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isQuoted
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
                        }`}
                      >
                        {isQuoted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Agregado</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Cotizar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 max-w-lg mx-auto">
            <Search className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">No se encontraron referencias</h4>
            <p className="text-slate-400 text-sm mb-4">
              Prueba con otro término de búsqueda o limpia el filtro para ver todos los productos.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
              }}
              className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs hover:bg-amber-400 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* Load More Button */}
        {displayedProducts.length < filteredProducts.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl border border-slate-700 hover:border-amber-500 transition-all inline-flex items-center gap-2 text-sm shadow-md cursor-pointer"
            >
              <span>Mostrar más referencias ({filteredProducts.length - displayedProducts.length} restantes)</span>
              <ChevronDown className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </div>

      {/* Modal View */}
      <ProductDetailModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToQuote={onAddToQuote}
      />
    </section>
  );
}
