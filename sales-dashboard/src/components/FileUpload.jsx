import { useRef, useState } from 'react'
import { parseAnyFile } from '../utils/parseFile'

export default function FileUpload({ onData }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setLoading(true)
    try {
      const rows = await parseAnyFile(file)
      if (rows.length === 0) {
        setError('No valid rows found. Expected columns: date, product, category, region, units, revenue.')
      } else {
        onData(rows, file.name)
      }
    } catch (e) {
      setError(e.message || 'Could not parse that file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files?.[0])
      }}
      className={`rounded-card border border-dashed p-4 text-center transition-colors ${
        dragOver ? 'border-signal-accent bg-signal-accent/5' : 'border-surface-line'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <p className="font-mono text-xs text-text-muted">IMPORT DATA</p>
      <p className="mt-1 text-sm text-text">
        {loading ? 'Parsing file…' : 'Drop a .csv or .xlsx file, or'}{' '}
        {!loading && (
          <button
            onClick={() => inputRef.current?.click()}
            className="text-signal-accent underline underline-offset-2 hover:text-signal-accent/80"
          >
            browse
          </button>
        )}
      </p>
      <p className="mt-1 text-[11px] text-text-faint">Columns: date, product, category, region, units, revenue</p>
      {error && <p className="mt-2 text-xs text-signal-down">{error}</p>}
    </div>
  )
}
