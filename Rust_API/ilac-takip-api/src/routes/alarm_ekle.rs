use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::verimodelleri::AuthResponse;
use crate::verimodelleri::AlarmRequest;


pub async fn handle_alarm_ekle(request: &str, pool: &PgPool) -> (&'static str, String, &'static str) {
    println!("Alarm Ekle isteği alındı");

    if let Some(index) = request.find("\r\n\r\n") {
        let body_str = &request[index + 4..];

        match serde_json::from_str::<AlarmRequest>(body_str) {
            Ok(alarm) => {
                let insert_result = sqlx::query(
                    r#"
                    INSERT INTO alarms (
                        kullanici_id, ilac_adi, doz, tekrar_tipi,
                        pazartesi, sali, carsamba, persembe, cuma, cumartesi, pazar,
                        gun, baslangic_tarihi, saat, aktif_mi
                    ) VALUES (
                        $1, $2, $3, $4,
                        $5, $6, $7, $8, $9, $10, $11,
                        $12, $13, $14, $15
                    )
                    "#
                )
                .bind(alarm.kullanici_id)
                .bind(alarm.ilacAdi)
                .bind(alarm.doz)
                .bind(alarm.tekrar_tipi)
                .bind(alarm.pazartesi)
                .bind(alarm.sali)
                .bind(alarm.carsamba)
                .bind(alarm.persembe)
                .bind(alarm.cuma)
                .bind(alarm.cumartesi)
                .bind(alarm.pazar)
                .bind(alarm.gun)
                .bind(alarm.baslangic_tarihi)
                .bind(alarm.saat)
                .bind(alarm.aktif_mi)
                .execute(pool)
                .await;

                match insert_result {
                    Ok(_) => (
                        "HTTP/1.1 201 Created",
                        serde_json::to_string(&AuthResponse {
                            success: true,
                            message: "Alarm başarıyla eklendi.".to_string(),
                            user_id: None,
                        }).unwrap(),
                        "application/json"
                    ),
                    Err(e) => {
                        eprintln!("Alarm ekleme veritabanı hatası: {}", e);
                        (
                            "HTTP/1.1 500 Internal Server Error",
                            serde_json::to_string(&AuthResponse {
                                success: false,
                                message: "Sunucu hatası (alarm eklenemedi).".to_string(),
                                user_id: None,
                            }).unwrap(),
                            "application/json"
                        )
                    }
                }
            }
            Err(e) => {
                eprintln!("Alarm ekle JSON parse hatası: {}", e);
                (
                    "HTTP/1.1 400 Bad Request",
                    serde_json::to_string(&AuthResponse {
                        success: false,
                        message: format!("Geçersiz JSON: {}", e),
                        user_id: None,
                    }).unwrap(),
                    "application/json"
                )
            }
        }
    } else {
        (
            "HTTP/1.1 400 Bad Request",
            serde_json::to_string(&AuthResponse {
                success: false,
                message: "İstek gövdesi eksik.".to_string(),
                user_id: None,
            }).unwrap(),
            "application/json"
        )
    }
}
