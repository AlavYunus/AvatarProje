package com.avatar.erp

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "avatar_local.db"
        private const val DATABASE_VERSION = 1
        const val TABLE_OFFLINE_STOCK = "offline_stock"
        const val COLUMN_ID = "id"
        const val COLUMN_BARCODE = "barcode"
        const val COLUMN_MATERIAL_TYPE = "material_type"
        const val COLUMN_QUANTITY = "quantity"
    }

    override fun onCreate(db: SQLiteDatabase?) {
        val createTable = ("CREATE TABLE $TABLE_OFFLINE_STOCK ("
                + "$COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,"
                + "$COLUMN_BARCODE TEXT,"
                + "$COLUMN_MATERIAL_TYPE TEXT,"
                + "$COLUMN_QUANTITY REAL" + ")")
        db?.execSQL(createTable)
    }

    // HATALI YAZIM TEMİZLENDİ: Standart Kotlin override fonksiyon yapısına çekildi
    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        db?.execSQL("DROP TABLE IF EXISTS $TABLE_OFFLINE_STOCK")
        onCreate(db)
    }

    // İnternet yoksa veriyi telefondaki yerel SQLite'a yedekler
    fun insertOfflineStock(barcode: String, materialType: String, quantity: Double): Boolean {
        val db = this.writableDatabase
        val contentValues = ContentValues().apply {
            put(COLUMN_BARCODE, barcode)
            put(COLUMN_MATERIAL_TYPE, materialType)
            put(COLUMN_QUANTITY, quantity)
        }
        val result = db.insert(TABLE_OFFLINE_STOCK, null, contentValues)
        return result != -1L
    }

    // Senkronizasyon sırası bekleyen tüm çevrimdışı kayıtları harita olarak listeler
    fun getAllOfflineStocks(): List<Map<String, Any>> {
        val list = mutableListOf<Map<String, Any>>()
        val db = this.readableDatabase
        val cursor: Cursor = db.rawQuery("SELECT * FROM $TABLE_OFFLINE_STOCK", null)

        if (cursor.moveToFirst()) {
            do {
                val map = mapOf(
                    "id" to cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_ID)),
                    "barcode" to cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_BARCODE)),
                    "material_type" to cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_MATERIAL_TYPE)),
                    "quantity" to cursor.getDouble(cursor.getColumnIndexOrThrow(COLUMN_QUANTITY))
                )
                list.add(map)
            } while (cursor.moveToNext())
        }
        cursor.close()
        return list
    }

    // Başarıyla MySQL'e aktarılan senkronize veriyi lokal hafızadan siler
    fun deleteOfflineStock(id: Int) {
        val db = this.writableDatabase
        db.delete(TABLE_OFFLINE_STOCK, "$COLUMN_ID=?", arrayOf(id.toString()))
    }
}
