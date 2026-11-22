import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, ShoppingBag, Eye, SlidersHorizontal, Mountain } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/sampleData';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductModal from '../components/ProductModal';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts().then(data => {
      if (data && data.length > 0) setProducts(data);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-zenith-dark pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-zenith-accent uppercase tracking-widest">
            <Mountain className="w-3.5 h-3.5" /> High-Altitude Equipment Catalog
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-zenith-offwhite">
            Mountaineering Equipment Store
          </h1>
          <p className="text-sm text-zenith-stone/70 max-w-2xl leading-relaxed">
            Rigid-sole double boots, UIAA-certified dry dynamic ropes, cascade ice tools, 4-season geodesic mountain tents, and technical Gore-Tex storm shells.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-4 rounded-xl mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zenith-stone/50" />
              <input
                type="text"
                placeholder="Search boots, axes, tents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zenith-dark/70 border border-zenith-stone/20 rounded-lg pl-9 pr-4 py-2 text-xs text-zenith-offwhite placeholder:text-zenith-stone/40 focus:outline-none focus:border-zenith-accent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-zenith-stone/60 shrink-0" />
              <span className="text-xs text-zenith-stone/70 shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zenith-dark/70 border border-zenith-stone/20 rounded-lg px-3 py-2 text-xs text-zenith-offwhite focus:outline-none focus:border-zenith-accent"
              >
                <option value="featured">Summit Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-zenith-stone/10">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-zenith-accent text-white shadow-md'
                  : 'bg-zenith-forest/40 text-zenith-stone hover:text-white border border-zenith-stone/15'
              }`}
            >
              All Gear ({products.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-zenith-accent text-white shadow-md'
                    : 'bg-zenith-forest/40 text-zenith-stone hover:text-white border border-zenith-stone/15'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-3 glass-panel rounded-xl">
            <Mountain className="w-12 h-12 text-zenith-stone/30 mx-auto" />
            <h3 className="font-cinzel text-lg font-semibold text-zenith-stone">No Equipment Found</h3>
            <p className="text-xs text-zenith-stone/60">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 bg-zenith-accent text-white text-xs rounded font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-zenith-forest/20 border border-zenith-stone/10 rounded-xl overflow-hidden hover:border-zenith-accent/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div
                  className="relative overflow-hidden cursor-pointer bg-zenith-forest/40 aspect-square"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 bg-zenith-accent text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                      Summit Pick
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="absolute bottom-3 right-3 p-2 bg-zenith-dark/80 backdrop-blur-md rounded-full text-zenith-stone hover:text-white opacity-0 group-hover:opacity-100 transition-opacity border border-zenith-stone/20"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zenith-stone/60 mb-1">
                      <span className="uppercase tracking-widest text-[10px]">{product.category}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {product.rating}
                      </span>
                    </div>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-cinzel text-sm font-bold text-zenith-offwhite group-hover:text-zenith-accent transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-zenith-stone/70 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zenith-stone/10 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-lg font-bold text-zenith-accent">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.comparePrice && (
                        <span className="block text-[11px] font-mono text-zenith-stone/50 line-through">
                          ${product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="px-3.5 py-1.5 bg-zenith-forest border border-zenith-stone/30 hover:bg-zenith-accent hover:border-zenith-accent text-white text-xs font-semibold rounded transition-all shadow flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
