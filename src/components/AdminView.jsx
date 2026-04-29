import { useState, useRef, useEffect } from 'react'
import ImportModal from './ImportModal'
import AddProductModal from './AddProductModal'
import { generateCSVFromProducts } from '../utils/csvParser'
import { useBreakpoint } from '../hooks/useBreakpoint'

const s = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topBar: {
    background: '#fff', borderBottom: '1px solid #e1e3e5',
    padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px',
    height: '56px', flexShrink: 0,
  },
  topTitle: { fontWeight: '700', fontSize: '20px', flex: 1 },
  btn: {
    padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    border: '1px solid #c9cccf', background: '#fff', color: '#202223', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnPrimary: {
    padding: '7px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
    border: 'none', background: '#008060', color: '#fff', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  moreActionsWrap: { position: 'relative' },
  moreActionsBtn: {
    padding: '7px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    border: '1px solid #c9cccf', background: '#fff', color: '#202223', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap',
  },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 4px)', right: 0,
    background: '#fff', border: '1px solid #e1e3e5', borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 500, minWidth: '180px', overflow: 'hidden',
  },
  dropdownItem: {
    padding: '10px 16px', cursor: 'pointer', fontSize: '13px', color: '#202223',
    display: 'flex', alignItems: 'center', gap: '8px', border: 'none',
    background: 'none', width: '100%', textAlign: 'left',
    transition: 'background 0.1s',
  },
  dropdownItemDanger: { color: '#d72c0d' },
  dropdownDivider: { height: '1px', background: '#f1f1f1' },
  statsRow: { display: 'flex', gap: '12px', padding: '16px 20px', flexShrink: 0, overflowX: 'auto' },
  statCard: { background: '#fff', borderRadius: '8px', padding: '14px 18px', border: '1px solid #e1e3e5', minWidth: '180px', flex: 1 },
  statLabel: { fontSize: '12px', color: '#6d7175', marginBottom: '4px' },
  statValue: { fontSize: '22px', fontWeight: '700' },
  statSub: { fontSize: '12px', color: '#6d7175', marginTop: '2px' },
  content: { flex: 1, overflow: 'auto', padding: '0 20px 20px' },
  card: { background: '#fff', borderRadius: '8px', border: '1px solid #e1e3e5', overflow: 'hidden' },
  tabRow: { display: 'flex', borderBottom: '1px solid #e1e3e5', padding: '0 16px', background: '#fff' },
  tab: { padding: '10px 14px', fontSize: '13px', color: '#6d7175', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  tabActive: { color: '#202223', fontWeight: '600', borderBottom: '2px solid #202223' },
  toolbar: { padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center', borderBottom: '1px solid #e1e3e5', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '200px', padding: '7px 12px', border: '1px solid #c9cccf', borderRadius: '6px', fontSize: '13px', outline: 'none' },
  filterSelect: { padding: '7px 10px', border: '1px solid #c9cccf', borderRadius: '6px', fontSize: '13px', color: '#202223', background: '#fff', cursor: 'pointer' },
  bulkBar: {
    padding: '8px 16px', background: '#f6f6f7', borderBottom: '1px solid #e1e3e5',
    display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px',
  },
  bulkBtn: { padding: '5px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: '500', border: '1px solid #c9cccf', background: '#fff', cursor: 'pointer' },
  bulkBtnDanger: { border: '1px solid #ffc9c2', background: '#fff4f2', color: '#d72c0d' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { padding: '10px 14px', background: '#f6f6f7', borderBottom: '1px solid #e1e3e5', textAlign: 'left', fontWeight: '600', color: '#6d7175', whiteSpace: 'nowrap' },
  td: { padding: '10px 14px', borderBottom: '1px solid #f1f1f1', verticalAlign: 'middle' },
  trHover: { background: '#fafafa' },
  productCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  productImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid #f1f1f1' },
  productImgPlaceholder: { width: '40px', height: '40px', borderRadius: '6px', background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  badgeActive: { background: '#eaf5ef', color: '#008060' },
  badgeDraft:  { background: '#fdf8e7', color: '#b98900' },
  badgeArchived: { background: '#f1f1f1', color: '#6d7175' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #e1e3e5', fontSize: '13px', color: '#6d7175' },
  pageBtn: { padding: '5px 10px', border: '1px solid #c9cccf', borderRadius: '5px', background: '#fff', cursor: 'pointer', fontSize: '12px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6d7175' },
  checkbox: { width: '15px', height: '15px', cursor: 'pointer', accentColor: '#008060' },
  chevron: { fontSize: '10px', marginLeft: '2px', opacity: 0.6 },
}

const PAGE_SIZE = 10

function MoreActionsMenu({ selected, onArchive, onDelete, onDuplicate, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const Item = ({ label, icon, danger, onClick, sub }) => {
    const [hov, setHov] = useState(false)
    return (
      <button
        style={{ ...s.dropdownItem, ...(danger ? s.dropdownItemDanger : {}), ...(hov ? { background: '#f6f6f7' } : {}), ...(sub ? { color: '#6d7175', fontSize: '12px' } : {}) }}
        onClick={() => { onClick(); setOpen(false) }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      >
        <span>{icon}</span>{label}
      </button>
    )
  }

  return (
    <div style={s.moreActionsWrap} ref={ref}>
      <button style={s.moreActionsBtn} onClick={() => setOpen(o => !o)}>
        More actions <span style={s.chevron}>▾</span>
      </button>
      {open && (
        <div style={s.dropdown}>
          <Item icon="📋" label="Duplicate selected" onClick={onDuplicate} />
          <div style={s.dropdownDivider} />
          <Item icon="📦" label={`Archive${selected > 0 ? ` ${selected} product${selected > 1 ? 's' : ''}` : ' products'}`} onClick={onArchive} />
          <Item icon="🗑" label={`Delete${selected > 0 ? ` ${selected} product${selected > 1 ? 's' : ''}` : ' products'}`} danger onClick={onDelete} />
          <div style={s.dropdownDivider} />
          <Item icon="📊" label="Export selected as CSV" sub onClick={() => {}} />
        </div>
      )}
    </div>
  )
}

export default function AdminView({ products, onImport, onDeleteProduct, onAddProduct, onUpdateProducts }) {
  const { isMobile } = useBreakpoint()
  const [importOpen, setImportOpen]   = useState(false)
  const [addOpen, setAddOpen]         = useState(false)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [page, setPage]               = useState(1)
  const [activeTab, setActiveTab]     = useState('all')
  const [selected, setSelected]       = useState(new Set())
  const [hoveredRow, setHoveredRow]   = useState(null)

  const vendors = [...new Set(products.map(p => p.vendor).filter(Boolean))]

  const filtered = products.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchVendor = vendorFilter === 'all' || p.vendor === vendorFilter
    const matchTab    = activeTab === 'all' || p.status === activeTab
    return matchSearch && matchStatus && matchVendor && matchTab
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalInventory = products.reduce((sum, p) => sum + p.variants.reduce((s, v) => s + (v.inventory || 0), 0), 0)

  /* ── selection ── */
  const allPageSelected = paginated.length > 0 && paginated.every(p => selected.has(p.id))
  const toggleAll = () => {
    if (allPageSelected) setSelected(prev => { const n = new Set(prev); paginated.forEach(p => n.delete(p.id)); return n })
    else setSelected(prev => { const n = new Set(prev); paginated.forEach(p => n.add(p.id)); return n })
  }
  const toggleOne = id => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  /* ── bulk actions ── */
  const handleArchiveSelected = () => {
    onUpdateProducts(products.map(p => selected.has(p.id) ? { ...p, status: 'archived' } : p))
    setSelected(new Set())
  }
  const handleDeleteSelected = () => {
    if (!window.confirm(`Delete ${selected.size} product${selected.size > 1 ? 's' : ''}?`)) return
    selected.forEach(id => onDeleteProduct(id))
    setSelected(new Set())
  }
  const handleDuplicateSelected = () => {
    const dupes = products
      .filter(p => selected.has(p.id))
      .map(p => ({ ...p, id: p.id + '-copy-' + Date.now(), handle: p.handle + '-copy', title: p.title + ' (Copy)', status: 'draft' }))
    onUpdateProducts([...products, ...dupes])
    setSelected(new Set())
  }

  /* ── export ── */
  const handleExport = () => {
    const toExport = selected.size > 0 ? products.filter(p => selected.has(p.id)) : products
    const csv  = generateCSVFromProducts(toExport)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'products-export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const statusStyle = st => st === 'active' ? s.badgeActive : st === 'draft' ? s.badgeDraft : s.badgeArchived

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={{ ...s.topBar, height: 'auto', padding: isMobile ? '10px 14px' : '0 20px', flexWrap: 'wrap', gap: isMobile ? '8px' : '8px', minHeight: '56px' }}>
        <h1 style={{ ...s.topTitle, fontSize: isMobile ? '16px' : '20px' }}>Products</h1>
        {!isMobile && <button style={s.btn} onClick={handleExport}>Export</button>}
        <button style={s.btn} onClick={() => setImportOpen(true)}>Import</button>
        {!isMobile && (
          <MoreActionsMenu
            selected={selected.size}
            onArchive={handleArchiveSelected}
            onDelete={handleDeleteSelected}
            onDuplicate={handleDuplicateSelected}
          />
        )}
        <button style={s.btnPrimary} onClick={() => setAddOpen(true)}>
          {isMobile ? '+ Add' : '+ Add product'}
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ ...s.statsRow, display: isMobile ? 'none' : 'flex' }}>
        <div style={s.statCard}>
          <p style={s.statLabel}>Products by sell-through rate</p>
          <p style={s.statValue}>{((products.filter(p => p.status === 'active').length / Math.max(products.length, 1)) * 100).toFixed(0)}%</p>
          <p style={s.statSub}>{products.filter(p => p.status === 'active').length} active products</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statLabel}>Products by days of inventory remaining</p>
          <p style={s.statValue}>{totalInventory}</p>
          <p style={s.statSub}>Total inventory units</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statLabel}>ABC product analysis</p>
          <p style={s.statValue}>{products.length}</p>
          <p style={s.statSub}>Total products</p>
        </div>
      </div>

      {/* ── Table card ── */}
      <div style={s.content}>
        <div style={s.card}>

          {/* Tabs */}
          <div style={s.tabRow}>
            {[
              { key: 'all',      label: 'All',      count: products.length },
              { key: 'active',   label: 'Active',   count: products.filter(p => p.status === 'active').length },
              { key: 'draft',    label: 'Draft',    count: products.filter(p => p.status === 'draft').length },
              { key: 'archived', label: 'Archived', count: products.filter(p => p.status === 'archived').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                style={{ ...s.tab, ...(activeTab === key ? s.tabActive : {}) }}
                onClick={() => { setActiveTab(key); setPage(1); setSelected(new Set()) }}
              >
                {label} <span style={{ opacity: 0.6, fontSize: '12px' }}>({count})</span>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <input
              style={s.searchInput}
              placeholder="Search products"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            <select style={s.filterSelect} value={vendorFilter} onChange={e => { setVendorFilter(e.target.value); setPage(1) }}>
              <option value="all">All vendors</option>
              {vendors.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select style={s.filterSelect} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div style={s.bulkBar}>
              <span style={{ fontWeight: '600' }}>{selected.size} selected</span>
              <button style={s.bulkBtn} onClick={handleArchiveSelected}>Archive</button>
              <button style={{ ...s.bulkBtn, ...s.bulkBtnDanger }} onClick={handleDeleteSelected}>Delete</button>
              <button style={s.bulkBtn} onClick={handleDuplicateSelected}>Duplicate</button>
              <button style={s.bulkBtn} onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          )}

          {/* Table / Mobile cards */}
          {paginated.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>📦</p>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No products found</p>
              <p style={{ fontSize: '13px', marginBottom: '16px' }}>Try adjusting your search or filters</p>
              <button style={s.btnPrimary} onClick={() => setAddOpen(true)}>+ Add product</button>
            </div>
          ) : isMobile ? (
            /* Mobile card list */
            <div>
              {paginated.map(product => {
                const inv = product.variants.reduce((s, v) => s + (v.inventory || 0), 0)
                const isSelected = selected.has(product.id)
                return (
                  <div key={product.id} style={{ display: 'flex', gap: '10px', padding: '12px 14px', borderBottom: '1px solid #f1f1f1', background: isSelected ? '#f0faf6' : '#fff', alignItems: 'center' }}>
                    <input type="checkbox" style={s.checkbox} checked={isSelected} onChange={() => toggleOne(product.id)} />
                    {product.image
                      ? <img src={product.image} alt={product.title} style={{ ...s.productImg, width: '48px', height: '48px' }} loading="lazy" />
                      : <div style={{ ...s.productImgPlaceholder, width: '48px', height: '48px' }}>👗</div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ ...s.badge, ...statusStyle(product.status), fontSize: '11px', padding: '1px 7px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                          {product.status}
                        </span>
                        <span style={{ fontSize: '12px', color: inv === 0 ? '#d72c0d' : '#6d7175' }}>
                          {inv === 0 ? 'Out of stock' : `${inv} in stock`}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>${product.price.toFixed(2)}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Desktop table — horizontally scrollable */
            <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: '36px' }}>
                    <input type="checkbox" style={s.checkbox} checked={allPageSelected} onChange={toggleAll} />
                  </th>
                  <th style={s.th}>Product</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Inventory</th>
                  <th style={s.th}>Sales channels</th>
                  <th style={s.th}>Markets</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Type</th>
                  <th style={s.th}>Vendor</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(product => {
                  const inv = product.variants.reduce((s, v) => s + (v.inventory || 0), 0)
                  const isSelected = selected.has(product.id)
                  return (
                    <tr
                      key={product.id}
                      style={{ background: isSelected ? '#f0faf6' : hoveredRow === product.id ? '#fafafa' : '#fff', cursor: 'default' }}
                      onMouseEnter={() => setHoveredRow(product.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={{ ...s.td, width: '36px' }}>
                        <input type="checkbox" style={s.checkbox} checked={isSelected} onChange={() => toggleOne(product.id)} />
                      </td>
                      <td style={s.td}>
                        <div style={s.productCell}>
                          {product.image
                            ? <img src={product.image} alt={product.title} style={s.productImg} loading="lazy" />
                            : <div style={s.productImgPlaceholder}>👗</div>
                          }
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '2px' }}>{product.title}</p>
                            <p style={{ fontSize: '12px', color: '#6d7175' }}>{product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...statusStyle(product.status) }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                          {product.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ color: inv === 0 ? '#d72c0d' : '#202223', fontWeight: inv === 0 ? '500' : 'normal' }}>
                          {inv === 0 ? 'Out of stock' : `${inv} in stock`}
                        </span>
                        {inv > 0 && <p style={{ fontSize: '11px', color: '#6d7175' }}>for {product.variants.filter(v => v.inventory > 0).length} variants</p>}
                      </td>
                      <td style={{ ...s.td, color: '#6d7175' }}>3</td>
                      <td style={{ ...s.td, color: '#6d7175' }}>2</td>
                      <td style={{ ...s.td, color: '#6d7175', textTransform: 'capitalize' }}>
                        {product.tags.join(', ') || '—'}
                      </td>
                      <td style={{ ...s.td, color: '#6d7175' }}>gift</td>
                      <td style={{ ...s.td, color: '#6d7175' }}>{product.vendor}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          )}

          {/* Pagination */}
          <div style={s.pagination}>
            <span>
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button style={s.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Previous</button>
              <span style={{ fontSize: '12px', padding: '0 4px' }}>{page} / {totalPages}</span>
              <button style={s.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImport={newProducts => { onImport(newProducts); setImportOpen(false) }}
        />
      )}

      {addOpen && (
        <AddProductModal
          onClose={() => setAddOpen(false)}
          onSave={product => { onAddProduct(product); setAddOpen(false) }}
        />
      )}
    </div>
  )
}
