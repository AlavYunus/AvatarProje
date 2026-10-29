 package com.avatar.erp.network

 import retrofit2.Retrofit
 import retrofit2.converter.gson.GsonConverterFactory

 object RetrofitClient {
     // Bilgisayarınızın ipconfig çıktısındaki gerçek yerel IP adresini ve 8080 portunu yazın:
     private const val BASE_URL =  "http://127.0.0.1:8080/"
     val apiService: AvatarApiService by lazy {
         Retrofit.Builder()
             .baseUrl(BASE_URL)
             .addConverterFactory(GsonConverterFactory.create())
             .build()
             .create(AvatarApiService::class.java)
     }
 }
