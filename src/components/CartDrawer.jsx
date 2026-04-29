const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    zIndex: 800,
  },
  drawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: '380px', maxWidth: '100vw',
    background: '#fff', zIndex: 801, display: 'flex', flexDirection: 'column',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
  },
  header: {
    padding: '20px', borderBottom: '1px solid #e1e3e5',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: '18px', fontWeight: '700' },
  closeBtn: { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6d7175' },
  items: { flex: 1, overflowY: 'auto', padding: '16px' },
  item: {
    display: 'flex', gap: '12px', padding: '12px 0',
    borderBottom: '1px solid #f1f1f1', alignItems: 'flex-start',
  },
  itemImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  itemImgPlaceholder: { width: '60px', height: '60px', background: '#f1f1f1', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' },
  itemVariant: { fontSize: '12px', color: '#6d7175', marginBottom: '8px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '26px', height: '26px', border: '1px solid #e1e3e5', borderRadius: '4px',
    background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', lineHeight: 1,
  },
  qtyNum: { fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' },
  itemPrice: { fontWeight: '600', fontSize: '14px', marginTop: '2px' },
  removeBtn: { background: 'none', border: 'none', color: '#d72c0d', cursor: 'pointer', fontSize: '18px', lineHeight: 1 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#6d7175' },
  footer: { padding: '16px 20px', borderTop: '1px solid #e1e3e5' },
  subtotalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' },
  subtotalLabel: { fontWeight: '600' },
  subtotalValue: { fontWeight: '700', fontSize: '18px' },
  checkoutBtn: {
    width: '100%', background: '#008060', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer',
  },
  continueBtn: {
    width: '100%', background: 'transparent', color: '#202223', border: '1px solid #e1e3e5',
    borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500',
    cursor: 'pointer', marginTop: '8px',
  },
}

export default function CartDrawer({ cart, onClose, onUpdateQty, onRemove }) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <>
      <div style={s.overlay} onClick={onClose} />
      <div style={s.drawer}>
        <div style={s.header}>
          <span style={s.title}>Your Cart ({count})</span>
          <button style={s.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={s.items}>
          {cart.length === 0 ? (
            <div style={s.empty}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>🛒</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>Your cart is empty</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Add some products to get started</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} style={s.item}>
                {item.product.image
                  ? <img src={item.product.image} alt={item.product.title} style={s.itemImg} />
                  : <div style={s.itemImgPlaceholder}>👗</div>
                }
                <div style={s.itemInfo}>
                  <p style={s.itemName}>{item.product.title}</p>
                  <p style={s.itemVariant}>{item.variant.size} / {item.variant.color}</p>
                  <div style={s.qtyRow}>
                    <button style={s.qtyBtn} onClick={() => onUpdateQty(idx, item.qty - 1)}>−</button>
                    <span style={s.qtyNum}>{item.qty}</span>
                    <button style={s.qtyBtn} onClick={() => onUpdateQty(idx, item.qty + 1)}>+</button>
                    <button style={s.removeBtn} onClick={() => onRemove(idx)}>×</button>
                  </div>
                </div>
                <p style={s.itemPrice}>${(item.product.price * item.qty).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={s.footer}>
            <div style={s.subtotalRow}>
              <span style={s.subtotalLabel}>Subtotal</span>
              <span style={s.subtotalValue}>${subtotal.toFixed(2)}</span>
            </div>
            <button
              style={s.checkoutBtn}
              onClick={() => alert(`Order placed! Total: $${subtotal.toFixed(2)}\nThank you for your purchase!`)}
            >
              Checkout • ${subtotal.toFixed(2)}
            </button>
            <button style={s.continueBtn} onClick={onClose}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  )
}
