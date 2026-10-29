package main

import (
	"fmt"
)

// ConsistencyCheck - Proje tutarsızlıklarını kontrol et
func ConsistencyCheck() {
	fmt.Println("=== AVATAR Proje Tutarsızlık Kontrolü ===")
	fmt.Println()

	// Örnek görseldeki tutarsızlık kontrolü
	expectedTotal := 25.0 * 11.50
	actualTotal := 351.00
	actualWeight := 22.0

	fmt.Printf("Örnek Görsel Kontrolü:\n")
	fmt.Printf("  Beklenen Toplam: %.2f TL (25 kg × 11.50)\n", expectedTotal)
	fmt.Printf("  Görseldeki Toplam: %.2f TL\n", actualTotal)
	fmt.Printf("  Alt Parça Toplamı: %.2f kg\n", actualWeight)
	fmt.Printf("  Fark: %.2f TL (%.2f kg)\n", actualTotal-expectedTotal, expectedTotal-actualWeight)

	if expectedTotal != actualTotal {
		fmt.Println()
		fmt.Println("⚠️  UYARI: Görseldeki tutarsızlık tespit edildi!")
		fmt.Printf("    - 25 kg × 11.50 = %.2f TL gösteriliyor\n", expectedTotal)
		fmt.Printf("    - Ancak toplam 351.00 TL ve alt parça 22 kg\n")
		fmt.Println("    Aday bu farkı tespit etmeli ve açıklamalıdır.")
	}

	fmt.Println()
	fmt.Println("=== Lot İzlenebilirlik Kontrolü ===")
	fmt.Println()

	// Lot izlenebilirliği örneği
	lotExample := struct {
		HammaddeLot   string
		ProductionOrder string
		FinishedProduct string
	}{
		HammaddeLot:   "ET-2026-001 / 100 kg",
		ProductionOrder: "URT-2026-045",
		FinishedProduct: "SUC-2026-045 / 85 paket",
	}

	fmt.Printf("Lot İzlenebilirlik Örneği:\n")
	fmt.Printf("  Hammadde Lotu: %s\n", lotExample.HammaddeLot)
	fmt.Printf("  Üretim Emri: %s\n", lotExample.ProductionOrder)
	fmt.Printf("  Mamul Lotu: %s\n", lotExample.FinishedProduct)

	// Market dağılımı
	markets := map[string]int{
		"Market A": 30,
		"Market B": 25,
		"Market C": 30,
	}

	fmt.Println()
	fmt.Printf("Market Dağılımı:\n")
	for market, qty := range markets {
		fmt.Printf("  %s: %d paket\n", market, qty)
	}

	fmt.Println()
	fmt.Println("=== EKP Hesaplama Kontrolü ===")
	fmt.Println()

	// EKP örneği
	materials := []struct {
		Name        string
		Quantity    float64
		CostPerUnit float64
	}{
		{"Et", 100.0, 9.70},
		{"Baharat", 2.0, 24.00},
		{"Biberlik", 5.0, 11.60},
	}

	totalCost := 0.0
	for _, m := range materials {
		cost := m.Quantity * m.CostPerUnit
		totalCost += cost
		fmt.Printf("  %s: %.2f kg × %.2f = %.2f TL\n", m.Name, m.Quantity, m.CostPerUnit, cost)
	}

	economicCostPerUnit := totalCost / 85.0

	fmt.Println()
	fmt.Printf("Toplam Maliyet: %.2f TL\n", totalCost)
	fmt.Printf("Birim Maliyet (EKP): %.2f TL/paket\n", economicCostPerUnit)
	fmt.Printf("Formül: %.2f / 85 = %.2f\n", totalCost, economicCostPerUnit)

	fmt.Println()
	fmt.Println("=== Yapay Zeka Tahmin Kontrolü ===")
	fmt.Println()

	// AI tahmin prensipleri
	fmt.Println("Yapay Zeka Prensipleri:")
	fmt.Println("  ✅ Lot izlenebilirliği ve geri iade sonuçları KI tahminine değil,")
	fmt.Println("     kesin kayıt ilikilerine dayanmalıdır.")
	fmt.Println("  ✅ Tahmin hata ölçümü sunulmalıdır.")
	fmt.Println("  ✅ Gerçek veri azsa sınırlılıklar açıkça belirtilmelidir.")

	fmt.Println()
	fmt.Println("=== Kontrol Tamamlandı ===")
}
