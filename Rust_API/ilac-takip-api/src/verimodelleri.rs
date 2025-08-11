//verimodelleri.rs
// bu zımbirti verileri alıp vermeden önceki gelen yermiş buraya tanımlayacakmışız 
// structları burdan da işimize yardğı zaman çekecez


use serde::{Deserialize, Serialize};
use chrono::{NaiveDate, NaiveTime};
use sqlx::FromRow;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub kullanici_adi: String,
    pub sifre: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub success: bool,
    pub message: String,
    pub user_id: Option<i32>,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct User {
    pub user_id: i32,
    pub kullanici_adi: String,
    pub ad: String,
    pub soyad: String,
    pub email: String,
    pub sifre: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub kullanici_adi: String,
    pub ad: String,
    pub soyad: String,
    pub email: String,
    pub sifre: String,
}

#[derive(Debug, Deserialize)]
pub struct AlarmRequest {
    pub kullanici_id: i32,
    #[serde(rename = "ilac_adi")]
    pub ilacAdi: String, 
    pub doz: Option<String>,
    pub tekrar_tipi: String,
    pub pazartesi: bool,
    pub sali: bool,
    pub carsamba: bool,
    pub persembe: bool,
    pub cuma: bool,
    pub cumartesi: bool,
    pub pazar: bool,
    pub gun: Option<i32>,
    pub baslangic_tarihi: String,
    pub saat: String,
    pub aktif_mi: bool,
}

#[derive(Debug, FromRow, Serialize)]
pub struct Alarm {
    pub alarm_id: i32,
    pub kullanici_id: i32,
    pub ilac_adi: String,
    pub doz: Option<String>,
    pub tekrar_tipi: String,
    pub pazartesi: bool,
    pub sali: bool,
    pub carsamba: bool,
    pub persembe: bool,
    pub cuma: bool,
    pub cumartesi: bool,
    pub pazar: bool,
    pub gun: Option<i32>,
    pub baslangic_tarihi: String,
    pub saat: String,
    pub aktif_mi: Option<bool>,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct AlarmResponse {
    pub alarm_id: i32,           // NOT NULL -> i32
    pub kullanici_id: i32,      // NOT NULL -> i32
    pub ilac_adi: String,        // NOT NULL -> String
    pub doz: Option<String>,     // NULLABLE -> Option<String>
    pub tekrar_tipi: String,     // NOT NULL -> String
    pub pazartesi: Option<bool>, // NULLABLE -> Option<bool>
    pub sali: Option<bool>,      // NULLABLE -> Option<bool>
    pub carsamba: Option<bool>,  // NULLABLE -> Option<bool>
    pub persembe: Option<bool>,  // NULLABLE -> Option<bool>
    pub cuma: Option<bool>,      // NULLABLE -> Option<bool>
    pub cumartesi: Option<bool>, // NULLABLE -> Option<bool>
    pub pazar: Option<bool>,     // NULLABLE -> Option<bool>
    pub gun: Option<i32>,
    pub baslangic_tarihi: String, // NOT NULL (assuming from sample data) -> String (or NaiveDate if truly a date type)
    pub saat: String,            // NOT NULL (assuming from sample data) -> String (or NaiveTime if truly a time type)
    pub aktif_mi: bool,          // NOT NULL -> bool
}


// Buraya diğer modelleri de ekleyebilirsin (Alarm, RegisterRequest, vb.)
