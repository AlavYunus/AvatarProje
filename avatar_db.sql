-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 28 Eki 2026, 23:53:02
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `avatar_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ai_predictions`
--

CREATE TABLE `ai_predictions` (
  `id` int(11) NOT NULL,
  `prediction_type` varchar(50) NOT NULL,
  `model_name` varchar(100) NOT NULL,
  `inputs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`inputs`)),
  `expected_value` decimal(10,2) NOT NULL,
  `actual_value` decimal(10,2) NOT NULL,
  `error` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ai_predictions`
--

INSERT INTO `ai_predictions` (`id`, `prediction_type`, `model_name`, `inputs`, `expected_value`, `actual_value`, `error`, `created_at`) VALUES
(1, 'production_yield', 'example-model', '{\"input_weight\": 100, \"expected_yield_percent\": 85}', 85.00, 85.00, 0.00, '2026-10-25 19:17:09'),
(2, 'cost_increase', 'spice-model', '{\"category\": \"Baharatlar\"}', 15.00, 15.00, 0.00, '2026-10-20 06:15:00'),
(3, 'efficiency_drop', 'yield-model', '{\"target\": 95}', 92.00, 92.00, 0.00, '2026-10-18 08:30:00'),
(4, 'anomaly_detection', 'structural-validator', '{\"detected_issue\":\"Kritik Kalite Sapması! Bu hammaddeden üretilen SUC-2026-045 lotu market raflarında satışta.\",\"lot_number\":\"ET-2026-001\"}', 1.00, 1.00, 0.00, '2026-10-28 14:48:43');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cuts`
--

CREATE TABLE `cuts` (
  `id` int(11) NOT NULL,
  `cut_number` varchar(50) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `animal_type` varchar(50) NOT NULL,
  `animal_weight` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `purchase_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `cuts`
--

INSERT INTO `cuts` (`id`, `cut_number`, `animal_id`, `animal_type`, `animal_weight`, `cost_per_unit`, `total_cost`, `purchase_date`, `created_at`) VALUES
(1, 'CUT-2026-001', 1, 'Kuzu', 25.00, 9.70, 242.50, '2026-10-20 08:00:00', '2026-10-25 19:17:08');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cut_products`
--

CREATE TABLE `cut_products` (
  `id` int(11) NOT NULL,
  `cut_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `yield_percent` decimal(5,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `cut_products`
--

INSERT INTO `cut_products` (`id`, `cut_id`, `product_name`, `quantity`, `yield_percent`, `cost_per_unit`, `total_cost`) VALUES
(1, 1, 'BUT', 8.50, 34.00, 9.70, 82.45),
(2, 1, 'SIRT', 9.00, 36.00, 9.70, 87.30),
(3, 1, 'OMUZ', 4.50, 18.00, 9.70, 43.65),
(4, 1, 'KABURGA', 2.00, 8.00, 9.70, 19.40),
(5, 1, 'KIYMA', 1.00, 4.00, 9.70, 9.70);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `finished_products`
--

CREATE TABLE `finished_products` (
  `id` int(11) NOT NULL,
  `lot_number` varchar(50) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `production_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `finished_products`
--

INSERT INTO `finished_products` (`id`, `lot_number`, `product_name`, `quantity`, `cost_per_unit`, `total_cost`, `production_date`, `created_at`) VALUES
(1, 'SUC-2026-045', 'Narin Sucuk', 85.00, 12.66, 1076.00, '2026-10-24 10:00:00', '2026-10-25 19:17:08');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `finished_product_lots`
--

CREATE TABLE `finished_product_lots` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `source_lot_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `production_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `finished_product_lots`
--

INSERT INTO `finished_product_lots` (`id`, `product_id`, `source_lot_id`, `quantity`, `cost_per_unit`, `total_cost`, `production_date`) VALUES
(1, 1, NULL, 85.00, 12.66, 1076.00, '2026-10-24 10:00:00');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `material_type` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_value` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `inventory`
--

INSERT INTO `inventory` (`id`, `material_type`, `quantity`, `cost_per_unit`, `total_value`, `created_at`) VALUES
(1, 'ET', 150.00, 9.70, 1455.00, '2026-10-25 19:17:08'),
(2, 'BAHARAT', 2.00, 24.00, 48.00, '2026-10-25 19:17:08'),
(3, 'BIBERLIK', 5.00, 11.60, 58.00, '2026-10-25 19:17:08'),
(4, 'Narin Sucuk (1 kg)', 150.00, 18.16, 2724.00, '2026-10-28 19:06:11'),
(5, 'Kuzu Pirzola (Paket)', 45.00, 24.50, 2002.50, '2026-10-28 19:06:11'),
(6, 'Ege Kavurma (500g)', 80.00, 15.30, 1224.00, '2026-10-28 19:06:11'),
(7, 'Narin Salam (Dilimli)', 200.00, 8.90, 1780.00, '2026-10-28 19:06:11');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `lots`
--

CREATE TABLE `lots` (
  `id` int(11) NOT NULL,
  `lot_number` varchar(50) NOT NULL,
  `material_type` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(10) NOT NULL,
  `material_cost` decimal(10,2) NOT NULL,
  `purchase_date` datetime NOT NULL,
  `expiration_date` datetime DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `lots`
--

INSERT INTO `lots` (`id`, `lot_number`, `material_type`, `quantity`, `unit`, `material_cost`, `purchase_date`, `expiration_date`, `supplier`, `created_at`) VALUES
(1, 'ET-2026-001', 'ET', 100.00, 'kg', 9.70, '2026-10-20 10:00:00', NULL, 'Tedarikçi A', '2026-10-25 19:17:08'),
(2, 'ET-2026-002', 'ET', 50.00, 'kg', 9.70, '2026-10-21 10:00:00', NULL, 'Tedarikçi B', '2026-10-25 19:17:08'),
(3, 'BAHARAT-2026-001', 'BAHARAT', 2.00, 'kg', 24.00, '2026-10-20 11:00:00', NULL, 'Tedarikçi C', '2026-10-25 19:17:08'),
(4, 'BIBERLIK-2026-001', 'BIBERLIK', 5.00, 'kg', 11.60, '2026-10-20 12:00:00', NULL, 'Tedarikçi D', '2026-10-25 19:17:08'),
(5, 'SUCUK-2026-001', 'SUCUK', 50.00, 'kg', 18.16, '2026-10-22 10:00:00', NULL, 'Tedarikçi E', '2026-10-25 19:17:08'),
(6, 'BUT-2026-001', 'BUT', 8.50, 'kg', 9.70, '2026-10-23 10:00:00', NULL, 'Tedarikçi F', '2026-10-25 19:17:08'),
(7, 'SIRT-2026-001', 'SIRT', 9.00, 'kg', 9.70, '2026-10-23 11:00:00', NULL, 'Tedarikçi F', '2026-10-25 19:17:08');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `material_lines`
--

CREATE TABLE `material_lines` (
  `id` int(11) NOT NULL,
  `lot_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `material_type` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `material_lines`
--

INSERT INTO `material_lines` (`id`, `lot_id`, `order_id`, `material_type`, `quantity`, `cost_per_unit`, `total_cost`) VALUES
(1, 1, 1, 'ET', 100.00, 9.70, 970.00),
(2, 3, 1, 'BAHARAT', 2.00, 24.00, 48.00),
(3, 4, 1, 'BIBERLIK', 5.00, 11.60, 58.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `production_orders`
--

CREATE TABLE `production_orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `lot_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`lot_ids`)),
  `materials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`materials`)),
  `expected_output` decimal(10,2) NOT NULL,
  `actual_output` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `total_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `economic_cost_per_unit` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `production_orders`
--

INSERT INTO `production_orders` (`id`, `order_number`, `lot_ids`, `materials`, `expected_output`, `actual_output`, `status`, `total_cost`, `economic_cost_per_unit`, `created_at`) VALUES
(1, 'URT-2026-045', '[1, 3, 4]', '[{\"lot_id\": 1, \"material_type\": \"ET\", \"quantity\": 100.00, \"cost_per_unit\": 9.70, \"total_cost\": 970.00}, {\"lot_id\": 3, \"material_type\": \"BAHARAT\", \"quantity\": 2.00, \"cost_per_unit\": 24.00, \"total_cost\": 48.00}, {\"lot_id\": 4, \"material_type\": \"BIBERLIK\", \"quantity\": 5.00, \"cost_per_unit\": 11.60, \"total_cost\": 58.00}]', 85.00, 85.00, 'completed', 1076.00, 12.66, '2026-10-25 19:17:08'),
(2, 'URT-2026-047', '[1,2,3]', '[]', 100.00, 0.00, 'pending', 2000.00, 20.00, '2026-10-28 11:07:45'),
(5, 'URT-2026-048', '[1,3,4]', '[{\"lot_id\":1,\"material_type\":\"ET\",\"quantity\":100,\"cost_per_unit\":9.7,\"total_cost\":970},{\"lot_id\":3,\"material_type\":\"BAHARAT\",\"quantity\":2,\"cost_per_unit\":24,\"total_cost\":48},{\"lot_id\":4,\"material_type\":\"BAHARAT\",\"quantity\":5,\"cost_per_unit\":11.6,\"total_cost\":58}]', 92.00, 92.00, 'completed', 1543.50, 16.78, '2026-10-28 11:15:31'),
(6, 'URT-2026-038', '[1]', '[]', 70.00, 68.00, 'completed', 1260.00, 18.50, '2026-10-13 06:00:00'),
(7, 'URT-2026-039', '[1,2]', '[]', 85.00, 82.00, 'completed', 1517.00, 18.50, '2026-10-14 07:30:00'),
(8, 'URT-2026-040', '[1,3]', '[]', 90.00, 88.00, 'completed', 1620.00, 18.40, '2026-10-15 11:15:00'),
(9, 'URT-2026-041', '[2,4]', '[]', 80.00, 78.00, 'completed', 1443.00, 18.50, '2026-10-16 08:00:00'),
(10, 'URT-2026-042', '[1,4]', '[]', 75.00, 73.00, 'completed', 1350.00, 18.49, '2026-10-17 13:45:00'),
(11, 'URT-2026-043', '[2,3]', '[]', 65.00, 60.00, 'completed', 1140.00, 19.00, '2026-10-18 07:00:00'),
(12, 'URT-2026-044', '[1,2,3]', '[]', 70.00, 70.00, 'completed', 1271.20, 18.16, '2026-10-19 10:20:00');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `returns`
--

CREATE TABLE `returns` (
  `id` int(11) NOT NULL,
  `return_number` varchar(50) NOT NULL,
  `lot_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'blocked',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `returns`
--

INSERT INTO `returns` (`id`, `return_number`, `lot_id`, `product_name`, `quantity`, `cost_per_unit`, `total_cost`, `status`, `created_at`) VALUES
(1, 'RET-2026-001', 1, 'Narin Sucuk', 1.00, 12.66, 12.66, 'blocked', '2026-10-25 19:17:09'),
(2, 'RET-2026-002', 1, 'Narin Sucuk', 30.00, 18.16, 544.80, 'blocked', '2026-10-28 13:42:44');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `sale_number` varchar(50) NOT NULL,
  `lot_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `profit` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'completed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `sales`
--

INSERT INTO `sales` (`id`, `sale_number`, `lot_id`, `product_name`, `quantity`, `cost_per_unit`, `total_cost`, `sale_price`, `profit`, `status`, `created_at`) VALUES
(1, 'SAL-2026-001', 1, 'Narin Sucuk', 30.00, 12.66, 379.80, 25.00, 370.20, 'completed', '2026-10-25 19:17:08'),
(2, 'SAL-2026-004', 1, 'Narin Sucuk', 50.00, 18.16, 0.00, 25.00, 359.00, 'completed', '2026-10-28 11:07:45'),
(3, 'SAL-2026-012', 1, 'Narin Sucuk', 50.00, 15.56, 778.00, 20.00, 222.00, 'completed', '2026-10-28 14:48:09'),
(4, 'SAL-2026-002', 1, 'Narin Sucuk', 30.00, 18.16, 544.80, 25.00, 205.20, 'completed', '2026-10-28 15:31:10');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `stocks`
--

CREATE TABLE `stocks` (
  `id` int(11) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `material_type` varchar(100) NOT NULL,
  `quantity` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `system_anomalies`
--

CREATE TABLE `system_anomalies` (
  `id` int(11) NOT NULL,
  `lot_number` varchar(50) DEFAULT NULL,
  `risk_level` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `system_anomalies`
--

INSERT INTO `system_anomalies` (`id`, `lot_number`, `risk_level`, `message`, `created_at`) VALUES
(1, 'ET-2026-001', 'YÜKSEK', 'Kritik Kalite Sapması! Bu hammaddeden üretilen SUC-2026-045 lotu market raflarında satışta.', '2026-10-28 14:48:43');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'operator',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `created_at`) VALUES
(1, 'admin', 'admin123', 'Avatar Yönetici Denetçi', 'admin', '2026-10-28 14:59:07'),
(2, 'kasap1', 'kuzu2026', 'Ahmet Kasapbaşı', 'kasap', '2026-10-28 14:59:07'),
(3, 'saha_operator', 'avatar8080', 'Mehmet Saha Personeli', 'operator', '2026-10-28 14:59:07'),
(4, 'market', 'market', 'market', 'market', '2026-10-28 16:24:19'),
(5, 'operatör', 'operatör', 'operatör', 'operator', '2026-10-28 18:33:52'),
(6, 'kasap', 'kasap', 'kasap', 'kasap', '2026-10-28 18:34:47');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `ai_predictions`
--
ALTER TABLE `ai_predictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_prediction_type` (`prediction_type`),
  ADD KEY `idx_model_name` (`model_name`);

--
-- Tablo için indeksler `cuts`
--
ALTER TABLE `cuts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cut_number` (`cut_number`),
  ADD KEY `idx_cut_number` (`cut_number`),
  ADD KEY `idx_animal_type` (`animal_type`);

--
-- Tablo için indeksler `cut_products`
--
ALTER TABLE `cut_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cut_id` (`cut_id`),
  ADD KEY `idx_product_name` (`product_name`);

--
-- Tablo için indeksler `finished_products`
--
ALTER TABLE `finished_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lot_number` (`lot_number`),
  ADD KEY `idx_product_name` (`product_name`);

--
-- Tablo için indeksler `finished_product_lots`
--
ALTER TABLE `finished_product_lots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `source_lot_id` (`source_lot_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Tablo için indeksler `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inventory_material` (`material_type`);

--
-- Tablo için indeksler `lots`
--
ALTER TABLE `lots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lot_number` (`lot_number`),
  ADD KEY `idx_lot_number` (`lot_number`),
  ADD KEY `idx_material_type` (`material_type`),
  ADD KEY `idx_purchase_date` (`purchase_date`);

--
-- Tablo için indeksler `material_lines`
--
ALTER TABLE `material_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lot_id` (`lot_id`),
  ADD KEY `idx_order_id` (`order_id`);

--
-- Tablo için indeksler `production_orders`
--
ALTER TABLE `production_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_order_number` (`order_number`),
  ADD KEY `idx_status` (`status`);

--
-- Tablo için indeksler `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `return_number` (`return_number`),
  ADD KEY `lot_id` (`lot_id`),
  ADD KEY `idx_return_number` (`return_number`),
  ADD KEY `idx_return_status` (`status`);

--
-- Tablo için indeksler `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sale_number` (`sale_number`),
  ADD KEY `lot_id` (`lot_id`),
  ADD KEY `idx_sale_number` (`sale_number`),
  ADD KEY `idx_status` (`status`);

--
-- Tablo için indeksler `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `system_anomalies`
--
ALTER TABLE `system_anomalies`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `ai_predictions`
--
ALTER TABLE `ai_predictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `cuts`
--
ALTER TABLE `cuts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `cut_products`
--
ALTER TABLE `cut_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `finished_products`
--
ALTER TABLE `finished_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `finished_product_lots`
--
ALTER TABLE `finished_product_lots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `lots`
--
ALTER TABLE `lots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `material_lines`
--
ALTER TABLE `material_lines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `production_orders`
--
ALTER TABLE `production_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Tablo için AUTO_INCREMENT değeri `returns`
--
ALTER TABLE `returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `system_anomalies`
--
ALTER TABLE `system_anomalies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `cut_products`
--
ALTER TABLE `cut_products`
  ADD CONSTRAINT `cut_products_ibfk_1` FOREIGN KEY (`cut_id`) REFERENCES `cuts` (`id`);

--
-- Tablo kısıtlamaları `finished_product_lots`
--
ALTER TABLE `finished_product_lots`
  ADD CONSTRAINT `finished_product_lots_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `finished_products` (`id`),
  ADD CONSTRAINT `finished_product_lots_ibfk_2` FOREIGN KEY (`source_lot_id`) REFERENCES `lots` (`id`);

--
-- Tablo kısıtlamaları `material_lines`
--
ALTER TABLE `material_lines`
  ADD CONSTRAINT `material_lines_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`),
  ADD CONSTRAINT `material_lines_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `production_orders` (`id`);

--
-- Tablo kısıtlamaları `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`);

--
-- Tablo kısıtlamaları `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
