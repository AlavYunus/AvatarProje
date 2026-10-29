import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Anomali uyarıları için state
const anomalyData = [
  { id: 1, type: "cost_increase", severity: "high", message: "Baharat maliyetinde %15 artış tespit edildi", date: "26 Ekim 2026" },
  { id: 2, type: "efficiency", severity: "medium", message: "Üretim verimi %92 (hedef: %95)", date: "26 Ekim 2026" },
]

function AnomalyAlert() {
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(true)

  // Backend'den anomali verilerini al
  useEffect(() => {
    fetchAnomalies()
  }, [])

  // Anomali verilerini çekme
  const fetchAnomalies = async () => {
    try {
      const response = await axios.get('/api/anomalies')
      setAnomalies(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Anomali çekme hatası:', error)
      setLoading(false)
    }
  }

  // Anomali türleri
  const anomalyTypes = [
    { type: "cost_increase", label: "Maliyet Artışı" },
    { type: "efficiency", label: "Verimsizlik" },
    { type: "quality", label: "Kalite Sorunu" },
    { type: "inventory", label: "Stok Anomalisi" },
  ]

  // Anomali sınıfları
  const severityColors = {
    high: "#dc3545",
    medium: "#ffc107",
    low: "#28a745",
  }

  return (
    <div className="anomaly-alert">
      <h2>⚠️ Anomali Uyarıları</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : anomalies.length > 0 ? (
        <div className="anomaly-list">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className={`anomaly-item ${anomaly.severity}`}>
              <div className="anomaly-icon" style={{ backgroundColor: severityColors[anomaly.severity] }}>
                <span>⚠️</span>
              </div>
              <div className="anomaly-content">
                <h3>{anomaly.type.toUpperCase()}</h3>
                <p>{anomaly.message}</p>
                <span className="anomaly-date">{anomaly.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-anomalies">Aktif anomali uyarısı bulunmamaktadır.</p>
      )}

      {/* Anomali türleri */}
      <div className="anomaly-types">
        {anomalyTypes.map((type) => (
          <span key={type.type} className={`badge badge-${type.severity || 'low'}`}>
            {type.label}
          </span>
        ))}
      </div>

      {/* Anomali detayları */}
      <div className="anomaly-details">
        <h3>Anomali Detaylarını İncele</h3>
        <button className="btn btn-primary" onClick={fetchAnomalies}>
          Güncelleme Yap
        </button>
      </div>
    </div>
  )
}

export default AnomalyAlert
