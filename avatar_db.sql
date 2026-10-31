-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 31 Eki 2026, 13:55:09
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
(4, 'SAL-2026-002', 1, 'Narin Sucuk', 30.00, 18.16, 544.80, 25.00, 205.20, 'completed', '2026-10-28 15:31:10'),
(5, 'SAL-2026-01', 1, 'Narin Sucuk', 25.00, 18.16, 454.00, 25.00, 171.00, 'completed', '2026-10-31 12:02:41'),
(6, 'SAL-2026-200', 1, 'Narin Sucuk', 70.00, 18.16, 1271.20, 25.00, 478.80, 'completed', '2026-10-31 12:36:30');

--
-- Dökümü yapılmış tablolar için indeksler
--

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
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
