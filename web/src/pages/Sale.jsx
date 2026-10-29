import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ShoppingCart, ShieldAlert, ShieldCheck, Search } from 'lucide-react'
import { saleServices } from '../services/api'

const initialSales = [
  { id: 1, saleNumber: 'SAL-2026-001', productName: 'Narin Sucuk', quantity: 30, costPerUnit: 18.16, totalCost: 544.80, salePrice: 25.00, profit: 205.20 },
]

function Sale() {
  const [sales, setSales] = useState(initialSales)
  const [saleNumber, setSaleNumber] = useState('SAL-2026-002')
  const [productName, setProductName] = useState('Narin Sucuk')
  const [quantity, setQuantity] = useState('30')
  const [costPerUnit, setCostPerUnit] = useState('18.16')
  const [salePrice, setSalePrice] = useState('25.00')
  const [blockedMap, setBlockedMap] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadSales = async () => {
      try {
        const res = await saleServices.getSales()
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSales(res.data)
        }
      } catch {
        // Varsayılan liste korunur
      }
    }
    loadSales()
  }, [])

  const createSale = async () => {
    const cleanSaleNo = saleNumber.trim()
    const cleanProdName = productName.trim()
    const parsedQty = parseFloat(quantity)
    const parsedCost = parseFloat(costPerUnit)
    const parsedPrice = parseFloat(salePrice)

    if (!cleanSaleNo || !cleanProdName || isNaN(parsedQty) || isNaN(parsedCost) || isNaN(parsedPrice)) {
      toast.error('Tüm alanlar zorunludur ve sayısal alanlar geçerli olmalıdır!')
      return
    }

    setLoading(true)
    try {
      const response = await saleServices.createSale({
        sale_number: cleanSaleNo,
        product_name: cleanProdName,
        quantity: parsedQty,
        cost_per_unit: parsedCost,
        sale_price: parsedPrice
      })

      const createdRecord = response.data && (response.data.saleNumber || response.data.sale_number)
        ? response.data
        : {
            id: Date.now(),
            saleNumber: cleanSaleNo,
            productName: cleanProdName,
            quantity: parsedQty,
            costPerUnit: parsedCost,
            salePrice: parsedPrice,
            profit: (parsedPrice - parsedCost) * parsedQty
          }

      setSales([...sales, createdRecord])
      toast.success(`${cleanSaleNo} satış kaydı başarıyla oluşturuldu!`)

      // Bir sonraki satış numarasını otomatik artır (örn: SAL-2026-003)
      const nextIndex = sales.length + 2
      setSaleNumber(`SAL-2026-00${nextIndex}`)
    } catch (error) {
      console.error('Satış hatası:', error.response?.data || error)
      toast.error('Hata oluştu: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Bloke Etme Fonksiyonu
  const blockReturn = (targetSaleNo) => {
    const key = (targetSaleNo || saleNumber || 'SAL-2026-001').trim()
    setBlockedMap(prev => ({ ...prev, [key]: true }))
    toast.error(`🚫 ${key} numaralı satış bloke edildi! Artık geri iade ve saha satışı yapılamaz.`)
  }

  // Blokeyi İptal Etme Fonksiyonu (Yalnızca bloke edilmiş kayıtlar için çağrılabilir)
  const cancelBlockReturn = (targetSaleNo) => {
    const key = (targetSaleNo || saleNumber || 'SAL-2026-001').trim()
    if (!blockedMap[key]) return
    setBlockedMap(prev => ({ ...prev, [key]: false }))
    toast.success(`✅ ${key} numaralı satışın blokesi iptal edildi ve normal statüye döndürüldü!`)
  }

  const activeFormKey = (saleNumber || 'SAL-2026-001').trim()
  const isCurrentFormSaleBlocked = Boolean(blockedMap[activeFormKey])

  const filteredSales = sales.filter((s) => {
    const sNum = (s.saleNumber || s.sale_number || '').toLowerCase()
    const pName = (s.productName || s.product_name || '').toLowerCase()
    const q = searchQuery.toLowerCase()
    return sNum.includes(q) || pName.includes(q)
  })

  const blockedCount = Object.values(blockedMap).filter(Boolean).length

  return (
    <div className="sale">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-icon">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1>Satış Yönetimi</h1>
            <p>Yeni satış oluşturma, lot bazlı stok kontrolü ve dinamik geri iade blokaj yönetimi</p>
          </div>
        </div>
        {blockedCount > 0 && (
          <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}>
            🚫 {blockedCount} Satış Kaydı Bloke Altında
          </span>
        )}
      </div>

      <div className="split-grid">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Yeni Satış Oluştur</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Satış Numarası</label>
              <input
                type="text"
                value={saleNumber}
                onChange={(e) => setSaleNumber(e.target.value)}
                placeholder="örn: SAL-2026-001"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="örn: Narin Sucuk"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Miktar (paket)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="örn: 30"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Birim Maliyet (TL)</label>
              <input
                type="number"
                step="0.01"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                placeholder="örn: 18.16"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Satış Fiyatı (TL)</label>
              <input
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="örn: 25.00"
                className="form-input"
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={createSale} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Satış Oluştur'}
          </button>
        </div>

        {/* Stok Kontrolü & Dinamik Bloke / İptal */}
        {sales.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📦 Lot Bazlı Stok Kontrolü</h2>
              <span className={`badge ${isCurrentFormSaleBlocked ? 'badge-danger' : 'badge-success'}`}>
                {isCurrentFormSaleBlocked ? `🚫 ${activeFormKey}: Bloke Edildi` : `✅ ${activeFormKey}: Aktif`}
              </span>
            </div>
            <p style={{ margin: '0.3rem 0' }}><strong>Satılan Miktar:</strong> {quantity || 0} paket</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Birim Maliyet:</strong> {(parseFloat(costPerUnit) || 0).toFixed(2)} TL</p>
            <p style={{ margin: '0.3rem 0 1rem 0' }}>
              <strong>Toplam Maliyet:</strong> {((parseFloat(quantity) || 0) * (parseFloat(costPerUnit) || 0)).toFixed(2)} TL
            </p>

            <div className="material-row-box" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Geri İade Kontrolü ({activeFormKey})</h3>
              <p style={{ fontSize: '0.84rem', color: '#667085', marginBottom: '0.75rem' }}>
                {isCurrentFormSaleBlocked
                  ? 'Bu satış şu anda bloke edilmiştir. İnceleme tamamlandıysa blokeyi iptal edebilirsiniz.'
                  : 'Sorunlu lotlardan etkilenen bu satışı bloke ederek geri iadeyi engelleyebilirsiniz.'}
              </p>
              <div className="btn-group">
                {!isCurrentFormSaleBlocked ? (
                  <button className="btn btn-danger" onClick={() => blockReturn(activeFormKey)}>
                    <ShieldAlert size={16} /> Geri İadeyi Engelle (Bloke Et)
                  </button>
                ) : (
                  <>
                    <span className="badge badge-danger" style={{ padding: '0.5rem 0.85rem' }}>
                      🚫 Şu An Bloke Altında
                    </span>
                    <button className="btn btn-success" onClick={() => cancelBlockReturn(activeFormKey)}>
                      <ShieldCheck size={16} /> Blokeyi İptal Et (Kaldır)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Satış Kayıtları Tablosu — Dinamik Bloke / İptal Aksiyonlu */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Satış Kayıtları</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '260px' }}>
            <Search size={16} color="#667085" />
            <input
              type="text"
              className="form-input"
              placeholder="Satış No veya Ürün Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.84rem' }}
            />
          </div>
        </div>

        <div className="table-container" style={{ marginBottom: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>Satış Numarası</th>
                <th>Ürün</th>
                <th>Miktar (paket)</th>
                <th>Birim Maliyet (TL)</th>
                <th>Satış Fiyatı (TL)</th>
                <th>Kâr (TL)</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, idx) => {
                const sNum = sale.saleNumber || sale.sale_number || `SAL-${idx + 1}`
                const pName = sale.productName || sale.product_name || '-'
                const qty = parseFloat(sale.quantity) || 0
                const cpu = parseFloat(sale.costPerUnit ?? sale.cost_per_unit) || 0
                const sp = parseFloat(sale.salePrice ?? sale.sale_price) || 0
                const prf = sale.profit !== undefined && sale.profit !== '' ? parseFloat(sale.profit) : (sp - cpu) * qty
                const isBlocked = Boolean(blockedMap[sNum])

                return (
                  <tr
                    key={sale.id || idx}
                    style={isBlocked ? { backgroundColor: '#fef3f2' } : undefined}
                  >
                    <td className="mono">{sNum}</td>
                    <td><strong>{pName}</strong></td>
                    <td>{qty.toFixed(2)}</td>
                    <td>{cpu.toFixed(2)} TL</td>
                    <td>{sp.toFixed(2)} TL</td>
                    <td className="positive">{prf.toFixed(2)} TL</td>
                    <td>
                      {isBlocked ? (
                        <span className="badge badge-danger">🚫 Bloke Edildi</span>
                      ) : (
                        <span className="badge badge-success">✅ Aktif</span>
                      )}
                    </td>
                    <td>
                      {/* Mantıksal Düzeltme: Bloke edilmeden "Blokeyi İptal Et" asla görünmez */}
                      {!isBlocked ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => blockReturn(sNum)}
                        >
                          <ShieldAlert size={14} /> Bloke Et
                        </button>
                      ) : (
                        <div className="btn-group">
                          <span className="badge badge-danger">Blokeli</span>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => cancelBlockReturn(sNum)}
                          >
                            <ShieldCheck size={14} /> Blokeyi İptal Et
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Örnek Senaryo */}
        <div className="material-row-box" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>📝 Örnek Senaryo: Narin Sucuk Satışı</h3>
          <p style={{ margin: '0.2rem 0', fontSize: '0.88rem' }}>
            Miktar: 30 paket | Birim Maliyet: 18.16 TL | Satış Fiyatı: 25.00 TL
          </p>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>
            <strong>Kâr:</strong> {((25.00 - 18.16) * 30).toFixed(2)} TL = 205.20 TL
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sale