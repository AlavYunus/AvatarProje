import axios from 'axios'

export const GO_API_BASE = 'http://localhost:8080/api'
export const ML_API_BASE = 'http://localhost:5000/api/ml'

export const apiClient = axios.create({
  baseURL: GO_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const mlClient = axios.create({
  baseURL: ML_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Parçalama (Cut) Servisleri
export const cutServices = {
  getCutProducts: async () => {
    return await apiClient.get('/cut/products')
  },
  createCut: async (data) => {
    const payload = {
      cut_number: String(data.cut_number || 'CUT-2026-001').trim(),
      animal_weight: Number(data.animal_weight) || 25.0,
      cost_per_unit: Number(data.cost_per_unit) || 9.70,
      selected_cut: data.selected_cut || 'but',
    }
    return await apiClient.post('/cut/products', payload)
  },
  getCutByNumber: async (cutNumber) => {
    return await apiClient.get(`/cut/product/${encodeURIComponent(cutNumber)}`)
  },
}

// Üretim (Production) Servisleri
export const productionServices = {
  getOrders: async () => {
    return await apiClient.get('/production/orders')
  },
  createOrder: async (data) => {
    return await apiClient.post('/production/orders', data)
  },
  getEKP: async (orderNumber) => {
    return await apiClient.get(`/production/eKP/${encodeURIComponent(orderNumber)}`)
  },
}

// Satış (Sale) Servisleri
export const saleServices = {
  getSales: async () => {
    return await apiClient.get('/sales')
  },
  createSale: async (data) => {
    return await apiClient.post('/sales', data)
  },
}

// İade (Return) Servisleri
export const returnServices = {
  getReturns: async () => {
    return await apiClient.get('/returns')
  },
  createReturn: async (data) => {
    return await apiClient.post('/returns', data)
  },
}

// Lot İzlenebilirlik ve Geri Çağırma (Recall) Servisleri
export const traceServices = {
  traceLot: async (lotNumber) => {
    return await apiClient.get(`/lot-trace/${encodeURIComponent(lotNumber)}`)
  },
  searchRecallLot: async (lotNumber) => {
    return await apiClient.get(`/lot/trace/${encodeURIComponent(lotNumber)}`)
  },
  executeRecall: async (payload) => {
    return await apiClient.post('/lot/recall', payload)
  },
}

// Python FastAPI ML Mikroservisi (ml_service.py - Port 5000)
export const mlServices = {
  getMetrics: async () => {
    try {
      return await mlClient.get('/metrics')
    } catch {
      return await apiClient.get('/ml/metrics')
    }
  },
  predictProduction: async (payload) => {
    try {
      return await mlClient.post('/predict-production', payload)
    } catch {
      return await apiClient.post('/ml/predict-production', payload)
    }
  },
  predictButchery: async (payload) => {
    try {
      return await mlClient.post('/predict-butchery', payload)
    } catch {
      return await apiClient.post('/ml/predict-butchery', payload)
    }
  },
}

export default apiClient