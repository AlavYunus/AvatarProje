package main

import (
	"time"
)

// Lot - Lot bazlı izlenebilirlik için temel yapı
type Lot struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	LotNumber   string         `gorm:"uniqueIndex;size:50"`
	MaterialType string        // "ET", "SUCUK", etc.
	Quantity    float64        // Miktar (kg veya paket)
	Unit        string         // "kg", "paket"
	MaterialCost float64       // Alım maliyeti
	PurchaseDate time.Time     // Alım tarihi
	ExpirationDate *time.Time  // Son tüketim tarihi (FIFO için)
	CreatedAt   time.Time      // Oluşturma tarihi
}

// ProductionOrder - Üretim emri
type ProductionOrder struct {
	ID              uint           `gorm:"primaryKey;autoIncrement"`
	OrderNumber     string         // "URT-2026-045" formatında
	LotIDs          []uint         // Kullanılan lotlar
	Materials       []MaterialLine // Hammadde detayları
	ExpectedOutput  float64        // Beklenen mamul miktarı
	ActualOutput    float64        // Gerçek mamul miktarı
	Status          string         // "pending", "completed"
	CreatedAt       time.Time      // Oluşturma tarihi
	TotalCost       float64        // Toplam maliyet
	EconomicCostPerUnit float64  // Birim maliyet (EKP)
}

// MaterialLine - Üretim emrindeki hammadde detayı
type MaterialLine struct {
	LotID     uint   `gorm:"primaryKey;index:idx_lot_id"`
	OrderID   uint   `gorm:"primaryKey;index:idx_order_id"`
	MaterialType string
	Quantity    float64 // Kullanılan miktar
	CostPerUnit float64 // Birim maliyet
	TotalCost   float64 // Toplam maliyet
}

// FinishedProduct - Mamul ürün
type FinishedProduct struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	LotNumber   string         // "SUC-2026-045" formatında
	ProductName  string        // "Narin Sucuk", "But", etc.
	Quantity    float64        // Üretim miktarı
	CostPerUnit float64        // Birim maliyet (EKP)
	TotalCost   float64        // Toplam maliyet
	ProductionDate time.Time   // Üretim tarihi
	CreatedAt   time.Time      // Oluşturma tarihi
}

// FinishedProductLot - Mamul ürünün lot detayı
type FinishedProductLot struct {
	LotID       uint           `gorm:"primaryKey;autoIncrement"`
	ProductID   uint           `gorm:"primaryKey;index:idx_product_id"`
	ProductName string         // "Narin Sucuk"
	Quantity    float64        // Lot miktarı
	CostPerUnit float64        // Birim maliyet
	TotalCost   float64        // Toplam maliyet
	ProductionDate time.Time   // Üretim tarihi
}

// ProductionLotLink - Çoktan-başa ilikiler için many-to-many bağlantı
type ProductionLotLink struct {
	LotID       uint `gorm:"primaryKey"`
	ProductID   uint `gorm:"primaryKey;index:idx_product_id"`
	MaterialType string
	Quantity    float64 // Mamul miktarı
	CostPerUnit float64
	TotalCost   float64
}

// Cut - Parçalama işlemleri için
type Cut struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	CutNumber   string         // "CUT-2026-001" formatında
	AnimalID    uint           // Giri hayvani ID
	AnimalType  string         // "Kuzu", "İnek"
	AnimalWeight float64       // Giri hacmi (kg)
	CostPerUnit float64        // Birim maliyet
	TotalCost   float64        // Toplam maliyet
	PurchaseDate time.Time     // Alım tarihi
	CreatedAt   time.Time      // Oluşturma tarihi
}

// CutProduct - Parçalama ürün detayı
type CutProduct struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	CutID       uint           `gorm:"index:idx_cut_id"`
	ProductName  string        // "But", "Sırt", etc.
	Quantity    float64        // Parça miktarı (kg)
	YieldPercent float64       // Verim yüzdesi (%100 = %100 verim)
	CostPerUnit float64        // Birim maliyet
	TotalCost   float64        // Toplam maliyet
}

// CutLink - Giri lotundan parça ürüne bağlantı
type CutLink struct {
	CutID       uint `gorm:"primaryKey"`
	ProductID   uint `gorm:"primaryKey;index:idx_product_id"`
	MaterialType string
	Quantity    float64 // Parça miktarı
	YieldPercent float64
	CostPerUnit float64
	TotalCost   float64
}

// Sale - Satış kaydı
type Sale struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	SaleNumber  string         // "SAL-2026-001" formatında
	LotID       uint           // Satılan lot ID
	ProductName  string         // Ürün adı
	Quantity    float64        // Satış miktarı
	CostPerUnit float64        // Birim maliyet
	TotalCost   float64        // Toplam maliyet
	SalePrice   float64        // Satış fiyatı
	Profit      float64        // Brüt kâr
	Status      string         // "completed", "returned"
	CreatedAt   time.Time      // Satış tarihi
}

// SaleLotLink - Lot bazlı satış detayı
type SaleLotLink struct {
	SaleID    uint `gorm:"primaryKey"`
	LotID     uint `gorm:"primaryKey;index:idx_lot_id"`
	ProductName string
	Quantity float64
	CostPerUnit float64
	TotalCost   float64
}

// Return - Geri iade kaydı
type Return struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	ReturnNumber string        // "RET-2026-001" formatında
	LotID       uint           // Etkilenen lot ID
	ProductName  string         // Ürün adı
	Quantity    float64        // İade miktarı
	CostPerUnit float64        // Birim maliyet
	TotalCost   float64        // Toplam maliyet
	Status      string         // "blocked", "processed"
	CreatedAt   time.Time      // İade tarihi
}

// ReturnLotLink - Geri iade lot detayı
type ReturnLotLink struct {
	ReturnID uint `gorm:"primaryKey"`
	LotID    uint `gorm:"primaryKey;index:idx_lot_id"`
	ProductName string
	Quantity float64
	CostPerUnit float64
	TotalCost   float64
}

// AIPrediction - Yapay zeka tahminleri için
type AIPrediction struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	PredictionType string      // "production_yield", "cut_yield"
	ModelName    string        // Kullanılan model adı
	Inputs       string        // Girdi verisi (JSON)
	ExpectedValue float64      // Beklenen değer
	ActualValue  float64       // Gerçek değer
	Error        float64       // Tahmin hatası
	CreatedAt   time.Time      // Oluşturma tarihi
}

// Inventory - Stok takibi
type Inventory struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	MaterialType string        // "ET", "SUCUK"
	Quantity    float64        // Stok miktarı
	CostPerUnit float64        // Birim maliyet
	TotalValue  float64         // Toplam değer
	CreatedAt   time.Time      // Oluşturma tarihi
}
