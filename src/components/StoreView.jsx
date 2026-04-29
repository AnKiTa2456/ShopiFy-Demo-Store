import { useState, useMemo } from 'react'
import ProductModal from './ProductModal'
import { useBreakpoint } from '../hooks/useBreakpoint'

const COLOR_MAP = { Black: '#1a1a1a', White: '#f5f5f5', Red: '#dc2626', Blue: '#3b82f6', Navy: '#1e3a5f', Green: '#16a34a' }

function ProductCard({ product, onClick }) {
  const [hov, setHov] = useState(false)
  const sizes  = [...new Set(product.variants.map(v => v.size))]
  const colors = [...new Set(product.variants.map(v => v.color))]
  const inStock = product.variants.some(v => v.inventory > 0)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: '10px', overflow: 'hidden',
        border: '1px solid #e1e3e5', cursor: 'pointer',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f6f6f7', position: 'relative' }}>
        {product.image
          ? <img src={product.image} alt={product.title} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hov ? 'scale(1.04)' : 'scale(1)' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>👗</div>
        }
        {!inStock && (
          <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 7px', borderRadius: '4px' }}>
            Out of stock
          </span>
        )}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: '11px', color: '#6d7175', textTransform: 'capitalize', marginBottom: '3px' }}>{product.tags.join(', ')}</p>
        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', lineHeight: 1.3 }}>{product.title}</p>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#202223', marginBottom: '6px' }}>${product.price.toFixed(2)}</p>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
          {colors.map(c => (
            <div key={c} title={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLOR_MAP[c] || '#ccc', border: '1px solid #e1e3e5' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          {sizes.map(sz => (
            <span key={sz} style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: '#f1f1f1', color: '#6d7175' }}>{sz}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterPanel({ filters, setFilters, products, onClose, isMobile }) {
  const allSizes   = ['XS', 'S', 'M', 'L']
  const allColors  = [...new Set(products.flatMap(p => p.variants.map(v => v.color)))]
  const allGenders = [...new Set(products.flatMap(p => p.tags))]
  const activeCount = filters.sizes.length + filters.colors.length + filters.genders.length

  const toggle = (key, val) => setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] }))

  const Section = ({ title, items, filterKey, color }) => (
    <div style={{ marginBottom: '18px' }}>
      <p style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#6d7175', marginBottom: '8px' }}>{title}</p>
      {items.map(item => (
        <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '13px' }}>
          <input type="checkbox" style={{ width: '15px', height: '15px', accentColor: '#008060', cursor: 'pointer' }}
            checked={filters[filterKey].includes(item)}
            onChange={() => toggle(filterKey, item)}
          />
          {color ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: COLOR_MAP[item] || '#ccc', border: '1px solid #e1e3e5', flexShrink: 0 }} />
              {item}
            </span>
          ) : (
            <span style={{ textTransform: 'capitalize' }}>{item}</span>
          )}
        </label>
      ))}
    </div>
  )

  return (
    <div style={isMobile ? { padding: '16px' } : { padding: '16px', borderRight: '1px solid #e1e3e5', background: '#fff', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <p style={{ fontWeight: '700', fontSize: '14px' }}>
          Filters {activeCount > 0 && <span style={{ color: '#008060', fontSize: '12px' }}>({activeCount})</span>}
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {activeCount > 0 && (
            <button style={{ fontSize: '12px', color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setFilters({ sizes: [], colors: [], genders: [] })}>
              Clear all
            </button>
          )}
          {isMobile && (
            <button style={{ background: '#008060', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
      <Section title="Gender"  items={allGenders} filterKey="genders" />
      <Section title="Size"    items={allSizes}   filterKey="sizes" />
      <Section title="Color"   items={allColors}  filterKey="colors" color />
    </div>
  )
}

export default function StoreView({ products, cart, onAddToCart, onOpenCart }) {
  const { isMobile, isTablet } = useBreakpoint()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch]   = useState('')
  const [filters, setFilters] = useState({ sizes: [], colors: [], genders: [] })
  const [sort, setSort]       = useState('default')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const displayed = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
      const matchSize   = !filters.sizes.length   || p.variants.some(v => filters.sizes.includes(v.size))
      const matchColor  = !filters.colors.length  || p.variants.some(v => filters.colors.includes(v.color))
      const matchGender = !filters.genders.length || p.tags.some(t => filters.genders.includes(t))
      return matchSearch && matchSize && matchColor && matchGender
    })
    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'name')       list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [products, search, filters, sort])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const activeFilters = filters.sizes.length + filters.colors.length + filters.genders.length
  const cols = isMobile ? 2 : isTablet ? 3 : 4

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fafafa' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: '#fff', padding: isMobile ? '28px 16px' : '40px 32px', textAlign: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '34px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>Demo Store</h1>
        <p style={{ fontSize: isMobile ? '13px' : '15px', color: '#bbb', marginBottom: '16px' }}>Fashion for everyone — {products.length} products</p>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
          <input
            style={{ flex: 1, padding: isMobile ? '10px 12px' : '11px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', outline: 'none', minWidth: 0 }}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={{ background: '#008060', color: '#fff', border: 'none', borderRadius: '8px', padding: isMobile ? '10px 14px' : '11px 18px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
            Search
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Desktop filter sidebar */}
        {!isMobile && (
          <aside style={{ width: '200px', flexShrink: 0 }}>
            <FilterPanel filters={filters} setFilters={setFilters} products={products} />
          </aside>
        )}

        {/* Mobile filter drawer (bottom sheet) */}
        {isMobile && filtersOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 600 }} onClick={() => setFiltersOpen(false)} />
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '16px 16px 0 0', zIndex: 601, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 -4px 24px rgba(0,0,0,0.15)' }}>
              <div style={{ width: '36px', height: '4px', background: '#e1e3e5', borderRadius: '2px', margin: '10px auto 4px' }} />
              <FilterPanel filters={filters} setFilters={setFilters} products={products} isMobile onClose={() => setFiltersOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '16px 20px', minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isMobile && (
                <button
                  onClick={() => setFiltersOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', border: '1px solid #c9cccf', borderRadius: '6px', background: activeFilters > 0 ? '#008060' : '#fff', color: activeFilters > 0 ? '#fff' : '#202223', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                  </svg>
                  Filters {activeFilters > 0 && `(${activeFilters})`}
                </button>
              )}
              <span style={{ fontSize: '13px', color: '#6d7175' }}>{displayed.length} product{displayed.length !== 1 ? 's' : ''}</span>
            </div>
            <select
              value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #c9cccf', borderRadius: '6px', fontSize: '13px', background: '#fff', cursor: 'pointer' }}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>

          {/* Grid */}
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6d7175' }}>
              <p style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</p>
              <p style={{ fontWeight: '600', fontSize: '15px' }}>No products found</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Try different filters or search terms</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? '10px' : '14px' }}>
              {displayed.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          style={{ position: 'fixed', bottom: isMobile ? '16px' : '24px', right: isMobile ? '16px' : '24px', background: '#202223', color: '#fff', border: 'none', borderRadius: '50px', padding: '12px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', zIndex: 100 }}
        >
          🛒 Cart
          <span style={{ background: '#008060', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
            {cartCount}
          </span>
          <span>${cart.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2)}</span>
        </button>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={item => { onAddToCart(item); setSelectedProduct(null) }}
        />
      )}
    </div>
  )
}
