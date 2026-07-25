// Sample sales ledger — replace by importing your own CSV/XLSX file.
// Required columns: date, product, category, region, units, revenue

const regions = ['North', 'South', 'East', 'West']
const categories = {
  Electronics: ['Wireless Earbuds', '4K Monitor', 'Mechanical Keyboard', 'Smart Watch', 'Bluetooth Speaker'],
  Home: ['Air Purifier', 'Robot Vacuum', 'Standing Desk', 'LED Desk Lamp'],
  Apparel: ['Running Shoes', 'Rain Jacket', 'Wool Sweater'],
  Office: ['Ergo Chair', 'Notebook Set', 'Whiteboard'],
}

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function generateSampleData() {
  const rand = seededRandom(42)
  const rows = []
  const start = new Date('2024-08-01')
  const days = 365

  const basePrice = {
    'Wireless Earbuds': 59, '4K Monitor': 320, 'Mechanical Keyboard': 89, 'Smart Watch': 210, 'Bluetooth Speaker': 45,
    'Air Purifier': 140, 'Robot Vacuum': 260, 'Standing Desk': 310, 'LED Desk Lamp': 32,
    'Running Shoes': 78, 'Rain Jacket': 95, 'Wool Sweater': 64,
    'Ergo Chair': 220, 'Notebook Set': 14, 'Whiteboard': 55,
  }

  for (let d = 0; d < days; d++) {
    const date = new Date(start)
    date.setDate(date.getDate() + d)
    const month = date.getMonth()
    const seasonal = 1 + 0.35 * Math.sin((month / 12) * Math.PI * 2 + 1) + (month === 10 || month === 11 ? 0.5 : 0)
    const ordersToday = Math.floor(6 + rand() * 10 * seasonal)

    for (let i = 0; i < ordersToday; i++) {
      const catNames = Object.keys(categories)
      const category = catNames[Math.floor(rand() * catNames.length)]
      const products = categories[category]
      const product = products[Math.floor(rand() * products.length)]
      const region = regions[Math.floor(rand() * regions.length)]
      const units = 1 + Math.floor(rand() * 4)
      const price = basePrice[product] * (0.92 + rand() * 0.16)
      const revenue = Math.round(price * units * 100) / 100

      rows.push({
        date: date.toISOString().slice(0, 10),
        product,
        category,
        region,
        units,
        revenue,
      })
    }
  }
  return rows
}

export const sampleData = generateSampleData()
