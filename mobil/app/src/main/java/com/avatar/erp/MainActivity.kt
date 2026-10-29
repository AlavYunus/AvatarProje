package com.avatar.erp

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Size
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.* // TopAppBar ve ExperimentalMaterial3Api için zorunlu
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.compose.ui.unit.dp
import com.avatar.erp.model.ProductionOrderResponse
import com.avatar.erp.network.RetrofitClient
import com.google.accompanist.permissions.ExperimentalPermissionsApi // 👈 Eksik olan izin anotasyon kütüphanesi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.barcode.BarcodeScanning
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.concurrent.Executors


class MainActivity : ComponentActivity() {
    private lateinit var dbHelper: DatabaseHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Düzeltilen satır: Parametre adı kaldırıldı, doğrudan 'this' gönderildi.
        dbHelper = DatabaseHelper(this)

        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    AvatarErpApp(dbHelper)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalPermissionsApi::class)
@Composable

fun AvatarErpApp(dbHelper: DatabaseHelper) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    // Aktif Sayfa Durumu (0: Stok, 1: Satış, 2: AI Analiz, 3: Web Yönetim)
    var selectedTab by remember { mutableStateOf(0) }
    var orders by remember { mutableStateOf<List<ProductionOrderResponse>>(emptyList()) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var offlineCount by remember { mutableStateOf(dbHelper.getAllOfflineStocks().size) }

    LaunchedEffect(Unit) {
        while (true) {
            val localRecords = dbHelper.getAllOfflineStocks()
            if (localRecords.isNotEmpty()) {
                localRecords.forEach { record ->
                    try {
                        val res = RetrofitClient.apiService.addStock(mapOf(
                            "barcode" to record["barcode"].toString(),
                            "material_type" to record["material_type"].toString(),
                            "quantity" to record["quantity"] as Double
                        ))
                        if (res.isSuccessful) dbHelper.deleteOfflineStock(record["id"] as Int)
                    } catch (e: Exception) {}
                }
                offlineCount = dbHelper.getAllOfflineStocks().size
            }
            delay(10000)
        }
    }

    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getProductionOrders()
            if (response.isSuccessful && response.body() != null) {
                orders = response.body()!!
            }
        } catch (e: Exception) {
            errorMessage = "Merkezi ağ bağlantısı yok (Çevrimdışı Mod Aktif)"
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("AVATAR ERP - " + when(selectedTab) {
                        0 -> "Stok Yönetimi"
                        1 -> "Satış Paneli"
                        2 -> "Yapay Zeka Analiz"
                        else -> "Web Raporlama & Yönetim"
                    })
                },
                actions = {
                    if (offlineCount > 0) {
                        Badge(containerColor = MaterialTheme.colorScheme.error) {
                            Text("$offlineCount Çevrimdışı", color = MaterialTheme.colorScheme.onError, modifier = Modifier.padding(4.dp))
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Create, contentDescription = "Stok") },
                    label = { Text("Stok Giriş") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.ShoppingCart, contentDescription = "Satış") },
                    label = { Text("Satış") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.Build, contentDescription = "AI") },
                    label = { Text("AI Analiz") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Web") }, // Lüks Ev/Yönetim İkonu
                    label = { Text("Web Panel") }
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.fillMaxSize().padding(innerPadding)) {
            when (selectedTab) {
                0 -> Box(modifier = Modifier.padding(16.dp)) { StockManagementTab(dbHelper) { offlineCount = dbHelper.getAllOfflineStocks().size } }
                1 -> Box(modifier = Modifier.padding(16.dp)) { SalesTab() }
                2 -> Box(modifier = Modifier.padding(16.dp)) { AiAnalysisTab(orders, errorMessage) }
                3 -> WebManagementTab() // Tam ekran çalışabilmesi için padding dışına alındı
            }
        }
    }
}

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun StockManagementTab(dbHelper: DatabaseHelper, onUpdateOfflineCount: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var barcodeInput by remember { mutableStateOf("") }
    var materialTypeInput by remember { mutableStateOf("") }
    var quantityInput by remember { mutableStateOf("") }
    var isCameraOpen by remember { mutableStateOf(false) }
    val cameraPermissionState = rememberPermissionState(android.Manifest.permission.CAMERA)
    val lifecycleOwner = LocalLifecycleOwner.current

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Kamera ve SQLite Destekli Stok Girişi", style = MaterialTheme.typography.titleMedium)

        if (isCameraOpen && cameraPermissionState.status.isGranted) {
            Box(modifier = Modifier.fillMaxWidth().height(160.dp)) {
                AndroidView(factory = { ctx ->
                    val previewView = PreviewView(ctx)
                    val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                    cameraProviderFuture.addListener({
                        val cameraProvider = cameraProviderFuture.get()
                        val preview = Preview.Builder().build().also { it.setSurfaceProvider(previewView.surfaceProvider) }
                        val imageAnalysis = ImageAnalysis.Builder()
                            .setTargetResolution(Size(1280, 720))
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build()
                        imageAnalysis.setAnalyzer(Executors.newSingleThreadExecutor()) { imageProxy ->
                            @SuppressLint("UnsafeOptInUsageError")
                            val mediaImage = imageProxy.image
                            if (mediaImage != null) {
                                val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
                                BarcodeScanning.getClient().process(image).addOnSuccessListener { barcodes ->
                                    for (barcode in barcodes) { barcode.rawValue?.let { barcodeInput = it; isCameraOpen = false } }
                                }.addOnCompleteListener { imageProxy.close() }
                            } else { imageProxy.close() }
                        }
                        cameraProvider.unbindAll()
                        cameraProvider.bindToLifecycle(lifecycleOwner, CameraSelector.DEFAULT_BACK_CAMERA, preview, imageAnalysis)
                    }, ContextCompat.getMainExecutor(ctx))
                    previewView
                }, modifier = Modifier.fillMaxSize())
            }
        }

        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(value = barcodeInput, onValueChange = { barcodeInput = it }, label = { Text("Barkod") }, modifier = Modifier.weight(1f))
            Spacer(modifier = Modifier.width(4.dp))
            Button(onClick = { isCameraOpen = true }) { Text("Tara") }
        }
        OutlinedTextField(value = materialTypeInput, onValueChange = { materialTypeInput = it }, label = { Text("Ürün Tipi") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = quantityInput, onValueChange = { quantityInput = it }, label = { Text("Miktar (KG)")}, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())

        Button(
            onClick = {
                val qty = quantityInput.toDoubleOrNull() ?: 0.0
                if (barcodeInput.isBlank() || qty <= 0.0) return@Button
                coroutineScope.launch {
                    try {
                        val res = RetrofitClient.apiService.addStock(mapOf("barcode" to barcodeInput, "material_type" to materialTypeInput, "quantity" to qty))
                        if (res.isSuccessful) {
                            Toast.makeText(context, "✅ Doğrudan MySQL Veritabanına Eklendi!", Toast.LENGTH_SHORT).show()
                        } else {
                            throw Exception("Sunucu Hatası")
                        }
                    } catch (e: Exception) {
                        // ŞARTNAME GEREKSİNİMİ: İnternet koptuysa yerel SQLite devreye girer
                        val savedLocal = dbHelper.insertOfflineStock(barcodeInput.trim(), materialTypeInput.trim(), qty)
                        if (savedLocal) {
                            Toast.makeText(context, "📡 Ağ Yok: Veri SQLite Yerel Kuyruğuna Alındı!", Toast.LENGTH_LONG).show()
                            onUpdateOfflineCount()
                        }
                    }
                    barcodeInput = ""; materialTypeInput = ""; quantityInput = ""
                }
            }, modifier = Modifier.fillMaxWidth()
        ) { Text("Stoğu Kaydet") }
    }
}

@Composable
fun SalesTab() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var saleMarketInput by remember { mutableStateOf("") }
    var saleLotInput by remember { mutableStateOf("") }
    var saleQtyInput by remember { mutableStateOf("") }

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Şartname Görevi: Kotlin ile Ürün Satış Girişi", style = MaterialTheme.typography.titleMedium)
        OutlinedTextField(value = saleMarketInput, onValueChange = { saleMarketInput = it }, label = { Text("Alıcı Market Adı") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = saleLotInput, onValueChange = { saleLotInput = it }, label = { Text("Satılacak Mamul Lot No") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = saleQtyInput, onValueChange = { saleQtyInput = it }, label = { Text("Satış Miktarı (Paket)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())

        Button(
            onClick = {
                val sQty = saleQtyInput.toDoubleOrNull() ?: 0.0
                if (saleMarketInput.isBlank() || saleLotInput.isBlank() || sQty <= 0.0) return@Button
                coroutineScope.launch {
                    try {
                        val res = RetrofitClient.apiService.makeSale(mapOf("market_name" to saleMarketInput, "product_lot" to saleLotInput, "quantity" to sQty))
                        if (res.isSuccessful) {
                            Toast.makeText(context, "✅ Satış Başarıyla Gerçekleşti!", Toast.LENGTH_SHORT).show()
                            saleMarketInput = ""; saleLotInput = ""; saleQtyInput = ""
                        } else if (res.code() == 403) {
                            Toast.makeText(context, "❌ SATIŞ ENGELLENDİ! Hammaddede Kalite Sorunu Var!", Toast.LENGTH_LONG).show()
                        }
                    } catch (e: Exception) { Toast.makeText(context, "Sunucu bağlantı hatası", Toast.LENGTH_SHORT).show() }
                }
            }, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
        ) { Text("Satışı Onayla") }
    }
}
@Composable
fun AiAnalysisTab(orders: List<ProductionOrderResponse>, errorMessage: String?) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var aiAnimalType by remember { mutableStateOf("Kuzu") }
    var aiWeightInput by remember { mutableStateOf("") }
    var aiCostInput by remember { mutableStateOf("") }
    var aiCutProducts by remember { mutableStateOf<List<Map<String, Any>>>(emptyList()) }
    var aiPredictionError by remember { mutableStateOf<Double?>(null) }

    LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        item {
            Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Madde 4-B: AI Parçalama Verimi Tahmini", style = MaterialTheme.typography.titleMedium)
                    OutlinedTextField(value = aiAnimalType, onValueChange = { aiAnimalType = it }, label = { Text("Hayvan Türü") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = aiWeightInput, onValueChange = { aiWeightInput = it }, label = { Text("Giriş Ağırlığı (KG)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = aiCostInput, onValueChange = { aiCostInput = it }, label = { Text("Birim Alış Maliyeti") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())

                    Button(
                        onClick = {
                            val weight = aiWeightInput.toDoubleOrNull() ?: 0.0
                            val cost = aiCostInput.toDoubleOrNull() ?: 0.0
                            if (weight <= 0.0 || cost <= 0.0) return@Button
                            coroutineScope.launch {
                                try {
                                    val res = RetrofitClient.apiService.predictButchery(mapOf("animal_type" to aiAnimalType, "animal_weight" to weight, "cost_per_unit" to cost))
                                    if (res.isSuccessful && res.body() != null) {
                                        val body = res.body()!!
                                        aiCutProducts = body["cut_products"] as? List<Map<String, Any>> ?: emptyList()
                                        aiPredictionError = body["prediction_error"] as? Double
                                    }
                                } catch (e: Exception) { Toast.makeText(context, "AI Servis bağlantı hatası", Toast.LENGTH_SHORT).show() }
                            }
                        }, modifier = Modifier.fillMaxWidth()
                    ) { Text("Yapay Zeka Tahmini Üret (FastAPI)") }

                    if (aiCutProducts.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("🤖 AI Tahmin Çıktıları:", style = MaterialTheme.typography.titleSmall)
                        aiCutProducts.forEach { prod ->
                            Text("• ${prod["product_name"]}: ${prod["quantity"]} KG (Verim: %${prod["yield_percent"]})")
                        }
                        aiPredictionError?.let { err -> Text("📊 Model Hata Oranı (MAE): $err", color = MaterialTheme.colorScheme.primary) }
                    }
                }
            }
        }

        item { Text("Sistemdeki Aktif Üretim Emirleri", style = MaterialTheme.typography.titleLarge) }

        if (errorMessage != null) {
            item { Text(text = errorMessage, color = MaterialTheme.colorScheme.error) }
        } else {
            items(orders) { order ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Emir No: ${order.order_number}", style = MaterialTheme.typography.titleMedium)
                        Text("Maliyet: ${order.total_cost} TL")
                        Text("Durum: ${order.status}")
                    }
                }
            }
        }
    }
}
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebManagementTab() {
    // React projenizin Vite lokal adresi (Emülatör ağ köprüsü portu ile)
    val webPanelUrl = "http://127.0.0.1:5173/"

    AndroidView(
        factory = { ctx ->
            WebView(ctx).apply {
                layoutParams = android.view.ViewGroup.LayoutParams(
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT
                )
                webViewClient = WebViewClient() // Linklerin harici tarayıcıda açılmasını engeller, uygulama içinde tutar

                // React ve JavaScript kodlarının pürüzsüz çalışması için motoru aktif ediyoruz
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true // LocalStorage veri takibi için zorunlu altyapı

                loadUrl(webPanelUrl)
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}
