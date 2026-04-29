import { useState, useMemo } from 'react'
import ProductModal from './ProductModal'

const s = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fafafa' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#fff', padding: '48px 32px', textAlign: 'center',
  },
  heroTitle: { fontSize: '36px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' },
  heroSub: { fontSize: '16px', color: '#ccc', marginBottom: '20px' },
  heroSearch: {
    display: 'flex', gap: '8px', maxWidth: '420px', margin: '0 auto',
  },
  heroInput: {
    flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none',
    fontSize: '14px', outline: 'none',
  },
  heroSearchBtn: {
    background: '#008060', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '12px 20px', fontWeight: '600', cursor: 'pointer',
  },
  main: { flex: 1, display: 'flex', overflow: 'hidden' },
  sidebar: {
    width: '220px', flexShrink: 0, padding: '20px 16px',
    borderRight: '1px solid #e1e3e5', overflowY: 'auto', background: '#fff',
  },
  sidebarTitle: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#6d7175', marginBottom: '10px', marginTop: '16px' },
  filterItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '5px 0', cursor: 'pointer', fontSize: '13px',
  },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer', accentColor: '#008060' },
  clearBtn: { fontSize: '12px', color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer', padding: '0' },
  content: { flex: 1, overflowY: 'auto', padding: '20px 24px' },
  resultsRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '16px',
  },
  resultsCount: { fontSize: '13px', color: '#6d7175' },
  sortSelect: {
    padding: '6px 10px', border: '1px solid #c9cccf', borderRadius: '6px',
    fontSize: '13px', background: '#fff', cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#fff', borderRadius: '10px', overflow: 'hidden',
    border: '1px solid #e1e3e5', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardImgWrap: { aspectRatio: '4/5', overflow: 'hidden', background: '#f6f6f7' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  cardBody: { padding: '12px' },
  cardTag: {
    fontSize: '11px', color: '#6d7175', textTransform: 'capitalize', marginBottom: '4px',
  },
  cardTitle: { fontSize: '14px', fontWeight: '600', marginBottom: '4px', lineHeight: 1.3 },
  cardPrice: { fontSize: '15px', fontWeight: '700', color: '#202223' },
  colorDots: { display: 'flex', gap: '4px', marginTop: '6px' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', border: '1px solid #e1e3e5' },
  sizePills: { display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' },
  sizePill: {
    fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
    background: '#f1f1f1', color: '#6d7175',
  },
  emptyState: { textAlign: 'center', padding: '80px 20px', color: '#6d7175' },
  cartPreview: {
    position: 'fixed', bottom: '24px', right: '24px',
    background: '#202223', color: '#fff', borderRadius: '50px',
    padding: '14px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', border: 'none', zIndex: 100,
    transition: 'transform 0.2s',
  },
  cartBadge: {
    background: '#008060', borderRadius: '50%', width: '22px', height: '22px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: '700',
  },
}

const COLOR_MAP = { Black: '#1a1a1a', White: '#f5f5f5', Red: '#dc2626', Blue: '#3b82f6', Navy: '#1e3a5f' }

function ProductCard({ product, onClick }) {
  const [hovered, setHovered] = useState(false)
  const sizes = [...new Set(product.variants.map(v => v.size))]
  const colors = [...new Set(product.variants.map(v => v.color))]
  const inStock = product.variants.some(v => v.inventory > 0)

  return (
    <div
      style={{ ...s.card, transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={s.cardImgWrap}>
        {product.image
          ? <img src={product.image} alt={product.title} style={{ ...s.cardImg, transform: hovered ? 'scale(1.04)' : 'scale(1)' }} loading="lazy" />
          : <div style={{ ...s.cardImg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>👗</div>
        }
      </div>
      <div style={s.cardBody}>
        <p style={s.cardTag}>{product.tags.join(', ')}</p>
        <p style={s.cardTitle}>{product.title}</p>
        <p style={s.cardPrice}>${product.price.toFixed(2)}</p>
        <div style={s.colorDots}>
          {colors.map(c => (
            <div key={c} style={{ ...s.dot, background: COLOR_MAP[c] || '#ccc' }} title={c} />
          ))}
        </div>
        <div style={s.sizePills}>
          {sizes.map(size => (
            <span key={size} style={s.sizePill}>{size}</span>
          ))}
        </div>
        {!inStock && <p style={{ fontSize: '11px', color: '#d72c0d', marginTop: '6px' }}>Out of stock</p>}
      </div>
    </div>
  )
}

export default function StoreView({ products, cart, onAddToCart, onOpenCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ sizes: [], colors: [], genders: [] })
  const [sort, setSort] = useState('default')

  const allSizes = ['XS', 'S', 'M', 'L']
  const allColors = [...new Set(products.flatMap(p => p.variants.map(v => v.color)))]
  const allGenders = [...new Set(products.flatMap(p => p.tags))]

  const toggleFilter = (key, value) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(x => x !== value) : [...f[key], value],
    }))
  }

  const activeFiltersCount = filters.sizes.length + filters.colors.length + filters.genders.length

  const displayed = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
      const matchSize = !filters.sizes.length || p.variants.some(v => filters.sizes.includes(v.size))
      const matchColor = !filters.colors.length || p.variants.some(v => filters.colors.includes(v.color))
      const matchGender = !filters.genders.length || p.tags.some(t => filters.genders.includes(t))
      return matchSearch && matchSize && matchColor && matchGender
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [products, search, filters, sort])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Demo Store</h1>
        <p style={s.heroSub}>Fashion for everyone — {products.length} products available</p>
        <div style={s.heroSearch}>
          <input
            style={s.heroInput}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={s.heroSearchBtn}>Search</button>
        </div>
      </div>

      <div style={s.main}>
        <aside style={s.sidebar}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: '700', fontSize: '14px' }}>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</p>
            {activeFiltersCount > 0 && (
              <button style={s.clearBtn} onClick={() => setFilters({ sizes: [], colors: [], genders: [] })}>
                Clear all
              </button>
            )}
          </div>

          <p style={s.sidebarTitle}>Gender</p>
          {allGenders.map(g => (
            <label key={g} style={s.filterItem}>
              <input
                type="checkbox" style={s.checkbox}
                checked={filters.genders.includes(g)}
                onChange={() => toggleFilter('genders', g)}
              />
              <span style={{ textTransform: 'capitalize' }}>{g}</span>
            </label>
          ))}

          <p style={s.sidebarTitle}>Size</p>
          {allSizes.map(size => (
            <label key={size} style={s.filterItem}>
              <input
                type="checkbox" style={s.checkbox}
                checked={filters.sizes.includes(size)}
                onChange={() => toggleFilter('sizes', size)}
              />
              {size}
            </label>
          ))}

          <p style={s.sidebarTitle}>Color</p>
          {allColors.map(color => (
            <label key={color} style={{ ...s.filterItem }}>
              <input
                type="checkbox" style={s.checkbox}
                checked={filters.colors.includes(color)}
                onChange={() => toggleFilter('colors', color)}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ ...s.dot, background: COLOR_MAP[color] || '#ccc', width: '14px', height: '14px' }} />
                {color}
              </span>
            </label>
          ))}
        </aside>

        <div style={s.content}>
          <div style={s.resultsRow}>
            <span style={s.resultsCount}>{displayed.length} product{displayed.length !== 1 ? 's' : ''}</span>
            <select style={s.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>

          {displayed.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>No products found</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Try different filters or search terms</p>
            </div>
          ) : (
            <div style={s.grid}>
              {displayed.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {cartCount > 0 && (
        <button style={s.cartPreview} onClick={onOpenCart}>
          <span>🛒 Cart</span>
          <span style={s.cartBadge}>{cartCount}</span>
          <span>${cart.reduce((sum, i) => sum + i.product.price * i.qty, 0).toFixed(2)}</span>
        </button>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={item => {
            onAddToCart(item)
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}

