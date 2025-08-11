//login.rs

use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use crate::verimodelleri::{User, LoginRequest, AuthResponse};


// Async fonksiyon olarak yazıyoruz, pool referansını parametre olarak alır
pub async fn handle_login(request: &str, pool: &PgPool) -> (&'static str, String, &'static str) {
    println!("Login isteği alındı");

    if let Some(index) = request.find("\r\n\r\n") {
        let body_str = &request[index + 4..];

        match serde_json::from_str::<LoginRequest>(body_str) {
            Ok(login_payload) => {
                println!("Parsed login payload: {:?}", login_payload);

                match sqlx::query_as::<_, User>(
                    "SELECT user_id, ad, soyad, email, sifre, kullanici_adi FROM users WHERE kullanici_adi = $1"
                )
                .bind(&login_payload.kullanici_adi)
                .fetch_optional(pool)
                .await
                {
                    Ok(Some(user)) => {
                        println!("Veritabanındaki kullanıcı: {:?}", user);

                        if user.sifre == login_payload.sifre {
                            (
                                "HTTP/1.1 200 OK",
                                serde_json::to_string(&AuthResponse {
                                    success: true,
                                    message: "Giriş başarılı!".to_string(),
                                    user_id: Some(user.user_id),
                                }).unwrap(),
                                "application/json"
                            )
                        } else {
                            (
                                "HTTP/1.1 401 Unauthorized",
                                serde_json::to_string(&AuthResponse {
                                    success: false,
                                    message: "Şifre yanlış.".to_string(),
                                    user_id: None,
                                }).unwrap(),
                                "application/json"
                            )
                        }
                    }
                    Ok(None) => (
                        "HTTP/1.1 404 Not Found",
                        serde_json::to_string(&AuthResponse {
                            success: false,
                            message: "Kullanıcı bulunamadı.".to_string(),
                            user_id: None,
                        }).unwrap(),
                        "application/json"
                    ),
                    Err(e) => {
                        eprintln!("Veritabanı hatası: {}", e);
                        (
                            "HTTP/1.1 500 Internal Server Error",
                            serde_json::to_string(&AuthResponse {
                                success: false,
                                message: "Sunucu hatası.".to_string(),
                                user_id: None,
                            }).unwrap(),
                            "application/json"
                        )
                    }
                }
            }
            Err(e) => {
                eprintln!("JSON parse hatası: {}", e);
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
                user_id: None,
                success: false,
                message: "İstek gövdesi eksik.".to_string(),
            }).unwrap(),
            "application/json"
        )
    }
}
