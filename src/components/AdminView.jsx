import { useState } from 'react'
import ImportModal from './ImportModal'
import { generateCSVFromProducts } from '../utils/csvParser'

const s = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topBar: {
    background: '#fff', borderBottom: '1px solid #e1e3e5',
    padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px',
    height: '56px', flexShrink: 0,
  },
  topTitle: { fontWeight: '600', fontSize: '20px', flex: 1 },
  btn: {
    padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    border: '1px solid #c9cccf', background: '#fff', color: '#202223', cursor: 'pointer',
  },
  btnPrimary: {
    padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    border: 'none', background: '#008060', color: '#fff', cursor: 'pointer',
  },
  statsRow: {
    display: 'flex', gap: '12px', padding: '16px 20px', flexShrink: 0,
    overflowX: 'auto',
  },
  statCard: {
    background: '#fff', borderRadius: '8px', padding: '14px 18px',
    border: '1px solid #e1e3e5', minWidth: '180px', flex: '1',
  },
  statLabel: { fontSize: '12px', color: '#6d7175', marginBottom: '4px' },
  statValue: { fontSize: '20px', fontWeight: '700' },
  statSub: { fontSize: '12px', color: '#6d7175', marginTop: '2px' },
  content: { flex: 1, overflow: 'auto', padding: '0 20px 20px' },
  card: {
    background: '#fff', borderRadius: '8px', border: '1px solid #e1e3e5',
    overflow: 'hidden',
  },
  toolbar: {
    padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center',
    borderBottom: '1px solid #e1e3e5', flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1, minWidth: '200px', padding: '7px 12px', border: '1px solid #c9cccf',
    borderRadius: '6px', fontSize: '13px', outline: 'none',
  },
  filterSelect: {
    padding: '7px 10px', border: '1px solid #c9cccf', borderRadius: '6px',
    fontSize: '13px', color: '#202223', background: '#fff', cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: {
    padding: '10px 14px', background: '#f6f6f7', borderBottom: '1px solid #e1e3e5',
    textAlign: 'left', fontWeight: '600', color: '#6d7175', whiteSpace: 'nowrap',
  },
  td: { padding: '10px 14px', borderBottom: '1px solid #f1f1f1', verticalAlign: 'middle' },
  productCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  productImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  productImgPlaceholder: {
    width: '40px', height: '40px', borderRadius: '6px', background: '#f1f1f1',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
  },
  productName: { fontWeight: '500' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
  },
  badgeActive: { background: '#eaf5ef', color: '#008060' },
  badgeDraft: { background: '#fdf8e7', color: '#b98900' },
  pagination: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderTop: '1px solid #e1e3e5', fontSize: '13px', color: '#6d7175',
  },
  pageBtn: {
    padding: '5px 10px', border: '1px solid #c9cccf', borderRadius: '5px',
    background: '#fff', cursor: 'pointer', fontSize: '12px',
  },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6d7175' },
  deleteBtn: {
    background: 'none', border: 'none', color: '#d72c0d', cursor: 'pointer',
    fontSize: '18px', lineHeight: 1, padding: '4px',
  },
  tabRow: {
    display: 'flex', gap: '0', borderBottom: '1px solid #e1e3e5', padding: '0 16px',
    background: '#fff',
  },
  tab: {
    padding: '10px 14px', fontSize: '13px', color: '#6d7175', cursor: 'pointer',
    border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px',
  },
  tabActive: { color: '#202223', fontWeight: '600', borderBottom: '2px solid #202223' },
}

const PAGE_SIZE = 10

export default function AdminView({ products, onImport, onDeleteProduct }) {
  const [importOpen, setImportOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('all')

  const vendors = [...new Set(products.map(p => p.vendor).filter(Boolean))]

  const filtered = products.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchVendor = vendorFilter === 'all' || p.vendor === vendorFilter
    const matchTab = activeTab === 'all' || p.status === activeTab
    return matchSearch && matchStatus && matchVendor && matchTab
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalInventory = products.reduce((sum, p) =>
    sum + p.variants.reduce((s, v) => s + (v.inventory || 0), 0), 0)

  const handleExport = () => {
    const csv = generateCSVFromProducts(products)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <h1 style={s.topTitle}>Products</h1>
        <button style={s.btn} onClick={handleExport}>Export</button>
        <button style={s.btn} onClick={() => setImportOpen(true)}>Import</button>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={s.statLabel}>Products by sell-through rate</p>
          <p style={s.statValue}>{products.filter(p => p.status === 'active').length}</p>
          <p style={s.statSub}>Active products</p>
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

      <div style={s.content}>
        <div style={s.card}>
          <div style={s.tabRow}>
            {['all', 'active', 'draft', 'archived'].map(tab => (
              <button
                key={tab}
                style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}
                onClick={() => { setActiveTab(tab); setPage(1) }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'all' && <span style={{ marginLeft: '6px', color: '#6d7175' }}>({products.length})</span>}
              </button>
            ))}
          </div>

          <div style={s.toolbar}>
            <input
              style={s.searchInput}
              placeholder="Search products"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            <select
              style={s.filterSelect}
              value={vendorFilter}
              onChange={e => { setVendorFilter(e.target.value); setPage(1) }}
            >
              <option value="all">All vendors</option>
              {vendors.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select
              style={s.filterSelect}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {paginated.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No products found</p>
              <p style={{ fontSize: '13px' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Product</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Inventory</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Vendor</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Variants</th>
                  <th style={{ ...s.th, width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(product => {
                  const inv = product.variants.reduce((s, v) => s + (v.inventory || 0), 0)
                  return (
                    <tr key={product.id} style={{ cursor: 'default' }}>
                      <td style={s.td}>
                        <div style={s.productCell}>
                          {product.image
                            ? <img src={product.image} alt={product.title} style={s.productImg} />
                            : <div style={s.productImgPlaceholder}>👗</div>
                          }
                          <div>
                            <p style={s.productName}>{product.title}</p>
                            <p style={{ fontSize: '12px', color: '#6d7175' }}>{product.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...(product.status === 'active' ? s.badgeActive : s.badgeDraft) }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                          {product.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ color: inv === 0 ? '#d72c0d' : '#202223' }}>
                          {inv === 0 ? 'Out of stock' : `${inv} in stock`}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: '#6d7175' }}>
                        {product.tags.join(', ') || '—'}
                      </td>
                      <td style={{ ...s.td, color: '#6d7175' }}>{product.vendor}</td>
                      <td style={s.td}>${product.price.toFixed(2)}</td>
                      <td style={{ ...s.td, color: '#6d7175' }}>{product.variants.length}</td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => onDeleteProduct(product.id)} title="Delete">
                          ×
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          <div style={s.pagination}>
            <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button style={s.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
              <span style={{ fontSize: '12px' }}>{page} / {totalPages}</span>
              <button style={s.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImport={newProducts => {
            onImport(newProducts)
            setImportOpen(false)
          }}
        />
      )}
    </div>
  )
}
