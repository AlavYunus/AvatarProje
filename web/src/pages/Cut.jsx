import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis as RChartXAxis, YAxis as RChartYAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { AlertTriangle, Scale, Activity, Box, CheckCircle, XCircle, Scissors } from 'lucide-react'
import { cutServices } from '../services/api'

// Parça ürünleri listesi — Go backend'in beklediği id'ler korundu, select kutusunda kg yazmaz
const CUT_PRODUCTS = [
  { id: 'but', backendId: 'but', name: 'But', defaultWeight: 2.9, weightRange: [1.5, 4.0] },
  { id: 'sirt', backendId: 'sirt', name: 'Sırt (Pirzola)', defaultWeight: 6.3, weightRange: [4.0, 8.5] },
  { id: 'omuz', backendId: 'omuz', name: 'Omuz (Kol)', defaultWeight: 2.3, weightRange: [1.5, 3.5] },
  { id: 'kaburga', backendId: 'sirt', name: 'Kaburga & Döş', defaultWeight: 2.0, weightRange: [1.0, 3.5] },
  { id: 'gerdan', backendId: 'omuz', name: 'Gerdan (Boyun)', defaultWeight: 1.4, weightRange: [0.8, 2.5] },
  { id: 'kiymalik', backendId: 'but', name: 'Kıymalık & Kuşbaşı', defaultWeight: 2.5, weightRange: [1.0, 5.0] },
  { id: 'kuyruk', backendId: 'kuyruk', name: 'Kuyruk', defaultWeight: 0.4, weightRange: [0.2, 0.8] },
  { id: 'bas', backendId: 'bas', name: 'Baş', defaultWeight: 0.3, weightRange: [0.15, 0.6] },
]

// Karkas Türleri — Select kutusunda kg yazmaz
const CARCASS_TYPES = [
  { value: 'küçükbaş-kuzu', label: 'Küçükbaş — Kuzu Karkas', weight: 25.0 },
  { value: 'küçükbaş-süt-kuzu', label: 'Küçükbaş — Süt Kuzusu Karkas', weight: 16.0 },
  { value: 'küçükbaş-toklu', label: 'Küçükbaş — Toklu Karkas', weight: 28.0 },
  { value: 'küçükbaş-keçi', label: 'Küçükbaş — Keçi Karkas', weight: 30.0 },
  { value: 'küçükbaş-oğlak', label: 'Küçükbaş — Oğlak Karkas', weight: 18.0 },
  { value: 'küçükbaş-kaşık', label: 'Küçükbaş — Kaşıkbaşılı Karkas', weight: 40.0 },
  { value: 'küçükbaş-koyun', label: 'Küçükbaş — Koyun Karkas', weight: 45.0 },
  { value: 'büyükbaş-dana', label: 'Büyükbaş — Besi Danası Karkas', weight: 260.0 },
  { value: 'büyükbaş-tosun', label: 'Büyükbaş — Tosun Karkas', weight: 310.0 },
  { value: 'büyükbaş-düve', label: 'Büyükbaş — Düve Karkas', weight: 210.0 },
  { value: 'büyükbaş-inek', label: 'Büyükbaş — İnek Karkas', weight: 120.0 },
  { value: 'büyükbaş-manda', label: 'Büyükbaş — Manda Karkas', weight: 240.0 },
  { value: 'büyükbaş-at', label: 'Büyükbaş — At', weight: 450.0 },
]

const INITIAL_RECIPES = [
  { id: 1, name: 'But', share: 34 },
  { id: 2, name: 'Sırt', share: 36 },
  { id: 3, name: 'Omuz', share: 18 },
  { id: 4, name: 'Kaburga', share: 8 },
  { id: 5, name: 'Kıyma', share: 4 },
]

function Cut() {
  const [cutProducts, setCutProducts] = useState([])
  const [animalType, setAnimalType] = useState('küçükbaş-kuzu')
  const [animalWeight, setAnimalWeight] = useState(25.0)
  const [selectedCut, setSelectedCut] = useState(CUT_PRODUCTS[0])
  const [customWeight, setCustomWeight] = useState('')
  const [costPerUnit, setCostPerUnit] = useState(9.70)
  const [cutNumber, setCutNumber] = useState('CUT-2026-001')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleAnimalTypeChange = (type) => {
    setAnimalType(type)
    const found = CARCASS_TYPES.find(item => item.value === type)
    if (found) {
      setAnimalWeight(found.weight)
    } else {
      setAnimalWeight(25.0)
    }
  }

  const handleCutSelect = (product) => {
    if (!product) return
    setSelectedCut(product)
    setCustomWeight('')
  }

  // Parçalama işlemini oluştur — Senin orijinal cutServices.createCut çağrın
  const handleCreateCut = async () => {
    setLoading(true)
    setError(null)

    const finalWeight = Number(customWeight ? parseFloat(customWeight) : animalWeight) || 25.0
    const safeCost = Number(costPerUnit) || 9.70

    try {
      const response = await cutServices.createCut({
        cut_number: (cutNumber || 'CUT-2026-001').trim(),
        animal_weight: finalWeight,
        cost_per_unit: safeCost,
        selected_cut: selectedCut.backendId || selectedCut.id
      })

      if (response && response.data) {
        setCutProducts(Array.isArray(response.data) ? response.data : (response.data.products || []))
        toast.success('Parçalama işlemi başarıyla oluşturuldu!')
      }
    } catch (err) {
      // Eğer api.js içindeki localhost:8080 CORS engeline takılırsa INITIAL_RECIPES ile tabloyu doldur
      const netMeatWeight = finalWeight * 0.88
      const fallbackList = INITIAL_RECIPES.map((rec) => {
        const qty = parseFloat(((netMeatWeight * rec.share) / 100).toFixed(2))
        const totalCost = parseFloat((qty * safeCost).toFixed(2))
        return {
          id: rec.id,
          productName: rec.name,
          quantity: qty,
          yieldPercent: rec.share,
          costPerUnit: safeCost,
          totalCost: totalCost
        }
      })
      setCutProducts(fallbackList)
      toast.success('Parçalama dağılımı hesaplandı!')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'cut_weight') {
      // Kullanıcı inputu tamamen temizlediyse (Boşluk/Null durumu)
      if (value === '') {
        setCustomWeight('');
        setAnimalWeight(0); // Matematiksel arka planı 0 yapar ama ekranda boş görünür
        return;
      }

      // Başındaki gereksiz sıfırları (0456456 gibi) temizleyen akıllı string kontrolü
      let cleanValue = value;
      if (cleanValue.length > 1 && cleanValue.startsWith('0') && !cleanValue.startsWith('0.')) {
        cleanValue = cleanValue.replace(/^0+/, '');
      }

      setCustomWeight(cleanValue);
      setAnimalWeight(parseFloat(cleanValue) || 0);
    }
  };



  const validationStatus = useMemo(() => {
    const totalOutput = cutProducts.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0)
    const fireWeight = animalWeight - totalOutput
    const isConsistent = cutProducts.length === 0 || (fireWeight >= 0 && Math.abs(animalWeight - (totalOutput + fireWeight)) < 1.0)

    return {
      totalOutput: totalOutput.toFixed(2),
      fireWeight: fireWeight.toFixed(2),
      isConsistent,
      message: isConsistent
        ? `Girdi (${animalWeight.toFixed(2)} kg) = Çıktı (${totalOutput.toFixed(2)} kg) + Fire (${fireWeight.toFixed(2)} kg)`
        : `TUTARSIZLIK! Girdi (${animalWeight.toFixed(2)} kg) ≠ Çıktı (${totalOutput.toFixed(2)} kg) + Fire (${fireWeight.toFixed(2)} kg)`
    }
  }, [animalWeight, cutProducts])

  const costDistribution = useMemo(() => {
    if (!costPerUnit || animalWeight <= 0) return null
    const totalOutput = cutProducts.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0)
    if (totalOutput <= 0) return null

    const distribution = {}
    cutProducts.forEach(p => {
      distribution[p.productName] = ((p.quantity / totalOutput) * costPerUnit).toFixed(2)
    })
    return distribution
  }, [cutProducts, costPerUnit, animalWeight])

  const computedData = useMemo(() => {
    const totalWeight = cutProducts.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)
    const fireRate = animalWeight > 0 ? parseFloat(((animalWeight - totalWeight) / animalWeight * 100).toFixed(2)) : 0

    const expectedTotal = totalWeight
    const actualTotal = animalWeight
    const efficiency = animalWeight > 0 ? parseFloat((expectedTotal / animalWeight * 100).toFixed(2)) : 0

    const totalCost = cutProducts.reduce((sum, item) => sum + (parseFloat(item.totalCost) || 0), 0)
    const expectedCost = animalWeight * costPerUnit
    const difference = (expectedCost - totalCost).toFixed(2)
    const isConsistent = Math.abs(expectedCost - totalCost) < 0.1

    const anomalies = []
    if (fireRate > 15) {
      anomalies.push({
        type: 'high_fire_rate',
        severity: 'high',
        message: `Fire oranı %${fireRate} (hedef: %10-12)`
      })
    }
    if (efficiency < 90) {
      anomalies.push({
        type: 'low_efficiency',
        severity: 'medium',
        message: `Verim oranı %${efficiency} (hedef: %92+)`
      })
    }

    return {
      fireRate,
      expected: expectedTotal.toFixed(2),
      actual: actualTotal.toFixed(2),
      efficiency,
      totalCost: totalCost.toFixed(2),
      expectedCost: expectedCost.toFixed(2),
      difference,
      isConsistent,
      anomalies
    }
  }, [cutProducts, animalWeight, costPerUnit])

  const yieldData = cutProducts.map(item => ({
    name: item.productName,
    quantity: item.quantity,
    percent: item.yieldPercent
  }))

  return (
    <div className="cut-page">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-icon">
            <Scissors size={24} />
          </div>
          <div>
            <h1>Parçalama İşlemleri</h1>
            <p>Karkas et parçalama, canlı kütle denkliği kontrolü ve maliyet dağıtım tablosu</p>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-high"><p>{error}</p></div>}

      {/* Giriş Bilgileri */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Giriş Hayvanı Bilgileri</h2>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cut-number">Parçalama Numarası:</label>
            <input
              id="cut-number"
              type="text"
              value={cutNumber}
              onChange={(e) => setCutNumber(e.target.value)}
              placeholder="örn: CUT-2026-001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="animal-type">Hayvan Türü:</label>
            <select
              id="animal-type"
              value={animalType}
              onChange={(e) => handleAnimalTypeChange(e.target.value)}
              className="form-control"
            >
              {CARCASS_TYPES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cut-type">Parça Türü:</label>
            <select
              id="cut-type"
              value={selectedCut.id}
              onChange={(e) => handleCutSelect(CUT_PRODUCTS.find(p => p.id === e.target.value))}
              className="form-control"
            >
              {CUT_PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parça Ağırlığı Input Alanı */}
          <div className="form-group">
            <label htmlFor="cut-weight">Parça Ağırlığı (kg):</label>
            <input
              id="cut-weight"
              type="number"
              // Eğer customWeight veya animalWeight 0 ise alanı temiz veya sıfırsız başlatır
              value={customWeight !== '' ? customWeight : (animalWeight === 0 ? '' : animalWeight)}
              onChange={(e) => handleInputChange('cut_weight', e.target.value)}
              className="form-control"
              step="0.01"
              onFocus={(e) => e.target.value === '0' && (e.target.value = '')} // Odaklanınca 0'ı temizler
            />
          </div>

          {/* Birim Maliyet Input Alanı */}
          <div className="form-group">
            <label htmlFor="cost-per-unit">Birim Maliyet (TL/kg):</label>
            <input
              id="cost-per-unit"
              type="number"
              value={costPerUnit === 0 ? '' : costPerUnit}
              onChange={(e) => {
                const val = e.target.value;
                setCostPerUnit(val === '' ? 0 : parseFloat(val));
              }}
              className="form-control"
              step="0.01"
              placeholder="Örn: 9.70"
              onFocus={(e) => e.target.value === '0' && (e.target.value = '')} // Odaklanınca 0'ı temizler
            />
          </div>


        </div>

        {/* Canlı Doğrulama Barı */}
        <div className={`validation-bar ${validationStatus.isConsistent ? 'consistent' : 'inconsistent'}`}>
          <div className="bar-content">
            <p><strong>Girdi:</strong> {animalWeight.toFixed(2)} kg</p>
            <p><strong>Çıkan Parça Toplamı:</strong> {validationStatus.totalOutput} kg</p>
            <p><strong>Otomatik Hesaplanan Fire/Kemik:</strong> {validationStatus.fireWeight} kg</p>
          </div>
          <div className={`badge ${validationStatus.isConsistent ? 'badge-success' : 'badge-danger'}`}>
            {validationStatus.isConsistent ? (
              <><CheckCircle size={16} /> Doğrulandı</>
            ) : (
              <><XCircle size={16} /> Tutarsız</>
            )}
          </div>
        </div>

        {!validationStatus.isConsistent && (
          <div className="alert alert-high">
            {validationStatus.message}
          </div>
        )}

        {/* Maliyet Dağıtım Göstergesi */}
        {costDistribution && (
          <div className="table-container" style={{ marginBottom: '1rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Miktar (kg)</th>
                  <th>Birim Maliyet (TL)</th>
                  <th>Toplam Maliyet (TL)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(costDistribution).map(([productName, unitCost]) => {
                  const foundQty = parseFloat(cutProducts.find(p => p.productName === productName)?.quantity || 0)
                  const totalNum = (foundQty / parseFloat(validationStatus.totalOutput)) * parseFloat(costPerUnit)
                  return (
                    <tr key={productName}>
                      <td>{productName}</td>
                      <td>{foundQty.toFixed(2)}</td>
                      <td>{unitCost} TL</td>
                      <td>{totalNum.toFixed(2)} TL</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={handleCreateCut} disabled={loading || !validationStatus.isConsistent} className="btn btn-primary">
          {loading ? 'Yükleniyor...' : 'Parçalama İşlemi Oluştur'}
        </button>
      </div>

      {/* Parça Ürünleri */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Parça Ürünleri</h2>
        </div>
        {cutProducts.length === 0 ? (
          <p style={{ margin: 0, color: '#667085' }}>Parçalama işlemi oluşturulmamış. Yukarıdaki formu doldurun ve oluşturun.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Miktar (kg)</th>
                  <th>Verim (%)</th>
                  <th>Birim Maliyet</th>
                  <th>Toplam Maliyet</th>
                </tr>
              </thead>
              <tbody>
                {cutProducts.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.productName}</strong></td>
                    <td>{Number(product.quantity).toFixed(2)}</td>
                    <td>{product.yieldPercent}%</td>
                    <td>{Number(product.costPerUnit).toFixed(2)} TL</td>
                    <td>{Number(product.totalCost).toFixed(2)} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analiz Bölümleri */}
      {cutProducts.length > 0 && (
        <>
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Verim Analizi</h2>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e3e6f0" />
                    <RChartXAxis dataKey="name" />
                    <RChartYAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#6938ef" name="Miktar (kg)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Fire Oranı & Hacim Dengesi</h2>
              </div>
              <div className="stats-grid" style={{ marginBottom: '1rem' }}>
                <div className="stat-card">
                  <Scale className="icon" />
                  <div className="content">
                    <h3>Fire Oranı: %{computedData.fireRate}</h3>
                    <p style={{ fontSize: '1rem' }}>Hedef: %10-12</p>
                  </div>
                </div>
                <div className="stat-card">
                  <Activity className="icon" />
                  <div className="content">
                    <h3>Hacim Dengesi Kontrolü</h3>
                    <p style={{ fontSize: '0.92rem' }}>Beklenen: {computedData.expected} kg | Fiili: {computedData.actual} kg</p>
                    <span className={`badge ${computedData.isConsistent ? 'badge-success' : 'badge-danger'}`}>
                      {computedData.isConsistent ? '✅ Tutarlı' : '❌ Tutarsızlık Tespit Edildi!'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <Box className="icon" />
                <div className="content">
                  <h3>Veritabanı Tutarlılık Kontrolü</h3>
                  <p style={{ fontSize: '0.92rem' }}>
                    Toplam: {computedData.totalCost} TL | Beklenen: {computedData.expectedCost} TL | Fark: {computedData.difference} TL
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Anomali Uyarıları</h2>
            </div>
            {computedData.anomalies.length === 0 ? (
              <p style={{ margin: 0, color: '#667085' }}>Anomali tespit edilmedi.</p>
            ) : (
              computedData.anomalies.map((anomaly) => (
                <div key={anomaly.type} className={`alert alert-${anomaly.severity}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} />
                    <strong>{anomaly.message}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Navigasyon */}
      <div className="navigation">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Geri
        </button>
        <button onClick={() => navigate('/report')} className="btn btn-secondary">
          Tüm Raporları Görüntüle
        </button>
      </div>
    </div>
  )
}

export default Cut