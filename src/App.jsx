import { useState } from 'react'
import { initialProducts } from './data/products'
import AdminView from './components/AdminView'
import StoreView from './components/StoreView'
import CartDrawer from './components/CartDrawer'

/* ── tiny SVG icon helpers ── */
const Icon = ({ d, size = 18, stroke = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)
const Chevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', marginLeft: 'auto', opacity: 0.5 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const icons = {
  home:      'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  orders:    ['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2', 'M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z'],
  products:  ['M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 01-8 0'],
  customers: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 11a4 4 0 100-8 4 4 0 000 8z', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'],
  content:   ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  analytics: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  marketing: ['M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.4 12.1a19.79 19.79 0 01-3.07-8.67A2 2 0 012.31 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.4a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z'],
  discounts: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'],
  onlinestore: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
  pos:       ['M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'],
  apps:      ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M17 17m-3 0a3 3 0 106 0 3 3 0 10-6 0'],
  settings:  ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'],
}

/* ── styles ── */
const s = {
  shell:   { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar: { width: '232px', flexShrink: 0, background: '#1a1a2e', display: 'flex', flexDirection: 'column', overflow: 'hidden' },

  logoArea: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoBox:  { width: '30px', height: '30px', background: '#008060', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoName: { color: '#fff', fontWeight: '700', fontSize: '14px', flex: 1, letterSpacing: '-0.2px' },
  logoArrow:{ color: '#555', fontSize: '10px' },

  nav: { flex: 1, overflowY: 'auto', padding: '6px 0' },

  /* main nav item */
  ni: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 14px', cursor: 'pointer', border: 'none', background: 'none',
    color: '#b0b8c8', fontSize: '13px', width: '100%', textAlign: 'left',
    borderRadius: '6px', margin: '0 6px', width: 'calc(100% - 12px)',
    transition: 'background 0.12s, color 0.12s',
  },
  niHover:  { background: 'rgba(255,255,255,0.06)', color: '#e0e6f0' },
  niActive: { background: 'rgba(255,255,255,0.1)', color: '#fff' },

  /* sub-item */
  sub: {
    display: 'flex', alignItems: 'center',
    padding: '6px 14px 6px 44px', cursor: 'pointer', border: 'none', background: 'none',
    color: '#8892a4', fontSize: '13px', width: '100%', textAlign: 'left',
    borderRadius: '6px', margin: '0 6px', width: 'calc(100% - 12px)',
    transition: 'background 0.12s, color 0.12s',
  },
  subActive: { color: '#fff', background: 'rgba(255,255,255,0.08)' },

  /* section header (Sales channels, Apps) */
  sectionHdr: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px 6px', fontSize: '11px', fontWeight: '600',
    color: '#555e70', letterSpacing: '0.6px', textTransform: 'uppercase',
    cursor: 'pointer', border: 'none', background: 'none',
    width: '100%', textAlign: 'left',
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 14px' },

  /* settings pinned bottom */
  settingsBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px', cursor: 'pointer', border: 'none', background: 'none',
    color: '#8892a4', fontSize: '13px', width: '100%', textAlign: 'left',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    transition: 'background 0.12s, color 0.12s',
  },

  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f1f1f1' },
}

/* ── Nav item with hover state ── */
function NavBtn({ icon, label, active, onClick, children, chevron }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      style={{ ...s.ni, ...(hovered ? s.niHover : {}), ...(active ? s.niActive : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: active ? '#fff' : '#6b778c', display: 'flex' }}>
        <Icon d={icon} size={17} />
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {chevron !== undefined && <Chevron open={chevron} />}
    </button>
  )
}

function SubBtn({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      style={{ ...s.sub, ...(hovered && !active ? { color: '#c8d0dc', background: 'rgba(255,255,255,0.05)' } : {}), ...(active ? s.subActive : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  )
}

/* ── App ── */
export default function App() {
  const [products, setProducts]   = useState(initialProducts)
  const [view, setView]           = useState('admin')
  const [navActive, setNavActive] = useState('products')
  const [subActive, setSubActive] = useState('products')
  const [productsOpen, setProductsOpen] = useState(true)
  const [salesOpen, setSalesOpen]       = useState(true)
  const [appsOpen, setAppsOpen]         = useState(false)
  const [cart, setCart]     = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  /* ── handlers ── */
  const handleImport = newProducts => {
    setProducts(prev => {
      const existing = new Set(prev.map(p => p.handle))
      return [...prev, ...newProducts.filter(p => !existing.has(p.handle)).map(p => ({ ...p, id: p.handle }))]
    })
  }

  const handleDeleteProduct  = id => setProducts(prev => prev.filter(p => p.id !== id))
  const handleAddProduct     = product => setProducts(prev => [product, ...prev])
  const handleUpdateProducts = updated => setProducts(updated)

  const handleAddToCart = ({ product, variant }) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id && i.variant.size === variant.size && i.variant.color === variant.color)
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], qty: n[idx].qty + 1 }; return n }
      return [...prev, { product, variant, qty: 1 }]
    })
    setCartOpen(true)
  }

  const handleUpdateQty = (idx, qty) => {
    if (qty <= 0) setCart(prev => prev.filter((_, i) => i !== idx))
    else setCart(prev => prev.map((item, i) => i === idx ? { ...item, qty } : item))
  }

  const goTo = (key, parentKey) => {
    setNavActive(parentKey || key)
    setSubActive(key)
    if (key === 'online-store') { setView('store'); setSalesOpen(true) }
    else setView('admin')
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div style={s.shell}>
      {/* ─── SIDEBAR ─── */}
      <aside style={s.sidebar}>

        {/* Logo */}
        <div style={s.logoArea}>
          <div style={s.logoBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <span style={s.logoName}>Demo Store</span>
          <span style={s.logoArrow}>▾</span>
        </div>

        {/* Main nav */}
        <nav style={s.nav}>

          <NavBtn icon={icons.home}      label="Home"      active={navActive === 'home'}      onClick={() => goTo('home')} />
          <NavBtn icon={icons.orders}    label="Orders"    active={navActive === 'orders'}    onClick={() => goTo('orders')} />

          {/* Products (expandable) */}
          <NavBtn
            icon={icons.products} label="Products"
            active={navActive === 'products'}
            chevron={productsOpen}
            onClick={() => { setProductsOpen(o => !o); goTo('products') }}
          />
          {productsOpen && (
            <>
              {[
                ['Collections',     'collections'],
                ['Inventory',       'inventory'],
                ['Purchase orders', 'purchase-orders'],
                ['Transfers',       'transfers'],
                ['Gift cards',      'gift-cards'],
                ['Catalogs',        'catalogs'],
              ].map(([label, key]) => (
                <SubBtn key={key} label={label} active={subActive === key} onClick={() => goTo(key, 'products')} />
              ))}
            </>
          )}

          <NavBtn icon={icons.customers} label="Customers" active={navActive === 'customers'} onClick={() => goTo('customers')} />
          <NavBtn icon={icons.content}   label="Content"   active={navActive === 'content'}   onClick={() => goTo('content')} />
          <NavBtn icon={icons.analytics} label="Analytics" active={navActive === 'analytics'} onClick={() => goTo('analytics')} />
          <NavBtn icon={icons.marketing} label="Marketing" active={navActive === 'marketing'} onClick={() => goTo('marketing')} />
          <NavBtn icon={icons.discounts} label="Discounts" active={navActive === 'discounts'} onClick={() => goTo('discounts')} />

          <div style={s.divider} />

          {/* Sales channels */}
          <button style={s.sectionHdr} onClick={() => setSalesOpen(o => !o)}>
            <span style={{ flex: 1 }}>Sales channels</span>
            <Chevron open={salesOpen} />
          </button>
          {salesOpen && (
            <>
              <NavBtn
                icon={icons.onlinestore} label="Online Store"
                active={navActive === 'online-store'}
                onClick={() => { goTo('online-store'); setNavActive('online-store') }}
              />
              <NavBtn
                icon={icons.pos} label="Point of Sale"
                active={navActive === 'pos'}
                onClick={() => goTo('pos')}
              />
            </>
          )}

          <div style={s.divider} />

          {/* Apps */}
          <button style={s.sectionHdr} onClick={() => setAppsOpen(o => !o)}>
            <span style={{ flex: 1 }}>Apps</span>
            <Chevron open={appsOpen} />
          </button>
          {appsOpen && (
            <NavBtn icon={icons.apps} label="App Store" active={false} onClick={() => {}} />
          )}

        </nav>

        {/* Settings — pinned bottom */}
        <button
          style={{ ...s.settingsBtn, ...(navActive === 'settings' ? { color: '#fff', background: 'rgba(255,255,255,0.08)' } : {}) }}
          onClick={() => goTo('settings')}
        >
          <span style={{ color: navActive === 'settings' ? '#fff' : '#6b778c', display: 'flex' }}>
            <Icon d={icons.settings} size={17} />
          </span>
          Settings
        </button>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={s.main}>
        {view === 'store' ? (
          <StoreView
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setCartOpen(true)}
          />
        ) : (
          <AdminView
            products={products}
            onImport={handleImport}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            onUpdateProducts={handleUpdateProducts}
          />
        )}
      </main>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={idx => setCart(prev => prev.filter((_, i) => i !== idx))}
        />
      )}
    </div>
  )
}
