import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' 
import toast from 'react-hot-toast'
import axios from 'axios'
import { ShieldCheck, Lock, User, Sparkles } from 'lucide-react'

function Login() {
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('admin123')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!username.trim() || !password.trim()) {
            toast.error('Lütfen tüm alanları eksiksiz doldurun!')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username.trim(),
                password: password
            })

            if (response.data && response.data.status === 'success') {
                // Kullanıcı oturum bilgilerini yerel hafızaya güvenle yaz
                localStorage.setItem('avatar_user', JSON.stringify(response.data.user))
                localStorage.setItem('avatar_token', response.data.token)

                toast.success(`Hoş geldiniz, ${response.data.user.fullName}!`, { icon: '🤖' })

                // Giriş başarılı olunca kullanıcıyı doğrudan ana yönetim paneline yönlendir
                navigate('/')
            }
        } catch (error) {
            console.error('Giriş hatası:', error)
            toast.error(error.response?.data?.error || 'Giriş başarısız, bilgileri kontrol edin.')
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
                width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0'
            }}>

                {/* Logo ve Başlık */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex', background: '#6938ef', color: '#ffffff',
                        padding: '0.75rem', borderRadius: '12px', marginBottom: '0.75rem'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h1 style={{ fontSize: '1.6rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 800 }}>
                        AVATAR ERP & AI
                    </h1>
                    <p style={{ fontSize: '0.86rem', color: '#475467', margin: 0 }}>
                        Gıda Üretim, EKP ve İzlenebilirlik Denetim Portalı
                    </p>
                </div>

                {/* Giriş Formu */}
                <form onSubmit={handleLogin}>
                   
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#344054', marginBottom: '0.4rem' }}>
                            Kullanıcı Adı
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
                                    width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', border: '1px solid #d0d5dd',
                                    borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box'
                                }}
                                placeholder="Kullanıcı adınızı girin"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#344054', marginBottom: '0.4rem' }}>
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
                                    width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', border: '1px solid #d0d5dd',
                                    borderRadius: '8px', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.75rem', background: '#6938ef', color: '#ffffff',
                            border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                            transition: 'background 0.2s', opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Sparkles size={16} />
                        {loading ? 'Doğrulanıyor...' : 'Sisteme Giriş Yap'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem' }}>
                        <span style={{ color: '#475467' }}>Hesabın yok mu? </span>
                        <Link to="/register" style={{ color: '#6938ef', fontWeight: 600, textDecoration: 'none' }}>
                            Hemen Oluştur
                        </Link>
                    </div>

                </form>
                            
                {/* Bilgilendirme Notu */}
                <div style={{
                    marginTop: '1.5rem', background: '#f8fafc', padding: '0.75rem',
                    borderRadius: '8px', fontSize: '0.76rem', color: '#475467', border: '1px solid #e2e8f0'
                }}>
                    <center>
                        
                         <b>  Bu Kısım test amacıyla projenin hızlı test edilebilmesi için varsayılan olarak <code>admin</code> / <code>admin123</code> bilgileri tanımlanmıştır. Bilgiler doğrudan XAMPP veritabanından sorgulanmaktadır.
                        </b>
                    </center>
                   
                </div>

            </div>
        </div>
    )
}

export default Login
