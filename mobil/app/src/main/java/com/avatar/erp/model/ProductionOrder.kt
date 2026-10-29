package com.avatar.erp.model

data class MaterialLine(
    val lot_id: Int,
    val material_type: String,
    val quantity: Double,
    val cost_per_unit: Double,
    val total_cost: Double
)

data class ProductionOrderResponse(
    val id: Int,
    val order_number: String,
    val lot_ids: List<Int>,
    val materials: List<MaterialLine>,
    val expected_output: Double,
    val actual_output: Double,
    val status: String,
    val total_cost: Double,
    val economic_cost_per_unit: Double
)
