import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Save } from 'lucide-react'

function Sale() {
  const [saleNumber, setSaleNumber] = useState('')
  const [lotId, setLotId] = useState('')
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [sales, setSales] = useState([])

  const handleSave = async () => {
    if (!saleNumber || !lotId || !quantity) {
      toast.error('Satış numarası, lot ID ve miktar giriniz')
      return
    }

    const saleData = {
      sale_number: saleNumber,
      lot_id: lotId,
      product_name: productName,
      quantity: parseFloat(quantity),
      cost_per_unit: 18.16, // EKP değeri
      total_cost: parseFloat(quantity) * 18.16,
      sale_price: parseFloat(salePrice),
      profit: (parseFloat(salePrice) - 18.16) * parseFloat(quantity)
    }

    try {
      const response = await axios.post('/api/sales', saleData)
      toast.success('Satış kaydı oluşturuldu')
      setSales([...sales, response.data])
    } catch (error) {
      toast.error('Satış kaydı oluşturulurken hata oluştu')
    }
  }

  const calculateTotal = () => {
    return sales.reduce((sum, s) => sum + parseFloat(s.total_cost), 0)
  }

  const calculateTotalRevenue = () => {
    return sales.reduce((sum, s) => sum + parseFloat(s.sale_price) * parseFloat(s.quantity), 0)
  }

  const calculateTotalProfit = () => {
    return sales.reduce((sum, s) => sum + parseFloat(s.profit), 0)
  }

  return (
    <div className="sale">
      <h2>Satış Yönetimi</h2>

      <div className="form-group">
        <label>Satış Numarası</label>
        <input
          type="text"
          value={saleNumber}
          onChange={(e) => setSaleNumber(e.target.value)}
          placeholder="örn: SAL-2026-001"
        />
      </div>

      <div className="form-group">
        <label>Lot ID</label>
        <input
          type="text"
          value={lotId}
          onChange={(e) => setLotId(e.target.value)}
          placeholder="örn: SUC-2026-045"
        />
      </div>

      <div className="form-group">
        <label>Ürün Adı</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="örn: Narın Sucuk"
        />
      </div>

      <div className="form-group">
        <label>Miktar (paket)</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="30"
        />
      </div>

      <div className="form-group">
        <label>Satış Fiyatı (TL/paket)</label>
        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="25.00"
        />
      </div>

      <button onClick={handleSave}>
        <Save size={16} /> Kaydet
      </button>

      {sales.length > 0 && (
        <div className="sale-results">
          <h3>Satışlar</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Satış Numarası</th>
                <th>Lot ID</th>
                <th>Ürün</th>
                <th>Miktar (paket)</th>
                <th>Birim Maliyet (TL)</th>
                <th>Toplam Maliyet (TL)</th>
                <th>Satış Fiyatı (TL)</th>
                <th>Kâr (TL)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.sale_number}</td>
                  <td>{sale.lot_id}</td>
                  <td>{sale.product_name}</td>
                  <td>{parseFloat(sale.quantity).toFixed(2)}</td>
                  <td>{parseFloat(sale.cost_per_unit).toFixed(2)}</td>
                  <td>{parseFloat(sale.total_cost).toFixed(2)}</td>
                  <td>{parseFloat(sale.sale_price).toFixed(2)}</td>
                  <td>{parseFloat(sale.profit).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-summary">
            <h4>Toplam Satış: {calculateTotalRevenue().toFixed(2)} TL</h4>
            <h4>Toplam Maliyet: {calculateTotal().toFixed(2)} TL</h4>
            <h4>Toplam Kâr: {calculateTotalProfit().toFixed(2)} TL</h4>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sale
