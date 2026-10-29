import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Save } from 'lucide-react'

function CutProduct() {
  const [cutNumber, setCutNumber] = useState('')
  const [animalType, setAnimalType] = useState('Kuzu')
  const [weight, setWeight] = useState('')
  const [costPerUnit, setCostPerUnit] = useState('')
  const [cutProducts, setCutProducts] = useState([])

  const handleSave = async () => {
    if (!cutNumber || !weight) {
      toast.error('Parçalama numarası ve ağırlık giriniz')
      return
    }

    const cutData = {
      cut_number: cutNumber,
      animal_type: animalType,
      weight: parseFloat(weight),
      cost_per_unit: parseFloat(costPerUnit) || 9.70
    }

    try {
      const response = await axios.post('/api/cut/products', cutData)
      toast.success('Parçalama işlemi oluşturuldu')
      setCutProducts(response.data.cut_products)
    } catch (error) {
      toast.error('Parçalama işlemi oluşturulurken hata oluştu')
    }
  }

  const calculateTotal = () => {
    return cutProducts.reduce((sum, p) => sum + (parseFloat(p.total_cost) || 0), 0)
  }

  const calculateYield = () => {
    const totalInput = parseFloat(weight) * parseFloat(costPerUnit)
    const totalOutput = cutProducts.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0)
    return totalInput > 0 ? ((totalOutput / totalInput) * 100).toFixed(2) : '0'
  }

  return (
    <div className="cut-product">
      <h2>Parçalama İşlemleri</h2>

      <div className="form-group">
        <label>Parçalama Numarası</label>
        <input
          type="text"
          value={cutNumber}
          onChange={(e) => setCutNumber(e.target.value)}
          placeholder="örn: CUT-2026-001"
        />
      </div>

      <div className="form-group">
        <label>Hayvan Türü</label>
        <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
          <option value="Kuzu">Kuzu</option>
          <option value="İnek">İnek</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ağırlık (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="100"
        />
      </div>

      <div className="form-group">
        <label>Birim Maliyet (TL)</label>
        <input
          type="number"
          value={costPerUnit}
          onChange={(e) => setCostPerUnit(e.target.value)}
          placeholder="9.70"
        />
      </div>

      <button onClick={handleSave}>
        <Save size={16} /> Kaydet
      </button>

      {cutProducts.length > 0 && (
        <div className="cut-results">
          <h3>Parça Ürünleri</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parça</th>
                <th>Miktar (kg)</th>
                <th>Birim Maliyet (TL)</th>
                <th>Toplam Maliyet (TL)</th>
                <th>Verim (%)</th>
              </tr>
            </thead>
            <tbody>
              {cutProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.product_name}</td>
                  <td>{parseFloat(product.quantity).toFixed(2)}</td>
                  <td>{parseFloat(product.cost_per_unit).toFixed(2)}</td>
                  <td>{parseFloat(product.total_cost).toFixed(2)}</td>
                  <td>{parseFloat(product.yield_percent).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-summary">
            <h4>Toplam Üretim: {cutProducts.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0).toFixed(2)} kg</h4>
            <h4>Toplam Maliyet: {calculateTotal().toFixed(2)} TL</h4>
            <h4>Verim Oranı: {calculateYield()}%</h4>
          </div>
        </div>
      )}
    </div>
  )
}

export default CutProduct
