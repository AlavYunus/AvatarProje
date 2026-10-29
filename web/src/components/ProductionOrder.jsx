import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Save } from 'lucide-react'

function ProductionOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [materials, setMaterials] = useState([
    { lot_id: '', material_type: 'ET', quantity: '', cost_per_unit: '' },
    { lot_id: '', material_type: 'BAHARAT', quantity: '', cost_per_unit: '' },
    { lot_id: '', material_type: 'BİBERLİK', quantity: '', cost_per_unit: '' }
  ])
  const [expectedOutput, setExpectedOutput] = useState('')
  const [eKP, setEKP] = useState(null)

  const handleAddMaterial = () => {
    setMaterials([...materials, { lot_id: '', material_type: '', quantity: '', cost_per_unit: '' }])
  }

  const handleRemoveMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!orderNumber) {
      toast.error('Üretim emri numarası giriniz')
      return
    }

    const orderData = {
      order_number: orderNumber,
      materials: materials.map((m, i) => ({
        lot_id: m.lot_id || '',
        material_type: m.material_type || '',
        quantity: parseFloat(m.quantity) || 0,
        cost_per_unit: parseFloat(m.cost_per_unit) || 0,
        total_cost: (parseFloat(m.quantity) || 0) * (parseFloat(m.cost_per_unit) || 0)
      })),
      expected_output: parseFloat(expectedOutput) || 0
    }

    try {
      const response = await axios.post('/api/production/orders', orderData)
      toast.success('Üretim emri oluşturuldu')
      setEKP(response.data.economic_cost_per_unit)
    } catch (error) {
      toast.error('Üretim emri oluşturulurken hata oluştu')
    }
  }

  const calculateTotalCost = () => {
    return materials.reduce((sum, m) => sum + (parseFloat(m.total_cost) || 0), 0)
  }

  return (
    <div className="production-order">
      <h2>Üretim Emri Yönetimi</h2>

      <div className="form-group">
        <label>Üretim Emri Numarası</label>
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="örn: URT-2026-045"
        />
      </div>

      <div className="form-group">
        <label>Beklenen Üretim Miktarı (paket)</label>
        <input
          type="number"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          placeholder="85"
        />
      </div>

      {materials.map((material, index) => (
        <div key={index} className="material-row">
          <select
            value={material.lot_id}
            onChange={(e) => {
              const newMaterials = [...materials]
              newMaterials[index].lot_id = e.target.value
              setMaterials(newMaterials)
            }}
          >
            <option value="">Lot Seçiniz</option>
            <option value="1">ET-2026-001</option>
            <option value="2">BAHARAT-2026-001</option>
            <option value="3">BİBERLİK-2026-001</option>
          </select>

          <select
            value={material.material_type}
            onChange={(e) => {
              const newMaterials = [...materials]
              newMaterials[index].material_type = e.target.value
              setMaterials(newMaterials)
            }}
          >
            <option value="">Madde Türü</option>
            <option value="ET">Et</option>
            <option value="BAHARAT">Baharat</option>
            <option value="BİBERLİK">Biberlik</option>
          </select>

          <input
            type="number"
            placeholder="Miktar (kg)"
            value={material.quantity}
            onChange={(e) => {
              const newMaterials = [...materials]
              newMaterials[index].quantity = e.target.value
              setMaterials(newMaterials)
            }}
          />

          <input
            type="number"
            placeholder="Birim Fiyat (TL)"
            value={material.cost_per_unit}
            onChange={(e) => {
              const newMaterials = [...materials]
              newMaterials[index].cost_per_unit = e.target.value
              setMaterials(newMaterials)
            }}
          />

          <span className="total-cost">{(parseFloat(material.total_cost) || 0).toFixed(2)} TL</span>

          <button onClick={() => handleRemoveMaterial(index)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button onClick={handleAddMaterial}>
        <Plus size={16} /> Madde Ekle
      </button>

      <div className="total-summary">
        <h3>Toplam Maliyet: {calculateTotalCost().toFixed(2)} TL</h3>
      </div>

      <button onClick={handleSave}>
        <Save size={16} /> Kaydet
      </button>

      {eKP && (
        <div className="ekp-result">
          <h3>EKP (Gerçek Maliyet): {(eKP || 0).toFixed(2)} TL/paket</h3>
        </div>
      )}
    </div>
  )
}

export default ProductionOrder
