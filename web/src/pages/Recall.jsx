import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search, Phone, ShieldAlert, GitBranch, Factory, Package, Store, AlertOctagon } from 'lucide-react'
import { traceServices } from '../services/api'

function Recall() {
  const [lotNumber, setLotNumber] = useState('ET-2026-001')
  const [productionOrder, setProductionOrder] = useState('URT-2026-045')
  const [finishedProduct, setFinishedProduct] = useState('SUC-2026-045')
  const [loading, setLoading] = useState(false)
  const [recalledLots, setRecalledLots] = useState([])
  const [affectedMarkets, setAffectedMarkets] = useState([])
  const [contactInfo, setContactInfo] = useState([])

  const searchLot = async () => {
    if (!lotNumber.trim()) {
      toast.error('Lütfen sorgulanacak Lot numarasını giriniz!')
      return
    }

    setLoading(true)
    try {
      const response = await traceServices.searchRecallLot(lotNumber.trim())

      setRecalledLots(response.data.affectedLots || [])
      setAffectedMarkets(response.data.affectedMarkets || [])
      setContactInfo(response.data.contactInfo || [])
      if (response.data.productionOrder) setProductionOrder(response.data.productionOrder)
      if (response.data.finishedProduct) setFinishedProduct(response.data.finishedProduct)
      toast.success(`${lotNumber} için Soy Ağacı ve Market Dağılımı yüklendi!`)
    } catch (error) {
      console.error('Lot arama hatası:', error)
      toast.error('Lot sorgulanamadı: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRecall = async () => {
    if (recalledLots.length === 0) {
      toast.error('Önce "Sorgula" butonuna basarak etkilenen lotları listeleyin!')
      return
    }

    const confirmRecall = window.confirm(
      `Geri çağırma onayı:\n\n` +
      `Etkilenen Lotlar (${recalledLots.length} adet):\n` +
      `${recalledLots.map(l => `- ${l.lot_number}`).join('\n')}\n\n` +
      `Bu işlemi onaylıyor musunuz?`
    )

    if (!confirmRecall) return

    setLoading(true)
    try {
      await traceServices.executeRecall({
        lot_numbers: recalledLots.map(l => l.lot_number),
        production_order: productionOrder,
        finished_product: finishedProduct
      })

      toast.error('🚨 Geri çağırma ve blokaj işlemi başarıyla tamamlandı!')
    } catch (error) {
      console.error('Geri çağırma hatası:', error)
      toast.error('Hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const genealogyTree = useMemo(() => {
    if (recalledLots.length === 0) return null

    return recalledLots.map(lot => ({
      lot: lot.lot_number,
      productionOrder: lot.production_order || productionOrder || 'URT-2026-045',
      finishedProduct: lot.finished_product || finishedProduct || 'SUC-2026-045',
      markets: affectedMarkets.filter(m => m.lot_id === lot.id),
      contactInfo: contactInfo.filter(c => c.lot_id === lot.id)
    }))
  }, [recalledLots, productionOrder, finishedProduct, affectedMarkets, contactInfo])

  return (
    <div className="recall-page">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-icon danger">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1>Geri Çağırma ve Bloke Et Merkezi</h1>
            <p>Sorunlu hammaddeden üretim emrine, mamul lotuna ve market raflarına uzanan hiyerarşik soy ağacı</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Search size={20} />
            Lot Numarası Sorgulama
          </h2>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ gridColumn: 'span 3', marginBottom: 0 }}>
            <label>Sorgulanacak Lot Numarasını Giriniz (Örn: ET-2026-001)</label>
            <input
              type="text"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              placeholder="Lot numarasını giriniz..."
              className="form-control"
            />
          </div>
          <button onClick={searchLot} disabled={loading} className="btn btn-primary">
            <Search size={16} />
            {loading ? 'Aranıyor...' : 'Sorgula'}
          </button>
        </div>
      </div>

      {genealogyTree && genealogyTree.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <GitBranch size={20} />
              Soy Ağacı (Genealogy — Hammadde → Üretim Emri → Mamul Lot → Müşteri Dağılımı)
            </h2>
          </div>

          <div className="genealogy-tree-wrapper">
            {genealogyTree.map((node, index) => (
              <div key={index} style={{ marginBottom: '1.25rem' }}>
                <div className="tree-root-card">
                  <span className="badge badge-danger" style={{ marginBottom: '0.3rem' }}>
                    KÖK KAYNAK — Sorunlu Hammadde Lotu
                  </span>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>
                    <AlertOctagon size={18} style={{ verticalAlign: 'text-bottom', marginRight: '0.4rem' }} />
                    {node.lot}
                  </h3>
                </div>

                <div className="tree-level">
                  <div className="tree-node-card">
                    <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>
                      1. Kademe — Üretim Emri
                    </span>
                    <h4 style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>
                      <Factory size={16} style={{ verticalAlign: 'text-bottom', marginRight: '0.4rem' }} />
                      {node.productionOrder}
                    </h4>
                  </div>

                  <div className="tree-level">
                    <div className="tree-node-card finished-node">
                      <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
                        2. Kademe — Üretilen Mamul Lotu
                      </span>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-mono)' }}>
                        <Package size={16} style={{ verticalAlign: 'text-bottom', marginRight: '0.4rem' }} />
                        {node.finishedProduct}
                      </h4>

                      <div className="tree-leaf-grid">
                        {node.markets.map((market, mIndex) => (
                          <div key={mIndex} className="tree-leaf-item">
                            <strong>
                              <Store size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                              {market.market_name}:
                            </strong>{' '}
                            <span className="mono">{market.quantity} paket</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ color: '#b42318' }}>
            <ShieldAlert size={20} color="#d92d20" />
            Geri Çağırma ve Bloke Et
          </h2>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Üretim Emri Numarası</label>
            <input
              type="text"
              value={productionOrder}
              onChange={(e) => setProductionOrder(e.target.value)}
              placeholder="örn: URT-2026-045"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Mamul Lot Numarası</label>
            <input
              type="text"
              value={finishedProduct}
              onChange={(e) => setFinishedProduct(e.target.value)}
              placeholder="örn: SUC-2026-045"
              className="form-control"
            />
          </div>
        </div>

        <button
          onClick={handleRecall}
          disabled={recalledLots.length === 0 || loading}
          className="btn btn-danger"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
        >
          {loading ? 'İşlem Yapılıyor...' : (
            <>
              <ShieldAlert size={20} />
              Geri Çağırma ve Bloke Et
            </>
          )}
        </button>

        {contactInfo.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>📞 Acil Çağrı Listesi</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Yetkili İsim</th>
                    <th>Telefon Numarası</th>
                    <th>Etkilenen Miktar</th>
                  </tr>
                </thead>
                <tbody>
                  {contactInfo.map((contact, index) => (
                    <tr key={index}>
                      <td>{contact.market_name}</td>
                      <td>{contact.authority_name}</td>
                      <td><Phone size={14} /> {contact.phone_number}</td>
                      <td>{contact.quantity} paket</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {recalledLots.length > 0 && (
          <div className="alert alert-low" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <div>
              <strong>İşlem Özeti:</strong> Etkilenen lotlar bulundu: {recalledLots.length} | Mamul lot: {finishedProduct || 'Belirtilmedi'} | Üretim emri: {productionOrder || 'Belirtilmedi'} | Etkilenen marketler: {affectedMarkets.length}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>ℹ️ Geri Çağırma İşlemi</h3>
        <p>Bu işlem, bakanlıktan gelen bir alarm durumunda sorunlu hammaddenin sahadaki satışını durdurmak için kullanılır.</p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>Etkilenen lotlar veritabanında RECALLED statüsüyle işaretlenir</li>
          <li>Etkilenen marketlerin iletişim bilgileri sistemde kaydedilir</li>
          <li>Mobil tarafa blocking bayrağı aktif edilir</li>
        </ul>
      </div>

      <div className="navigation">
        <button onClick={() => window.history.back()} className="btn btn-secondary">
          ← Geri
        </button>
        <Link to="/lot-trace" className="btn btn-secondary">
          Lot İzlenebilirlik
        </Link>
      </div>
    </div>
  )
}

export default Recall