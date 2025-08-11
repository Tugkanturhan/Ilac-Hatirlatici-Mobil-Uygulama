//server.js

//alarmların çalması eksik alarmları listeleme eksik alarm silme ve güncelleme + tarih zamanı eksik 
//sorunların birisi user_id den kim giriş yaptı kim kullanıyor onu bulmam gerek  o da ilk girerken alıyoruz daha sonra onu global
//olarak tanımlamamız gerek ki o user_id den sorguları yapalım aile üyesi ekleyelim



use crate::routes::{login, signup, alarm_ekle, alarm_guncelle, alarm_sil, alarm_listele};
use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use serde::{Deserialize, Serialize}; // Serialize ve Deserialize tek import satırında
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;

use crate::verimodelleri::{LoginRequest,AuthResponse,User,RegisterRequest,AlarmRequest,Alarm};

pub async fn start_server(pool: PgPool) -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("192.168.108.108:3000").await?;
    println!("Sunucu  doğru portunda çalışıyor...");

    loop {
        let (mut socket, _) = listener.accept().await?;
        let pool = pool.clone();

        tokio::spawn(async move {
            let mut buffer = [0u8; 4096];
            let bytes_read = match socket.read(&mut buffer).await {
                Ok(0) => return,
                Ok(n) => n,
                Err(e) => {
                    eprintln!("Soket okuma hatası: {}", e);
                    return;
                }
            };

            let request = String::from_utf8_lossy(&buffer[..bytes_read]);
            println!("Gelen istek:\n{}", request);

            let (response_status, response_body, content_type) =
                if request.starts_with("POST /api/login") {
                    login::handle_login(&request, &pool).await

                }
                else if request.starts_with("POST /api/signup") {
                    signup::handle_signup(&request, &pool).await
                }
                else if request.starts_with("POST /api/alarmEkle") {
                    alarm_ekle::handle_alarm_ekle(&request, &pool).await
                }
                else if request.starts_with("POST /api/alarmSil"){
                    // Alarm silme mantığı buraya gelecek
                    (
                        "HTTP/1.1 501 Not Implemented",
                        serde_json::to_string(&AuthResponse {
                            success: false,
                            message: "Alarm Silme endpoint'i henüz uygulanmadı.".to_string(),
                            user_id: None,
                        }).unwrap(),
                        "application/json"
                    )
                }
                else if request.starts_with("POST /api/alarmGuncelle"){
                    // Alarm güncelleme mantığı buraya gelecek
                    (
                        "HTTP/1.1 501 Not Implemented",
                        serde_json::to_string(&AuthResponse {
                            success: false,
                            message: "Alarm Güncelleme endpoint'i henüz uygulanmadı.".to_string(),
                            user_id: None,
                        }).unwrap(),
                        "application/json"
                    )
                }
                else if request.starts_with("GET /api/alarmlariListele") {
                    println!("Alarmlar listeleme isteği alındı");

                    // Parse user_id from query params
                    let user_id = request.split('?')
                        .nth(1)
                        .and_then(|query| {
                            query.split('&')
                                .find(|param| param.starts_with("user_id="))
                                .and_then(|param| param.split('=').nth(1))
                                .and_then(|id| id.parse::<i32>().ok())
                        });
                    let query = match user_id {
                        Some(id) => {
                            sqlx::query_as::<_, Alarm>(
                                r#"
                                SELECT * FROM alarms 
                                WHERE kullanici_id = $1 AND aktif_mi = true
                                ORDER BY baslangic_tarihi, saat
                                "#
                            )
                            .bind(id)
                        },
                        None => {
                            sqlx::query_as::<_, Alarm>(
                                r#"
                                SELECT * FROM alarms 
                                WHERE aktif_mi = true
                                ORDER BY baslangic_tarihi, saat
                                "#
                            )
                        }
                    };

    match query.fetch_all(&pool).await {
        Ok(alarmlar) => (
            "HTTP/1.1 200 OK",
            serde_json::to_string(&alarmlar).unwrap(),
            "application/json"
        ),
        Err(e) => {
            eprintln!("Veritabanı sorgu hatası: {}", e);
            (
                "HTTP/1.1 500 Internal Server Error",
                serde_json::to_string(&AuthResponse {
                    success: false,
                    message: "Veritabanı hatası".to_string(),
                    user_id: None,
                }).unwrap(),
                "application/json"
            )
        }
    }
}
                else {
                    (
                        "HTTP/1.1 404 Not Found",
                        serde_json::to_string(&AuthResponse {
                            success: false,
                            message: "Bilinmeyen rota.".to_string(),
                            user_id: None,
                        }).unwrap(),
                        "application/json"
                    )
                };

            let response = format!(
                "{}\r\nAccess-Control-Allow-Origin: *\
                \r\nAccess-Control-Allow-Methods: POST, OPTIONS, GET\
                \r\nAccess-Control-Allow-Headers: Content-Type\
                \r\nContent-Type: {}\r\nContent-Length: {}\r\n\r\n{}",
                response_status,
                content_type,
                response_body.len(),
                response_body
            );

            if let Err(e) = socket.write_all(response.as_bytes()).await {
                eprintln!("Yazma hatası: {}", e);
            }
        });
    }
}