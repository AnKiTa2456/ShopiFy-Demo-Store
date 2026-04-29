import { useState, useRef } from 'react'
import { parseShopifyCSV } from '../utils/csvParser'
import { initialProducts } from '../data/products'

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '16px',
  },
  modal: {
    background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '520px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid #e1e3e5',
  },
  title: { fontSize: '16px', fontWeight: '600' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '20px', color: '#6d7175',
    lineHeight: 1, padding: '4px',
  },
  body: { padding: '20px' },
  dropzone: {
    border: '2px dashed #c9cccf', borderRadius: '8px', padding: '40px 20px',
    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
    background: '#fafafa', minHeight: '140px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
  },
  dropzoneActive: {
    borderColor: '#008060', background: '#f0faf6',
  },
  addFileBtn: {
    background: '#fff', border: '1px solid #c9cccf', borderRadius: '6px',
    padding: '8px 16px', fontSize: '13px', fontWeight: '500',
    color: '#202223', cursor: 'pointer',
  },
  dropHint: { fontSize: '12px', color: '#6d7175' },
  fileInfo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', background: '#f6f6f7', borderRadius: '6px',
    border: '1px solid #e1e3e5', marginTop: '12px',
  },
  fileName: { fontSize: '13px', fontWeight: '500', flex: 1 },
  removeFile: {
    background: 'none', border: 'none', color: '#6d7175', fontSize: '18px',
    cursor: 'pointer', lineHeight: 1,
  },
  sampleLink: { color: '#0070f3', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none' },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderTop: '1px solid #e1e3e5', background: '#fafafa',
  },
  cancelBtn: {
    background: '#fff', border: '1px solid #c9cccf', borderRadius: '6px',
    padding: '8px 16px', fontSize: '13px', fontWeight: '500', color: '#202223',
  },
  uploadBtn: {
    background: '#008060', border: 'none', borderRadius: '6px',
    padding: '8px 16px', fontSize: '13px', fontWeight: '500', color: '#fff',
  },
  uploadBtnDisabled: {
    background: '#c9cccf', cursor: 'not-allowed',
  },
  preview: {
    marginTop: '16px', maxHeight: '200px', overflowY: 'auto',
    border: '1px solid #e1e3e5', borderRadius: '6px',
  },
  previewTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  previewTh: { padding: '8px', background: '#f6f6f7', borderBottom: '1px solid #e1e3e5', textAlign: 'left', fontWeight: '600' },
  previewTd: { padding: '8px', borderBottom: '1px solid #f1f1f1' },
  previewImg: { width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' },
  error: { color: '#d72c0d', fontSize: '13px', marginTop: '8px' },
  success: { color: '#008060', fontSize: '13px', marginTop: '8px', fontWeight: '500' },
}

export default function ImportModal({ onClose, onImport }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState('upload')
  const inputRef = useRef()

  const handleFile = async f => {
    if (!f || !f.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.')
      return
    }
    setError('')
    setFile(f)
    const text = await f.text()
    const parsed = parseShopifyCSV(text)
    if (!parsed.length) {
      setError('No valid products found in CSV.')
      setFile(null)
      return
    }
    setPreview(parsed)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = () => {
    if (!preview) return
    onImport(preview)
    setStep('done')
  }

  const downloadSample = () => {
    const link = document.createElement('a')
    link.href = '/HiringExamStoreProducts.csv'
    link.download = 'sample-products.csv'
    link.click()
  }

  if (step === 'done') {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.header}>
            <span style={styles.title}>Import products by CSV</span>
            <button style={styles.closeBtn} onClick={onClose}>×</button>
          </div>
          <div style={{ ...styles.body, textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#008060' }}>
              {preview.length} product{preview.length !== 1 ? 's' : ''} imported successfully!
            </p>
          </div>
          <div style={styles.footer}>
            <span />
            <button style={styles.uploadBtn} onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>Import products by CSV</span>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          <div
            style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneActive : {}) }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8c9196" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            <button style={styles.addFileBtn} onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>
              Add file
            </button>
            <span style={styles.dropHint}>or drop file to upload</span>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {file && (
            <div style={styles.fileInfo}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
              <span style={styles.fileName}>{file.name}</span>
              <button style={styles.removeFile} onClick={() => { setFile(null); setPreview(null) }}>×</button>
            </div>
          )}

          {preview && (
            <div style={styles.preview}>
              <table style={styles.previewTable}>
                <thead>
                  <tr>
                    <th style={styles.previewTh}>Image</th>
                    <th style={styles.previewTh}>Title</th>
                    <th style={styles.previewTh}>Price</th>
                    <th style={styles.previewTh}>Variants</th>
                    <th style={styles.previewTh}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map(p => (
                    <tr key={p.handle}>
                      <td style={styles.previewTd}>
                        {p.image
                          ? <img src={p.image} alt={p.title} style={styles.previewImg} />
                          : <div style={{ ...styles.previewImg, background: '#f1f1f1' }} />
                        }
                      </td>
                      <td style={styles.previewTd}>{p.title || p.handle}</td>
                      <td style={styles.previewTd}>${p.price.toFixed(2)}</td>
                      <td style={styles.previewTd}>{p.variants.length}</td>
                      <td style={styles.previewTd}>
                        <span style={{ color: p.status === 'active' ? '#008060' : '#6d7175', fontWeight: '500' }}>
                          {p.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.sampleLink} onClick={downloadSample}>
            Download sample CSV
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              style={{ ...styles.uploadBtn, ...(!preview ? styles.uploadBtnDisabled : {}) }}
              onClick={handleUpload}
              disabled={!preview}
            >
              Upload and preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
