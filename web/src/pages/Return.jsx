import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { RefreshCw, ShieldAlert, ClipboardList } from 'lucide-react'
import { returnServices } from '../services/api'

const initialReturns = [
  { id: 1, returnNumber: 'RET-2026-001', lotId: 1, productName: 'Narin Sucuk', quantity: 30, costPerUnit: 18.16, totalCost: 544.80, status: 'blocked' },
]

function Return() {
  const [returns, setReturns] = useState(initialReturns)
  const [returnNumber, setReturnNumber] = useState('RET-2026-002')
  const [lotId, setLotId] = useState('1')
  const [productName, setProductName] = useState('Narin Sucuk')
  const [quantity, setQuantity] = useState('30')
  const [costPerUnit, setCostPerUnit] = useState('18.16')
  const [totalCost, setTotalCost] = useState('544.80')
  const [loading, setLoading] = useState(false)

  const handleQtyOrCost = (field, val) => {
    const q = parseFloat(field === 'quantity' ? val : quantity)
    const c = parseFloat(field === 'costPerUnit' ? val : costPerUnit)
    if (field === 'quantity') setQuantity(val)
    if (field === 'costPerUnit') setCostPerUnit(val)
    if (!isNaN(q) && !isNaN(c)) {
      setTotalCost((q * c).toFixed(2))
    }
  }

  const createReturn = async () => {
    if (!returnNumber || !lotId || !productName || !quantity || !costPerUnit) {
      toast.error('Tüm alanlar zorunludur!')
      return
    }

    setLoading(true)
    try {
      const response = await returnServices.createReturn({
        return_number: returnNumber.trim(),
        lot_id: parseInt(lotId, 10) || 1,
        product_name: productName.trim(),
        quantity: parseFloat(quantity) || 0,
        cost_per_unit: parseFloat(costPerUnit) || 0
      })
      setReturns([...returns, response.data])
      toast.success('Geri iade kaydı başarıyla oluşturuldu!')
    } catch (error) {
      console.error('Geri iade hatası:', error)
      toast.error('Hata oluştu: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const blockAffectedProducts = (targetLotId) => {
    toast.error(`Lot ID: ${targetLotId || 1} numaralı lottan etkilenen tüm ürünler bloke edildi!`)
  }

  const generateDistributionList = () => {
    toast.success('Malzeme ve market bazlı miktar listesi oluşturuldu!')
  }

  return (
    <div className="return">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-icon">
            <RefreshCw size={24} />
          </div>
          <div>
            <h1>Geri İade Yönetimi</h1>
            <p>Geri iade kayıtları, lot bazlı ürün blokajı ve market dağılım listesi</p>
          </div>
        </div>
      </div>

      <div className="split-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Yeni Geri İade Oluştur</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Geri İade Numarası</label>
              <input
                type="text"
                value={returnNumber}
                onChange={(e) => setReturnNumber(e.target.value)}
                placeholder="örn: RET-2026-001"
              />
            </div>

            <div className="form-group">
              <label>Lot ID</label>
              <input
                type="number"
                value={lotId}
                onChange={(e) => setLotId(e.target.value)}
                placeholder="örn: 1"
              />
            </div>

            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="örn: Narin Sucuk"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Miktar (paket)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQtyOrCost('quantity', e.target.value)}
                placeholder="örn: 30"
              />
            </div>

            <div className="form-group">
              <label>Birim Maliyet (TL)</label>
              <input
                type="number"
                step="0.01"
                value={costPerUnit}
                onChange={(e) => handleQtyOrCost('costPerUnit', e.target.value)}
                placeholder="örn: 18.16"
              />
            </div>

            <div className="form-group">
              <label>Toplam Maliyet (TL)</label>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="Otomatik hesaplanır"
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={createReturn} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Geri İade Oluştur'}
          </button>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">⚠️ Lot Bazlı Etkilenen Ürünler</h2>
            </div>
            <p><strong>Lot ID:</strong> {lotId}</p>
            <button className="btn btn-danger" onClick={() => blockAffectedProducts(lotId)}>
              <ShieldAlert size={16} /> Etkilenen Ürünleri Bloke Et
            </button>
            <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.84rem', color: '#667085' }}>
              <em>Sorunlu lottan etkilenen tüm mamul lotlar, stoklar ve sevkiyatlar bloke edilecek.</em>
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📋 Malzeme/Market Bazlı Miktar Listesi</h2>
            </div>
            <button className="btn btn-secondary" onClick={generateDistributionList}>
              <ClipboardList size={16} /> Miktar Listesini Oluştur
            </button>
            <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.84rem', color: '#667085' }}>
              <em>İkinci dereceye dağıtım yalnızca kaydedilirse kesin olarak gösterilecek.</em>
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Geri İade Kayıtları</h2>
        </div>

        <div className="table-container" style={{ marginBottom: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>Geri İade Numarası</th>
                <th>Lot ID</th>
                <th>Ürün</th>
                <th>Miktar (paket)</th>
                <th>Birim Maliyet (TL)</th>
                <th>Toplam Maliyet (TL)</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((returnItem, idx) => {
                const qty = parseFloat(returnItem.quantity) || 0
                const cpu = parseFloat(returnItem.costPerUnit ?? returnItem.cost_per_unit) || 0
                const tCost = returnItem.totalCost !== undefined && returnItem.totalCost !== ''
                  ? parseFloat(returnItem.totalCost)
                  : qty * cpu

                return (
                  <tr key={returnItem.id || idx}>
                    <td className="mono">{returnItem.returnNumber || returnItem.return_number}</td>
                    <td>{returnItem.lotId ?? returnItem.lot_id}</td>
                    <td>{returnItem.productName || returnItem.product_name}</td>
                    <td>{qty.toFixed(2)}</td>
                    <td>{cpu.toFixed(2)}</td>
                    <td>{tCost.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-danger">
                        {returnItem.status === 'blocked' ? 'Bloke Edildi' : (returnItem.status || 'Kaydedildi')}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="material-row-box" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>📝 Örnek Senaryo: Sorunlu Lot (ET-2026-001)</h3>
          <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.88rem' }}>
            Sorunlu hammadde lotundan etkilenen mamul lotlar, stoklar ve sevkiyatlar listelenir.
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.86rem' }}>
            <li>Mamul Lot: SUC-2026-045 (85 paket)</li>
            <li>Market A: 30 paket | Market B: 25 paket | Market C: 30 paket</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Return