import { useState, useRef } from 'react'

const ALL_SIZES  = ['XS', 'S', 'M', 'L']
const ALL_COLORS = ['Black', 'White', 'Red', 'Blue', 'Navy', 'Green']

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' },
  drawer: {
    width: '620px', maxWidth: '100vw', height: '100%', background: '#fff',
    display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 32px rgba(0,0,0,0.18)',
    animation: 'slideIn 0.22s ease',
  },
  header: {
    padding: '18px 24px', borderBottom: '1px solid #e1e3e5',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  title: { fontSize: '18px', fontWeight: '700' },
  closeBtn: { background: 'none', border: 'none', fontSize: '22px', color: '#6d7175', cursor: 'pointer', lineHeight: 1 },
  body: { flex: 1, overflowY: 'auto', padding: '24px' },
  footer: {
    padding: '16px 24px', borderTop: '1px solid #e1e3e5', flexShrink: 0,
    display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fafafa',
  },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#202223', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #f1f1f1' },
  row: { display: 'flex', gap: '14px', marginBottom: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  label: { fontSize: '12px', fontWeight: '600', color: '#6d7175' },
  required: { color: '#d72c0d' },
  input: {
    padding: '8px 10px', border: '1px solid #c9cccf', borderRadius: '6px',
    fontSize: '13px', outline: 'none', width: '100%',
    transition: 'border-color 0.15s',
  },
  textarea: {
    padding: '8px 10px', border: '1px solid #c9cccf', borderRadius: '6px',
    fontSize: '13px', outline: 'none', width: '100%', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit',
  },
  select: {
    padding: '8px 10px', border: '1px solid #c9cccf', borderRadius: '6px',
    fontSize: '13px', color: '#202223', background: '#fff', cursor: 'pointer', width: '100%',
  },
  imgPreview: { width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid #e1e3e5' },
  imgPlaceholder: { width: '100%', height: '100px', background: '#f6f6f7', borderRadius: '8px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4cdd5', fontSize: '32px', border: '1px dashed #c9cccf' },
  pillRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  pill: {
    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
    border: '1.5px solid #e1e3e5', background: '#fff', color: '#6d7175', cursor: 'pointer',
    transition: 'all 0.12s',
  },
  pillActive: { borderColor: '#202223', background: '#202223', color: '#fff' },
  variantTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '8px' },
  vth: { padding: '7px 10px', background: '#f6f6f7', borderBottom: '1px solid #e1e3e5', textAlign: 'left', fontWeight: '600', color: '#6d7175' },
  vtd: { padding: '6px 10px', borderBottom: '1px solid #f1f1f1' },
  invInput: { width: '60px', padding: '4px 6px', border: '1px solid #c9cccf', borderRadius: '4px', fontSize: '12px', textAlign: 'center' },
  cancelBtn: { padding: '9px 18px', border: '1px solid #c9cccf', borderRadius: '7px', background: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  saveBtn: { padding: '9px 20px', border: 'none', borderRadius: '7px', background: '#008060', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  saveBtnDisabled: { background: '#c9cccf', cursor: 'not-allowed' },
  error: { color: '#d72c0d', fontSize: '12px', marginTop: '3px' },
  colorDot: { width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginRight: '5px', border: '1px solid rgba(0,0,0,0.1)' },
  uploadArea: {
    border: '2px dashed #c9cccf', borderRadius: '8px', padding: '20px',
    textAlign: 'center', cursor: 'pointer', marginTop: '6px', background: '#fafafa',
  },
}

const COLOR_HEX = { Black: '#1a1a1a', White: '#f0f0f0', Red: '#dc2626', Blue: '#3b82f6', Navy: '#1e3a5f', Green: '#16a34a' }

function Pill({ label, active, onClick, color }) {
  return (
    <button style={{ ...s.pill, ...(active ? s.pillActive : {}) }} onClick={onClick} type="button">
      {color && <span style={{ ...s.colorDot, background: color }} />}
      {label}
    </button>
  )
}

export default function AddProductModal({ onClose, onSave }) {
  const fileRef = useRef()
  const [form, setForm] = useState({
    title: '', description: '', price: '', vendor: 'partners-demo',
    tags: 'women', status: 'active', image: '',
  })
  const [sizes, setSizes]   = useState(['XS', 'S', 'M', 'L'])
  const [colors, setColors] = useState(['Black', 'White'])
  const [inventory, setInventory] = useState({})
  const [errors, setErrors] = useState({})
  const [imgLoaded, setImgLoaded] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleSize  = s => setSizes(prev  => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleColor = c => setColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const variantPairs = sizes.flatMap(sz => colors.map(cl => ({ sz, cl })))

  const setInv = (sz, cl, val) => setInventory(prev => ({ ...prev, [`${sz}-${cl}`]: parseInt(val) || 0 }))

  const validate = () => {
    const e = {}
    if (!form.title.trim())        e.title = 'Title is required'
    if (!form.price || isNaN(+form.price) || +form.price < 0) e.price = 'Enter a valid price'
    if (!sizes.length)             e.sizes = 'Select at least one size'
    if (!colors.length)            e.colors = 'Select at least one color'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    const handle = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const variants = variantPairs.map(({ sz, cl }) => ({
      size: sz, color: cl, inventory: inventory[`${sz}-${cl}`] ?? 0, price: parseFloat(form.price), sku: '',
    }))
    onSave({
      id: handle + '-' + Date.now(),
      handle: handle + '-' + Date.now(),
      title: form.title.trim(),
      description: `<p>${form.description.trim()}</p>`,
      vendor: form.vendor.trim() || 'partners-demo',
      tags: [form.tags],
      status: form.status,
      price: parseFloat(form.price),
      image: form.image.trim(),
      variants,
    })
  }

  const handleImageFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { set('image', ev.target.result); setImgLoaded(true) }
    reader.readAsDataURL(file)
  }

  const isValid = form.title.trim() && form.price && sizes.length && colors.length

  return (
    <>
      <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>
      <div style={s.overlay} onClick={onClose}>
        <div style={s.drawer} onClick={e => e.stopPropagation()}>

          <div style={s.header}>
            <h2 style={s.title}>Add product</h2>
            <button style={s.closeBtn} onClick={onClose}>×</button>
          </div>

          <div style={s.body}>

            {/* Basic info */}
            <div style={s.section}>
              <p style={s.sectionTitle}>Basic information</p>

              <div style={{ marginBottom: '14px' }}>
                <label style={s.label}>Title <span style={s.required}>*</span></label>
                <input
                  style={{ ...s.input, borderColor: errors.title ? '#d72c0d' : '#c9cccf' }}
                  placeholder="e.g. Classic Cotton Tee"
                  value={form.title}
                  onChange={e => { set('title', e.target.value); setErrors(er => ({ ...er, title: '' })) }}
                />
                {errors.title && <p style={s.error}>{errors.title}</p>}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={s.label}>Description</label>
                <textarea
                  style={s.textarea}
                  placeholder="Describe the product..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </div>

              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Price (USD) <span style={s.required}>*</span></label>
                  <input
                    style={{ ...s.input, borderColor: errors.price ? '#d72c0d' : '#c9cccf' }}
                    type="number" min="0" step="0.01" placeholder="0.00"
                    value={form.price}
                    onChange={e => { set('price', e.target.value); setErrors(er => ({ ...er, price: '' })) }}
                  />
                  {errors.price && <p style={s.error}>{errors.price}</p>}
                </div>
                <div style={s.field}>
                  <label style={s.label}>Vendor</label>
                  <input style={s.input} placeholder="partners-demo" value={form.vendor} onChange={e => set('vendor', e.target.value)} />
                </div>
              </div>

              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Category</label>
                  <select style={s.select} value={form.tags} onChange={e => set('tags', e.target.value)}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Status</label>
                  <select style={s.select} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media */}
            <div style={s.section}>
              <p style={s.sectionTitle}>Media</p>
              <label style={s.label}>Image URL</label>
              <input
                style={{ ...s.input, marginTop: '5px' }}
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={e => { set('image', e.target.value); setImgLoaded(false) }}
              />
              <div style={{ ...s.uploadArea, marginTop: '10px' }} onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
                <p style={{ fontSize: '13px', color: '#6d7175' }}>Or click to upload from your computer</p>
                <p style={{ fontSize: '11px', color: '#c4cdd5', marginTop: '4px' }}>PNG, JPG, GIF up to 10MB</p>
              </div>
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  style={s.imgPreview}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(false)}
                />
              )}
            </div>

            {/* Variants */}
            <div style={s.section}>
              <p style={s.sectionTitle}>Variants</p>

              <div style={{ marginBottom: '14px' }}>
                <label style={s.label}>Sizes {errors.sizes && <span style={s.required}> — {errors.sizes}</span>}</label>
                <div style={{ ...s.pillRow, marginTop: '6px' }}>
                  {ALL_SIZES.map(sz => (
                    <Pill key={sz} label={sz} active={sizes.includes(sz)} onClick={() => { toggleSize(sz); setErrors(er => ({ ...er, sizes: '' })) }} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={s.label}>Colors {errors.colors && <span style={s.required}> — {errors.colors}</span>}</label>
                <div style={{ ...s.pillRow, marginTop: '6px' }}>
                  {ALL_COLORS.map(cl => (
                    <Pill key={cl} label={cl} color={COLOR_HEX[cl]} active={colors.includes(cl)} onClick={() => { toggleColor(cl); setErrors(er => ({ ...er, colors: '' })) }} />
                  ))}
                </div>
              </div>

              {variantPairs.length > 0 && (
                <>
                  <label style={s.label}>Set inventory per variant</label>
                  <table style={s.variantTable}>
                    <thead>
                      <tr>
                        <th style={s.vth}>Size</th>
                        <th style={s.vth}>Color</th>
                        <th style={s.vth}>Inventory</th>
                        <th style={s.vth}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantPairs.map(({ sz, cl }) => (
                        <tr key={`${sz}-${cl}`}>
                          <td style={s.vtd}>{sz}</td>
                          <td style={s.vtd}>
                            <span style={{ ...s.colorDot, background: COLOR_HEX[cl] || '#ccc' }} />
                            {cl}
                          </td>
                          <td style={s.vtd}>
                            <input
                              type="number" min="0" style={s.invInput}
                              value={inventory[`${sz}-${cl}`] ?? 0}
                              onChange={e => setInv(sz, cl, e.target.value)}
                            />
                          </td>
                          <td style={{ ...s.vtd, color: '#6d7175' }}>${parseFloat(form.price || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

          </div>

          <div style={s.footer}>
            <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              style={{ ...s.saveBtn, ...(!isValid ? s.saveBtnDisabled : {}) }}
              onClick={handleSave}
              disabled={!isValid}
            >
              Save product
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
