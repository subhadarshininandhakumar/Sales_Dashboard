import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Accepts a variety of column header spellings and normalizes them to:
// date, product, category, region, units, revenue
const HEADER_MAP = {
  date: 'date', orderdate: 'date', transactiondate: 'date', saledate: 'date',
  product: 'product', productname: 'product', item: 'product', sku: 'product',
  category: 'category', productcategory: 'category', segment: 'category',
  region: 'region', territory: 'region', market: 'region', location: 'region',
  units: 'units', quantity: 'units', qty: 'units', unitssold: 'units',
  revenue: 'revenue', sales: 'revenue', totalrevenue: 'revenue', amount: 'revenue', totalsales: 'revenue',
}

function normalizeKey(key) {
  return key.toString().trim().toLowerCase().replace(/[\s_-]/g, '')
}

function normalizeRow(raw) {
  const out = {}
  for (const key of Object.keys(raw)) {
    const norm = HEADER_MAP[normalizeKey(key)]
    if (norm) out[norm] = raw[key]
  }
  return out
}

function coerceRow(row) {
  const revenue = parseFloat(String(row.revenue).replace(/[^0-9.-]/g, ''))
  const units = parseInt(String(row.units).replace(/[^0-9-]/g, ''), 10)
  let date = row.date
  if (typeof date === 'number') {
    // Excel serial date
    const parsed = XLSX.SSF.parse_date_code(date)
    if (parsed) date = `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`
  } else if (date) {
    const d = new Date(date)
    if (!isNaN(d.getTime())) date = d.toISOString().slice(0, 10)
  }
  return {
    date: date || null,
    product: row.product?.toString().trim() || 'Unknown',
    category: row.category?.toString().trim() || 'Uncategorized',
    region: row.region?.toString().trim() || 'Unspecified',
    units: isNaN(units) ? 0 : units,
    revenue: isNaN(revenue) ? 0 : revenue,
  }
}

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data.map(normalizeRow).map(coerceRow).filter(r => r.date && r.revenue >= 0)
          resolve(rows)
        } catch (e) {
          reject(e)
        }
      },
      error: reject,
    })
  })
}

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: false })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        const rows = json.map(normalizeRow).map(coerceRow).filter(r => r.date && r.revenue >= 0)
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function parseAnyFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.csv')) return parseCSV(file)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return parseExcel(file)
  return Promise.reject(new Error('Unsupported file type. Please upload a .csv, .xlsx, or .xls file.'))
}
