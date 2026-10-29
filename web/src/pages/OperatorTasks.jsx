import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Factory, ShieldCheck, ArrowRightLeft, Radio } from 'lucide-react'

// func yerine JavaScript standardı olan function ifadesi getirildi
function OperatorTasks() {
    const [tasks, setTasks] = useState([
        { id: 1, type: 'Sevkiyat', desc: 'Kardeşler Fabrikasına 100 kg Et Sevk İşlemi', status: 'ready' },
        { id: 2, type: 'Kütle Kontrol', desc: 'URT-2026-045 Fason Hizmet Faturası Doğrulaması', status: 'checked' }
    ])

    return (
        <div style={{ padding: '1rem' }}>
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-icon"><Factory size={24} /></div>
                    <div>
                        <h1>Saha Şefliği Proses Takip Merkezi</h1>
                        <p>Hammadde lot çıkışları, fason irsaliye transferleri ve ambar denetim emirleri</p>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title"><Radio size={18} /> Anlık Ambar Görevleri</h2>
                    </div>
                    {tasks.map(t => (
                        <div key={t.id} className="material-row-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span className="badge badge-primary" style={{ marginBottom: '0.3rem' }}>{t.type}</span>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{t.desc}</p>
                            </div>
                            <button className="btn btn-sm btn-outline" onClick={() => toast.success('Görev doğrulandı!')}>
                                <ShieldCheck size={14} /> {t.status === 'checked' ? 'Tamamlandı' : 'Doğrula'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title"><ArrowRightLeft size={18} /> İrsaliye Transfer Kilidi</h2>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#475467' }}>Dış üreticiye gönderilen hammaddelerin (et, baharat, kılıf) ISO 22000 standartlarına göre lot tünel kaydı:</p>
                    <div className="ekp-result" style={{ padding: '1rem' }}>
                        <p>• Transfer Statüsü: <strong>AKTİF (Tünel Açık)</strong></p>
                        <p>• Aktif Güvenlik Kilidi: <strong>Go-Consistency Kontrolü Geçildi</strong></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OperatorTasks
