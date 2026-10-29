import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ClipboardList, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'

function ButcherRequests() {
    const [requests, setRequests] = useState([
        { id: 1, source: 'Üretim Bandı A', item: 'Kuzu Karkas', qty: 25.0, status: 'pending', note: 'Model B %88 verim tahmin ediyor' },
        { id: 2, source: 'Şarküteri İşleme', item: 'Dana Ön Kol', qty: 120.0, status: 'completed', note: 'Tam kemik denkliği sağlandı' }
    ])

    const handleApprove = (id) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'completed' } : r))
        toast.success('Parçalama isteği onaylandı ve kesimhaneye gönderildi!')
    }

    return (
        <div style={{ padding: '1rem' }}>
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-icon"><ClipboardList size={24} /></div>
                    <div>
                        <h1>Kesimhane & Parçalama İstekleri</h1>
                        <p>Üretim şeflerinden gelen karkas et işleme emirleri ve kütle onay havuzu</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h2 className="card-title">Aktif Bekleyen Emirler</h2></div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>İstek Kaynağı</th><th>Talep Edilen Hammadde</th><th>Ağırlık (kg)</th><th>AI Bildirimi / Not</th><th>Durum</th><th>Aksiyon</th></tr>
                        </thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id}>
                                    <td><strong>{r.source}</strong></td>
                                    <td>{r.item}</td>
                                    <td className="mono">{r.qty} kg</td>
                                    <td><span style={{ fontSize: '0.85rem', color: '#6938ef' }}>{r.note}</span></td>
                                    <td>
                                        <span className={`badge ${r.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                            {r.status === 'completed' ? 'İşlendi' : 'Onay Bekliyor'}
                                        </span>
                                    </td>
                                    <td>
                                        {r.status === 'pending' ? (
                                            <button onClick={() => handleApprove(r.id)} className="btn btn-sm btn-success"><CheckCircle2 size={14} /> Onayla ve Kesimi Başlat</button>
                                        ) : (
                                            <span className="text-success">✓ Depoya Alındı</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ButcherRequests
