import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Sparkles, Factory, Plus, Trash2, Calculator, CheckCircle2 } from 'lucide-react'
import { productionServices, mlServices } from '../services/api'

const initialMaterials = [
  { lot_id: '1', material_type: 'ET', quantity: '100', cost_per_unit: '9.70', total_cost: '970.00' },
  { lot_id: '3', material_type: 'BAHARAT', quantity: '2', cost_per_unit: '24.00', total_cost: '48.00' },
  { lot_id: '4', material_type: 'BİBERLİK', quantity: '5', cost_per_unit: '11.60', total_cost: '58.00' },
]

const MATERIAL_TYPES = [
  { value: 'ET', label: 'Et (Genel)' },
  { value: 'DANA_KARKAS', label: 'Dana Karkas Et', backendType: 'ET' },
  { value: 'KUZU_KARKAS', label: 'Kuzu Karkas Et', backendType: 'ET' },
  { value: 'DANA_KIYMA', label: 'Dana Kıymalık Et', backendType: 'ET' },
  { value: 'KUYRUK_YAGI', label: 'Kuyruk & Kavram Yağı', backendType: 'ET' },
  { value: 'BAHARAT', label: 'Baharat Karışımı' },
  { value: 'KIMYON_KARABIBER', label: 'Kimyon & Karabiber', backendType: 'BAHARAT' },
  { value: 'SARIMSAK', label: 'Soyulmuş Sarımsak / Püre', backendType: 'BAHARAT' },
  { value: 'TUZ', label: 'Kaya Tuzu & Nitrit', backendType: 'BAHARAT' },
  { value: 'BİBERLİK', label: 'Biberlik (Toz / Pul Biber)' },
  { value: 'DOGAL_BAGIRSAK', label: 'Doğal Dana Bağırsağı', backendType: 'BİBERLİK' },
  { value: 'KOLAJEN_KILIF', label: 'Kolajen Sucuk Kılıfı', backendType: 'BİBERLİK' },
]

const FACTORY_OPTIONS = [
  'Kardeşler Sucuk Fabrikası',
  'Erzurum Et Entegre Tesisleri',
  'Anadolu Fermente Et Ürünleri A.Ş.',
  'Kars Besi & Et Kombinası',
  'Başkent Şarküteri & Gıda Sanayi',
  'Marmara İleri Et İşleme Tesisi',
  'Diğer'
]

function Production() {
  const [materials, setMaterials] = useState(initialMaterials)
  const [orderNumber, setOrderNumber] = useState('URT-2026-045')
  const [expectedOutput, setExpectedOutput] = useState('85')
  const [eKP, setEKP] = useState(null)
  const [loading, setLoading] = useState(false)
  const [factoryName, setFactoryName] = useState('Kardeşler Sucuk Fabrikası')
  const [laborCost, setLaborCost] = useState('467.50')
  const [newLotNumber, setNewLotNumber] = useState('SUC-2026-045')

  const [aiPrediction, setAiPrediction] = useState({
    predicted_output_qty: 83.0,
    predicted_ekp: 18.50,
    baseline_output_qty: 85.0,
    baseline_ekp: 18.16
  })

  const fetchAIPrediction = async (currentMaterials, currentOutput, currentEkp) => {
    const meatRow = currentMaterials.find(m => (m.material_type || '').includes('ET') || (m.material_type || '').includes('KARKAS'))
    const spiceRow = currentMaterials.find(m => (m.material_type || '').includes('BAHARAT'))
    const casingRow = currentMaterials.find(m => (m.material_type || '').includes('BİBERLİK') || (m.material_type || '').includes('BAGIRSAK'))

    const meatKg = parseFloat(meatRow?.quantity) || 100.0
    const spiceKg = parseFloat(spiceRow?.quantity) || 2.0
    const casingKg = parseFloat(casingRow?.quantity) || 5.0
    const meatPrice = parseFloat(meatRow?.cost_per_unit) || 9.70
    const outQty = parseFloat(currentOutput) || 85.0
    const serviceFee = outQty > 0 ? ((parseFloat(laborCost) || 467.50) / outQty) : 5.50

    try {
      const res = await mlServices.predictProduction({
        meat_kg: meatKg,
        spice_kg: spiceKg,
        casing_kg: casingKg,
        meat_unit_price: meatPrice,
        service_unit_fee: serviceFee,
        actual_output_qty: outQty,
        actual_ekp: currentEkp || 18.16
      })
      if (res.data) {
        setAiPrediction(res.data)
      }
    } catch {
      // ML servisi kapalıysa varsayılan değerler korunur
    }
  }

  useEffect(() => {
    fetchAIPrediction(materials, expectedOutput, eKP)
  }, [])

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials]
    newMaterials[index][field] = value

    const q = parseFloat(newMaterials[index].quantity)
    const c = parseFloat(newMaterials[index].cost_per_unit)
    if (!isNaN(q) && !isNaN(c)) {
      newMaterials[index].total_cost = (q * c).toFixed(2)
    }
    setMaterials([...newMaterials])
  }

  const addMaterialRow = () => {
    setMaterials([
      ...materials,
      { lot_id: String(materials.length + 1), material_type: 'ET', quantity: '', cost_per_unit: '', total_cost: '' }
    ])
  }

  const removeMaterialRow = (index) => {
    if (materials.length === 1) return
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const calculateEKP = async () => {
    const cleanOrderNo = orderNumber.trim()
    if (!cleanOrderNo) {
      toast.error('Lütfen önce Üretim Emri Numarasını giriniz!')
      return
    }

    setLoading(true)
    try {
      const response = await productionServices.getEKP(cleanOrderNo)
      const matTotal = materials.reduce((sum, m) => sum + (parseFloat(m.total_cost) || 0), 0)
      const labor = parseFloat(laborCost) || 0
      const out = parseFloat(expectedOutput) || 85

      const finalEkp = labor > 0 && matTotal > 0
        ? (matTotal + labor) / out
        : Number(response.data.economic_cost_per_unit)

      setEKP(finalEkp)
      await fetchAIPrediction(materials, expectedOutput, finalEkp)
      toast.success(`EKP Başarıyla Hesaplandı: ${finalEkp.toFixed(2)} TL/paket`)
    } catch {
      const matTotal = materials.reduce((sum, m) => sum + (parseFloat(m.total_cost) || 0), 0)
      const labor = parseFloat(laborCost) || 0
      const out = parseFloat(expectedOutput) || 0
      if (out > 0 && matTotal > 0) {
        const localEkp = (matTotal + labor) / out
        setEKP(localEkp)
        await fetchAIPrediction(materials, expectedOutput, localEkp)
        toast.success(`EKP Hesaplandı: ${localEkp.toFixed(2)} TL/paket`)
      } else {
        toast.error('Lütfen malzeme miktarlarını ve beklenen çıktıyı kontrol edin.')
      }
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async () => {
    const cleanOrderNo = orderNumber.trim()
    const parsedExpected = parseFloat(expectedOutput)

    if (!cleanOrderNo || isNaN(parsedExpected) || parsedExpected <= 0) {
      toast.error('Üretim emri numarası ve geçerli bir beklenen miktar zorunludur!')
      return
    }

    const formattedMaterials = materials.map((m, idx) => {
      const foundType = MATERIAL_TYPES.find(t => t.value === m.material_type)
      const safeType = foundType?.backendType || m.material_type || 'ET'
      const qty = parseFloat(m.quantity) || 0
      const cpu = parseFloat(m.cost_per_unit) || 0
      const tCost = parseFloat(m.total_cost) || parseFloat((qty * cpu).toFixed(2))

      return {
        lot_id: parseInt(m.lot_id, 10) || (idx + 1),
        material_type: safeType,
        quantity: qty,
        cost_per_unit: cpu,
        total_cost: tCost
      }
    })

    if (formattedMaterials.some(m => m.quantity <= 0 || m.cost_per_unit <= 0)) {
      toast.error('Lütfen tüm hammadde satırlarında miktar ve birim maliyeti eksiksiz giriniz!')
      return
    }

    setLoading(true)
    try {
      const response = await productionServices.createOrder({
        order_number: cleanOrderNo,
        materials: formattedMaterials,
        expected_output: parsedExpected,
        factory_name: factoryName,
        labor_cost: parseFloat(laborCost) || 0,
        new_lot_number: newLotNumber
      })
      const calcEkp = Number(response.data?.economic_cost_per_unit)
      setEKP(calcEkp)
      await fetchAIPrediction(materials, parsedExpected, calcEkp)
      toast.success('Üretim emri başarıyla oluşturuldu!')
    } catch (error) {
      console.error('Üretim emri oluşturma hatası:', error.response?.data || error)
      toast.error('Sunucu uyarısı: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const rawMaterialSum = materials.reduce((sum, m) => sum + (parseFloat(m.total_cost) || 0), 0)
  const grandTotalCost = rawMaterialSum + (parseFloat(laborCost) || 0)

  return (
    <div className="production">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-icon">
            <Factory size={24} />
          </div>
          <div>
            <h1>Üretim Emri Yönetimi</h1>
            <p>Hammadde çıkışları, fason üretim hizmet girişi ve gerçek EKP maliyet hesaplaması</p>
          </div>
        </div>
      </div>

      <div className="split-grid">
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Yeni Üretim Emri Oluştur</h2>
            </div>

            <div className="form-row">
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
                  placeholder="örn: 85"
                />
              </div>
            </div>

            <div className="section-subtitle">
              <span>Hammadde Çıkış Bölümü</span>
              <button type="button" onClick={addMaterialRow} className="btn btn-sm btn-outline">
                <Plus size={14} /> Satır Ekle
              </button>
            </div>

            {materials.map((material, index) => (
              <div key={index} className="material-row-box">
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Lot ID</label>
                    <input
                      type="number"
                      value={material.lot_id}
                      onChange={(e) => handleMaterialChange(index, 'lot_id', e.target.value)}
                      placeholder="örn: 1"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Malzeme Türü</label>
                    <select
                      value={material.material_type}
                      onChange={(e) => handleMaterialChange(index, 'material_type', e.target.value)}
                    >
                      <option value="">Seçiniz...</option>
                      {MATERIAL_TYPES.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Miktar (kg)</label>
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                      placeholder="örn: 100"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Birim Maliyet (TL)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={material.cost_per_unit}
                      onChange={(e) => handleMaterialChange(index, 'cost_per_unit', e.target.value)}
                      placeholder="örn: 9.70"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Toplam Maliyet (TL)</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="number"
                        value={material.total_cost}
                        onChange={(e) => handleMaterialChange(index, 'total_cost', e.target.value)}
                        placeholder="Otomatik hesaplanır"
                      />
                      {materials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMaterialRow(index)}
                          className="btn btn-sm btn-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="section-subtitle">
              <span>Fason Hizmet ve İşçilik Maliyeti</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Üretici Fabrikası</label>
                <select
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                >
                  {FACTORY_OPTIONS.map((fac) => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>İşçilik Faturası (TL)</label>
                <input
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  placeholder="örn: 467.50"
                />
              </div>
            </div>

            <div className="section-subtitle">
              <span>Mamul Ürün Girişi</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gelen Net Paket/Kg Sayısı</label>
                <input
                  type="number"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="örn: 85"
                />
              </div>

              <div className="form-group">
                <label>Yeni Ürün Lot Numarası</label>
                <input
                  type="text"
                  value={newLotNumber}
                  onChange={(e) => setNewLotNumber(e.target.value)}
                  placeholder="örn: SUC-2026-045"
                />
              </div>
            </div>

            <div className="btn-group">
              <button className="btn btn-primary" onClick={createOrder} disabled={loading}>
                <CheckCircle2 size={16} />
                {loading ? 'Kaydediliyor...' : 'Üretim Emri Oluştur'}
              </button>
              <button className="btn btn-outline" onClick={calculateEKP} disabled={loading}>
                <Calculator size={16} />
                {loading ? 'Hesaplanıyor...' : 'EKP Hesapla'}
              </button>
            </div>
          </div>

          {eKP !== null && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Gerçekleşen vs. Tahmin Özet (Model A)</h2>
              </div>
              <div className="summary-table">
                <table>
                  <thead>
                    <tr>
                      <th>Metriği</th>
                      <th>AI Model A Tahmini</th>
                      <th>Gerçekleşen</th>
                      <th>Sapma</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mamul Miktarı</td>
                      <td>{Number(aiPrediction.predicted_output_qty).toFixed(1)} paket</td>
                      <td>{expectedOutput} paket</td>
                      <td className={parseFloat(expectedOutput) >= aiPrediction.predicted_output_qty ? 'positive' : 'negative'}>
                        {parseFloat(expectedOutput) >= aiPrediction.predicted_output_qty ? '+' : ''}
                        {(parseFloat(expectedOutput) - aiPrediction.predicted_output_qty).toFixed(1)} paket
                      </td>
                    </tr>
                    <tr>
                      <td>EKP</td>
                      <td>{Number(aiPrediction.predicted_ekp).toFixed(2)} TL/paket</td>
                      <td>{Number(eKP).toFixed(2)} TL/paket</td>
                      <td className={parseFloat(eKP) <= aiPrediction.predicted_ekp ? 'positive' : 'negative'}>
                        {parseFloat(eKP) <= aiPrediction.predicted_ekp ? '+' : ''}
                        {(aiPrediction.predicted_ekp - parseFloat(eKP)).toFixed(2)} TL/paket
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card ai-copilot">
            <div className="ai-header">
              <Sparkles className="ai-icon" />
              <div>
                <h3 style={{ margin: 0 }}>🤖 Yapay Zeka Tahmini (Model A)</h3>
                <span style={{ fontSize: '0.76rem', color: '#475467' }}>FastAPI Random Forest (:5000)</span>
              </div>
            </div>
            <p style={{ margin: '0 0 0.5rem 0' }}>Bu girdilerle yapay zeka tahmin ediyor:</p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>Mamul Miktarı: <strong>{Number(aiPrediction.predicted_output_qty).toFixed(1)} paket</strong></li>
              <li>Maliyet (EKP): <strong>{Number(aiPrediction.predicted_ekp).toFixed(2)} TL/paket</strong></li>
            </ul>
          </div>

          {eKP !== null && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">EKP (Gerçek Maliyet) Hesaplama</h2>
              </div>
              <div className="ekp-result">
                <p><strong>Hammadde Maliyeti:</strong> {rawMaterialSum.toFixed(2)} TL</p>
                <p><strong>İşçilik Maliyeti:</strong> {(parseFloat(laborCost) || 0).toFixed(2)} TL</p>
                <p><strong>Toplam Maliyet:</strong> {grandTotalCost.toFixed(2)} TL</p>
                <p><strong>Mamul Miktarı:</strong> {expectedOutput} paket</p>
                <p className="ekp-value"><strong>EKP:</strong> {Number(eKP).toFixed(2)} TL/paket</p>
              </div>

              <div className="material-row-box" style={{ marginBottom: 0 }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>VKP ve Brüt Kâr Hesaplama</h3>
                <p style={{ margin: '0.2rem 0' }}><strong>Satış Fiyatı (örn):</strong> 25.00 TL/paket</p>
                <p style={{ margin: '0.2rem 0' }}><strong>Brüt Kâr:</strong> {((25.00 - Number(eKP)) * parseFloat(expectedOutput || 0)).toFixed(2)} TL</p>
                <p style={{ margin: 0 }}><strong>Kâr Marjı:</strong> {((25.00 - Number(eKP)) / 25.00 * 100).toFixed(1)}%</p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📝 Örnek Senaryo: URT-2026-045</h3>
            </div>
            <p style={{ fontSize: '0.88rem' }}>100 kg et + 2 kg baharat + 5 kg biberlik → 85 paket Narin Sucuk</p>
            <ul style={{ fontSize: '0.86rem', paddingLeft: '1.2rem', margin: 0 }}>
              <li>Et: 100 kg × 9.70 TL = 970.00 TL</li>
              <li>Baharat: 2 kg × 24.00 TL = 48.00 TL</li>
              <li>Biberlik: 5 kg × 11.60 TL = 58.00 TL</li>
              <li>Hizmet Maliyeti: 85 paket × 5.50 TL = 467.50 TL</li>
              <li><strong>TOPLAM:</strong> 1,543.50 TL</li>
              <li><strong>EKP:</strong> 18.16 TL/paket</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Production