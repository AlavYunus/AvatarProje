import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { UserPlus, Lock, User, Briefcase, FileText } from 'lucide-react'

function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('operator') // Varsayılan: Saha Operatörü
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        if (!username.trim() || !password.trim() || !fullName.trim() || !role) {
            toast.error('Lütfen tüm alanları eksiksiz doldurunuz!')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username: username.trim(),
                password: password,
                full_name: fullName.trim(),
                role: role
            })

            if (response.data && response.data.status === 'success') {
                toast.success('İşletme hesabı başarıyla oluşturuldu! Giriş yapabilirsiniz.', { icon: '🎉' })
                navigate('/login')
            }
        } catch (error) {
            console.error('Kayıt hatası:', error)
            toast.error(error.response?.data?.error || 'Kayıt işlemi başarısız oldu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            fontFamily: 'sans-serif', padding: '1rem'
        }}>
            <div style={{
                background: '#ffffff', padding: '2.5rem', borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                width: '100%', maxWidth: '440px', border: '1px solid #e2e8f0'
            }}>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'inline-flex', background: '#6938ef', color: '#ffffff',
                        padding: '0.75rem', borderRadius: '12px', marginBottom: '0.75rem'
                    }}>
                        <UserPlus size={28} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 800 }}>
                        İşletme Hesabı Oluştur
                    </h1>
                    <p style={{ fontSize: '0.84rem', color: '#475467', margin: 0 }}>
                        AVATAR ERP bünyesine yeni bir personel veya birim kaydedin
                    </p>
                </div>

                <form onSubmit={handleRegister}>
                    {/* Ad Soyad */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#344054', marginBottom: '0.3rem' }}>
                            Personel Adı Soyadı
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }}>
                                <FileText size={16} />
                            </span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', border: '1px solid #d0d5dd',
                                    borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
                                }}
                                placeholder="Örn: Ahmet Kasapbaşı"
                            />
                        </div>
                    </div>

                    {/* Kullanıcı Adı */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#344054', marginBottom: '0.3rem' }}>
                            Kullanıcı Adı (Sisteme Giriş İçin)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }}>
                                <User size={16} />
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', border: '1px solid #d0d5dd',
                                    borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
                                }}
                                placeholder="Kullanıcı adı belirleyin"
                            />
                        </div>
                    </div>

                    {/* Şifre */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#344054', marginBottom: '0.3rem' }}>
                            Şifre
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }}>
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', border: '1px solid #d0d5dd',
                                    borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* İşletme Kullanıcı Türü (Rolü) */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#344054', marginBottom: '0.3rem' }}>
                            İşletme Birimi / Kullanıcı Türü
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }}>
                                <Briefcase size={16} />
                            </span>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', border: '1px solid #d0d5dd',
                                    borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                                    background: '#ffffff', appearance: 'none'
                                }}
                            >
                                <option value="kasap">Kasap (Butcher)</option>
                                <option value="operator">Saha Operatörü (Operator)</option>
                                <option value="market">Zincir Market Alıcısı (Market)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.75rem', background: '#6938ef', color: '#ffffff',
                            border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Hesap Oluşturuluyor...' : 'Kaydı Tamamla'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#475467' }}>Zaten bir hesabınız var mı? </span>
                    <Link to="/login" style={{ color: '#6938ef', fontWeight: 600, textDecoration: 'none' }}>
                        Giriş Yapın
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Register
