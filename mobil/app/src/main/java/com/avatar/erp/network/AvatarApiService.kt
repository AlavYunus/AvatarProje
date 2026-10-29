package com.avatar.erp.network

import com.avatar.erp.model.ProductionOrderResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface AvatarApiService {

    @GET("api/production/orders")
    suspend fun getProductionOrders(): Response<List<ProductionOrderResponse>>

    @GET("api/lot-trace/{lotNumber}")
    suspend fun getLotTrace(@Path("lotNumber") lotNumber: String): Response<Map<String, Any>>

    @POST("api/stock/add")
    @JvmSuppressWildcards
    suspend fun addStock(@Body stockData: Map<String, Any>): Response<Map<String, Any>>

    @POST("api/sales/make")
    @JvmSuppressWildcards
    suspend fun makeSale(@Body saleData: Map<String, Any>): Response<Map<String, Any>>

    @POST("api/ml/predict-butchery")
    @JvmSuppressWildcards
    suspend fun predictButchery(@Body cutData: Map<String, Any>): Response<Map<String, Any>>
}
