//signup.rs

use crate::verimodelleri::RegisterRequest;
use crate::verimodelleri::AuthResponse;

use serde::{Deserialize, Serialize};
use sqlx::PgPool;



pub async fn handle_signup(request: &str, pool: &PgPool) -> (&'static str, String, &'static str) {
    println!("Kayıt isteği alındı");

    if let Some(index) = request.find("\r\n\r\n") {
        let body_str = &request[index + 4..];

        match serde_json::from_str::<RegisterRequest>(body_str) {
            Ok(register_payload) => {
                let insert_result = sqlx::query_as::<_, (i32,)>(
                    "INSERT INTO users (ad, soyad, email, sifre, kullanici_adi) VALUES ($1, $2, $3, $4, $5) RETURNING user_id"
                )
                .bind(&register_payload.ad)
                .bind(&register_payload.soyad)
                .bind(&register_payload.email)
                .bind(&register_payload.sifre)
                .bind(&register_payload.kullanici_adi)
                .fetch_one(pool)
                .await;

                match insert_result {
                    Ok(row) => {
                        let new_user_id = row.0;
                        (
                            "HTTP/1.1 201 Created",
                            serde_json::to_string(&AuthResponse {
                                success: true,
                                message: "Kayıt başarılı!".to_string(),
                                user_id: Some(new_user_id),
                            }).unwrap(),
                            "application/json"
                        )
                    }
                    Err(e) => {
                        eprintln!("Kayıt işlemi sırasında veritabanı hatası: {}", e);
                        (
                            "HTTP/1.1 500 Internal Server Error",
                            serde_json::to_string(&AuthResponse {
                                success: false,
                                message: "Sunucu hatası: Kayıt yapılamadı.".to_string(),
                                user_id: None,
                            }).unwrap(),
                            "application/json"
                        )
                    }
                }
            }
            Err(e) => {
                eprintln!("Kayıt isteği JSON parse hatası: {}", e);
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
