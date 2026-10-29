import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { User, Lock, ShieldCheck, Save } from 'lucide-react'

function Account() {
    const userString = localStorage.getItem('avatar_user')
    const user = userString ? JSON.parse(userString) : { username: 'admin', fullName: 'Yönetici', role: 'admin' }

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        if (!currentPassword || !newPassword) {
            toast.error('Lütfen tüm şifre alanlarını doldurun!')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('http://localhost:8080/api/auth/update-password', {
                username: user.username,
                current_password: currentPassword,
                new_password: newPassword
            })

            if (response.data && response.data.status === 'success') {
                toast.success('Şifreniz XAMPP MySQL üzerinde başarıyla güncellendi!')
                setCurrentPassword('')
                setNewPassword('')
            }
        } catch (error) {
            console.error('Şifre güncelleme hatası:', error)
            toast.error(error.response?.data?.error || 'Mevcut şifreniz hatalı veya SQL bağlantısı kurulamadı.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="account-page" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1>Hesap Ayarları</h1>
                <p>Profil bilgilerinizi görüntüleyin ve şifrenizi güvenli bir şekilde güncelleyin</p>
            </div>

            {/* Profil Özet Kartı */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                    <User size={18} color="#6938ef" /> Personel Kimlik Bilgileri
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.92rem' }}>
                    <div><span style={{ color: '#475467' }}>Adı Soyadı:</span> <strong>{user.fullName}</strong></div>
                    <div><span style={{ color: '#475467' }}>Kullanıcı Adı:</span> <strong>{user.username}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: '#475467' }}>İşletme Yetki Rolü:</span>{' '}
                        <span className="badge badge-success" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            🤖 {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Şifre Güncelleme Formu */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                    <Lock size={18} color="#6938ef" /> Güvenlik & Şifre Değiştir
                </h3>
                <form onSubmit={handleUpdatePassword}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Mevcut Şifre</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            placeholder="Eski şifrenizi girin"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Yeni Şifre</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            placeholder="Yeni şifrenizi belirleyin"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                        <Save size={16} />
                        {loading ? 'Güncelleniyor...' : 'Şifreyi Kaydet ve Güncelle'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Account
