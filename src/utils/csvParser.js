function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export function parseShopifyCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const get = (row, key) => {
    const idx = headers.indexOf(key)
    return idx >= 0 ? (row[idx] || '').trim() : ''
  }

  const rows = lines.slice(1).map(line => parseCSVLine(line))
  const productMap = new Map()

  rows.forEach(row => {
    const handle = get(row, 'Handle')
    if (!handle) return

    if (!productMap.has(handle)) {
      const rawTags = get(row, 'Tags')
      productMap.set(handle, {
        id: handle,
        handle,
        title: get(row, 'Title'),
        description: get(row, 'Body (HTML)'),
        vendor: get(row, 'Vendor'),
        tags: rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: get(row, 'Status') || 'active',
        price: parseFloat(get(row, 'Variant Price')) || 0,
        image: get(row, 'Image Src'),
        variants: [],
      })
    }

    const size = get(row, 'Option1 Value')
    const color = get(row, 'Option2 Value')
    if (size || color) {
      productMap.get(handle).variants.push({
        size,
        color,
        inventory: parseInt(get(row, 'Variant Inventory Qty')) || 0,
        price: parseFloat(get(row, 'Variant Price')) || 0,
        sku: get(row, 'Variant SKU'),
      })
    }
  })

  return Array.from(productMap.values())
}

export function generateCSVFromProducts(products) {
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Tags', 'Published',
    'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
    'Variant SKU', 'Variant Inventory Qty', 'Variant Price',
    'Variant Requires Shipping', 'Variant Taxable',
    'Image Src', 'Image Position', 'Status',
  ]

  const escape = val => {
    const s = String(val ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const rows = [headers.join(',')]

  products.forEach(p => {
    p.variants.forEach((v, i) => {
      const row = [
        p.handle,
        i === 0 ? escape(p.title) : '',
        i === 0 ? escape(p.description) : '',
        i === 0 ? p.vendor : '',
        i === 0 ? p.tags.join(',') : '',
        i === 0 ? 'true' : '',
        i === 0 ? 'Size' : '',
        v.size,
        i === 0 ? 'Color' : '',
        v.color,
        v.sku || '',
        v.inventory,
        v.price,
        'true',
        'true',
        i === 0 ? p.image : '',
        i === 0 ? '1' : '',
        i === 0 ? p.status : '',
      ]
      rows.push(row.join(','))
    })
  })

  return rows.join('\n')
}
