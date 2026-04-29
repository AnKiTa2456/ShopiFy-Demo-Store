import { useState } from 'react'
import { initialProducts } from './data/products'
import { useBreakpoint } from './hooks/useBreakpoint'
import AdminView from './components/AdminView'
import StoreView from './components/StoreView'
import CartDrawer from './components/CartDrawer'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)
const Chevron = ({ open }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', marginLeft: 'auto', opacity: 0.45, flexShrink: 0 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const icons = {
  home:        'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  orders:      ['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2', 'M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z'],
  products:    ['M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 01-8 0'],
  customers:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 11a4 4 0 100-8 4 4 0 000 8z', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'],
  content:     ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  analytics:   ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  marketing:   'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.4 12.1a19.79 19.79 0 01-3.07-8.67A2 2 0 012.31 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.4a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  discounts:   ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'],
  onlinestore: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
  pos:         'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  settings:    ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'],
  menu:        ['M3 12h18', 'M3 6h18', 'M3 18h18'],
  close:       ['M18 6L6 18', 'M6 6l12 12'],
}

function NavBtn({ icon, label, active, onClick, chevron }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 14px', cursor: 'pointer', border: 'none',
        background: active ? 'rgba(255,255,255,0.1)' : hov ? 'rgba(255,255,255,0.06)' : 'none',
        color: active ? '#fff' : hov ? '#e0e6f0' : '#b0b8c8',
        fontSize: '13px', width: '100%', textAlign: 'left',
        borderRadius: '6px', margin: '0 6px', width: 'calc(100% - 12px)',
        transition: 'background 0.12s, color 0.12s',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <span style={{ color: active ? '#fff' : '#6b778c', display: 'flex' }}>
        <Icon d={icon} size={16} />
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {chevron !== undefined && <Chevron open={chevron} />}
    </button>
  )
}

function SubBtn({ label, active, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      style={{
        display: 'flex', alignItems: 'center',
        padding: '6px 14px 6px 44px', cursor: 'pointer', border: 'none',
        background: active ? 'rgba(255,255,255,0.08)' : hov ? 'rgba(255,255,255,0.05)' : 'none',
        color: active ? '#fff' : hov ? '#c8d0dc' : '#8892a4',
        fontSize: '13px', width: '100%', textAlign: 'left',
        borderRadius: '6px', margin: '0 6px', width: 'calc(100% - 12px)',
        transition: 'background 0.12s, color 0.12s',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {label}
    </button>
  )
}

function Sidebar({ view, navActive, subActive, productsOpen, salesOpen, appsOpen, setProductsOpen, setSalesOpen, setAppsOpen, goTo, products, onClose, isMobile }) {
  return (
    <aside style={{
      width: '232px', background: '#1a1a2e', display: 'flex', flexDirection: 'column',
      height: '100%', flexShrink: 0,
      ...(isMobile ? { position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 300, boxShadow: '4px 0 24px rgba(0,0,0,0.4)' } : {}),
    }}>
      {/* Logo */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', background: '#008060', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px', flex: 1 }}>Demo Store</span>
        {isMobile && (
          <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }} onClick={onClose}>
            <Icon d={icons.close} size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        <NavBtn icon={icons.home}      label="Home"      active={navActive === 'home'}      onClick={() => { goTo('home'); onClose?.() }} />
        <NavBtn icon={icons.orders}    label="Orders"    active={navActive === 'orders'}    onClick={() => { goTo('orders'); onClose?.() }} />
        <NavBtn icon={icons.products}  label="Products"  active={navActive === 'products'}
          chevron={productsOpen}
          onClick={() => { setProductsOpen(o => !o); goTo('products') }}
        />
        {productsOpen && [['Collections','collections'],['Inventory','inventory'],['Purchase orders','purchase-orders'],['Transfers','transfers'],['Gift cards','gift-cards'],['Catalogs','catalogs']].map(([lbl, key]) => (
          <SubBtn key={key} label={lbl} active={subActive === key} onClick={() => { goTo(key, 'products'); onClose?.() }} />
        ))}
        <NavBtn icon={icons.customers} label="Customers" active={navActive === 'customers'} onClick={() => { goTo('customers'); onClose?.() }} />
        <NavBtn icon={icons.content}   label="Content"   active={navActive === 'content'}   onClick={() => { goTo('content'); onClose?.() }} />
        <NavBtn icon={icons.analytics} label="Analytics" active={navActive === 'analytics'} onClick={() => { goTo('analytics'); onClose?.() }} />
        <NavBtn icon={icons.marketing} label="Marketing" active={navActive === 'marketing'} onClick={() => { goTo('marketing'); onClose?.() }} />
        <NavBtn icon={icons.discounts} label="Discounts" active={navActive === 'discounts'} onClick={() => { goTo('discounts'); onClose?.() }} />

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 14px' }} />

        {/* Sales channels */}
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px 6px', fontSize: '11px', fontWeight: '600', color: '#555e70', letterSpacing: '0.6px', textTransform: 'uppercase', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
          onClick={() => setSalesOpen(o => !o)}>
          <span style={{ flex: 1 }}>Sales channels</span>
          <Chevron open={salesOpen} />
        </button>
        {salesOpen && <>
          <NavBtn icon={icons.onlinestore} label="Online Store" active={navActive === 'online-store'} onClick={() => { goTo('online-store'); setNavActive?.('online-store'); onClose?.() }} />
          <NavBtn icon={icons.pos}         label="Point of Sale" active={navActive === 'pos'} onClick={() => { goTo('pos'); onClose?.() }} />
        </>}

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 14px' }} />

        {/* Apps */}
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px 6px', fontSize: '11px', fontWeight: '600', color: '#555e70', letterSpacing: '0.6px', textTransform: 'uppercase', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
          onClick={() => setAppsOpen(o => !o)}>
          <span style={{ flex: 1 }}>Apps</span>
          <Chevron open={appsOpen} />
        </button>
      </nav>

      {/* Settings */}
      <button
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', cursor: 'pointer', border: 'none', background: navActive === 'settings' ? 'rgba(255,255,255,0.08)' : 'none', color: navActive === 'settings' ? '#fff' : '#8892a4', fontSize: '13px', width: '100%', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.07)', transition: 'background 0.12s' }}
        onClick={() => { goTo('settings'); onClose?.() }}
      >
        <span style={{ color: navActive === 'settings' ? '#fff' : '#6b778c', display: 'flex' }}><Icon d={icons.settings} size={16} /></span>
        Settings
      </button>
    </aside>
  )
}

export default function App() {
  const { isMobile } = useBreakpoint()
  const [products, setProducts]   = useState(initialProducts)
  const [view, setView]           = useState('admin')
  const [navActive, setNavActive] = useState('products')
  const [subActive, setSubActive] = useState('products')
  const [productsOpen, setProductsOpen] = useState(true)
  const [salesOpen, setSalesOpen]       = useState(true)
  const [appsOpen, setAppsOpen]         = useState(false)
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [cart, setCart]     = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const handleImport       = newProducts => setProducts(prev => { const ex = new Set(prev.map(p => p.handle)); return [...prev, ...newProducts.filter(p => !ex.has(p.handle)).map(p => ({ ...p, id: p.handle }))] })
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
    if (key === 'online-store') setView('store')
    else setView('admin')
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', position: 'relative' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 299 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      {(!isMobile || sidebarOpen) && (
        <Sidebar
          view={view} navActive={navActive} subActive={subActive}
          productsOpen={productsOpen} salesOpen={salesOpen} appsOpen={appsOpen}
          setProductsOpen={setProductsOpen} setSalesOpen={setSalesOpen} setAppsOpen={setAppsOpen}
          goTo={goTo} products={products}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f1f1f1', minWidth: 0 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background: '#1a1a2e', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button style={{ background: 'none', border: 'none', color: '#b0b8c8', cursor: 'pointer', padding: '4px', display: 'flex' }} onClick={() => setSidebarOpen(true)}>
              <Icon d={icons.menu} size={22} />
            </button>
            <div style={{ width: '24px', height: '24px', background: '#008060', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px', flex: 1 }}>Demo Store</span>
            <button style={{ background: 'none', border: 'none', color: '#b0b8c8', cursor: 'pointer', fontSize: '13px' }} onClick={() => setView(v => v === 'admin' ? 'store' : 'admin')}>
              {view === 'admin' ? '🌐' : '⚙️'}
            </button>
          </div>
        )}

        {view === 'store' ? (
          <StoreView products={products} cart={cart} onAddToCart={handleAddToCart} onOpenCart={() => setCartOpen(true)} />
        ) : (
          <AdminView
            products={products} onImport={handleImport}
            onDeleteProduct={handleDeleteProduct} onAddProduct={handleAddProduct}
            onUpdateProducts={handleUpdateProducts}
          />
        )}
      </main>

      {cartOpen && (
        <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={handleUpdateQty} onRemove={idx => setCart(prev => prev.filter((_, i) => i !== idx))} />
      )}
    </div>
  )
}
