import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 900, padding: '16px',
  },
  modal: {
    background: '#fff', borderRadius: '12px', maxWidth: '800px', width: '100%',
    maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
  },
  body: { display: 'flex', overflow: 'hidden', flex: 1 },
  imgWrap: { width: '45%', flexShrink: 0, background: '#f6f6f7' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  closeBtn: {
    position: 'absolute', top: '12px', right: '12px',
    background: '#fff', border: 'none', borderRadius: '50%',
    width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  tag: {
    display: 'inline-block', background: '#f1f1f1', borderRadius: '4px',
    padding: '2px 8px', fontSize: '11px', color: '#6d7175', textTransform: 'capitalize',
  },
  title: { fontSize: '24px', fontWeight: '700', lineHeight: 1.3 },
  price: { fontSize: '22px', fontWeight: '600', color: '#202223' },
  label: { fontSize: '12px', fontWeight: '600', color: '#6d7175', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  optionBtn: {
    padding: '6px 14px', borderRadius: '6px', border: '1.5px solid #e1e3e5',
    background: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '500',
    transition: 'all 0.15s',
  },
  optionBtnActive: { borderColor: '#202223', background: '#202223', color: '#fff' },
  optionBtnOos: { opacity: 0.4, cursor: 'default', textDecoration: 'line-through' },
  addBtn: {
    background: '#202223', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '14px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    marginTop: 'auto', transition: 'background 0.15s',
  },
  addBtnDisabled: { background: '#c9cccf', cursor: 'not-allowed' },
  addedMsg: { color: '#008060', fontSize: '13px', fontWeight: '500' },
  desc: { fontSize: '14px', color: '#6d7175', lineHeight: 1.6 },
  vendor: { fontSize: '12px', color: '#8c9196' },
}

export default function ProductModal({ product, onClose, onAddToCart }) {
  const { isMobile } = useBreakpoint()
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [added, setAdded] = useState(false)

  const sizes = [...new Set(product.variants.map(v => v.size))]
  const colors = [...new Set(product.variants.map(v => v.color))]

  const getVariant = (size, color) =>
    product.variants.find(v => v.size === size && v.color === color)

  const isColorAvailable = color => {
    if (!selectedSize) return colors.some(c => c === color)
    return !!getVariant(selectedSize, color)
  }

  const isSizeAvailable = size => {
    if (!selectedColor) return sizes.some(s => s === size)
    return !!getVariant(size, selectedColor)
  }

  const selectedVariant = selectedSize && selectedColor
    ? getVariant(selectedSize, selectedColor)
    : null

  const canAdd = selectedVariant !== null

  const handleAdd = () => {
    if (!canAdd) return
    onAddToCart({ product, variant: selectedVariant })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ ...s.overlay, padding: isMobile ? '0' : '16px', alignItems: isMobile ? 'flex-end' : 'center' }} onClick={onClose}>
      <div style={{ ...s.modal, position: 'relative', borderRadius: isMobile ? '16px 16px 0 0' : '12px', maxHeight: isMobile ? '92vh' : '90vh' }} onClick={e => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>×</button>
        <div style={{ ...s.body, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ ...s.imgWrap, width: isMobile ? '100%' : '45%', maxHeight: isMobile ? '240px' : 'none' }}>
            {product.image
              ? <img src={product.image} alt={product.title} style={s.img} />
              : <div style={{ ...s.img, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>👗</div>
            }
          </div>
          <div style={{ ...s.info, padding: isMobile ? '20px' : '32px' }}>
            <div>
              {product.tags.map(tag => <span key={tag} style={s.tag}>{tag}</span>)}
              <span style={{ ...s.tag, marginLeft: '6px' }}>{product.vendor}</span>
            </div>
            <h2 style={s.title}>{product.title}</h2>
            <p style={s.price}>${product.price.toFixed(2)}</p>

            <div>
              <p style={s.label}>Size</p>
              <div style={s.optionRow}>
                {sizes.map(size => (
                  <button
                    key={size}
                    style={{
                      ...s.optionBtn,
                      ...(selectedSize === size ? s.optionBtnActive : {}),
                      ...(!isSizeAvailable(size) ? s.optionBtnOos : {}),
                    }}
                    onClick={() => isSizeAvailable(size) && setSelectedSize(selectedSize === size ? null : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={s.label}>Color</p>
              <div style={s.optionRow}>
                {colors.map(color => (
                  <button
                    key={color}
                    style={{
                      ...s.optionBtn,
                      ...(selectedColor === color ? s.optionBtnActive : {}),
                      ...(!isColorAvailable(color) ? s.optionBtnOos : {}),
                    }}
                    onClick={() => isColorAvailable(color) && setSelectedColor(selectedColor === color ? null : color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {!canAdd && selectedSize && selectedColor && (
              <p style={{ color: '#d72c0d', fontSize: '13px' }}>This combination is unavailable.</p>
            )}

            <div
              style={{ fontSize: '13px', color: '#6d7175', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <button
              style={{ ...s.addBtn, ...((!canAdd) ? s.addBtnDisabled : {}) }}
              onClick={handleAdd}
              disabled={!canAdd}
            >
              {!selectedSize || !selectedColor
                ? 'Select size and color'
                : added ? '✓ Added to cart' : 'Add to cart'
              }
            </button>
            {added && <p style={s.addedMsg}>Added to cart!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
