        //alarm_listele.rs
        use serde::Serialize;
        use sqlx::PgPool;


        use crate::verimodelleri::{AlarmResponse};

        pub async fn alarmlari_listele(request: &str, pool: &PgPool) -> (&'static str, String, &'static str) {
            println!("Alarm Listele isteği alındı");
            

            
            let user_id_opt = request.split('?')
        .nth(1)
        .and_then(|query| {
            query.split('&')
                .find_map(|param| {
                    let mut parts = param.split('=');
                    if let (Some(key), Some(value)) = (parts.next(), parts.next()) {
                        if key == "user_id" {
                            return value.parse::<i32>().ok();
                        }
                    }
                    None
                })
        });

    let user_id = match user_id_opt {
        Some(id) => id,
        None => {
            return (
                "HTTP/1.1 400 Bad Request",
                // Hata mesajını user_id parametresiyle ilgili olacak şekilde güncelledim
                "{\"success\":false,\"message\":\"Missing or invalid user_id parameter.\"}".to_string(),
                "application/json"
            );
        }
    };
             println!("Backend'de işlenen user_id: {}", user_id);
            // SQL sorgusu
            let result = sqlx::query_as!(
                AlarmResponse,
                    r#"
                        SELECT
                        alarm_id,
                        kullanici_id,
                        ilac_adi,
                        doz,
                        tekrar_tipi,
                        pazartesi,
                        sali,
                        carsamba,
                        persembe,
                        cuma,
                        cumartesi,
                        pazar,
                        gun,
                        baslangic_tarihi,
                        saat,
                        aktif_mi          
                    FROM
                        alarms
                    WHERE
                        kullanici_id = $1
                    ORDER BY
                        alarm_id DESC
                        "#,
                user_id
            )
            .fetch_all(pool)
            .await;

            match result {
                Ok(alarmlar) => (
                    "HTTP/1.1 200 OK",
                    serde_json::to_string(&alarmlar).unwrap_or_else(|_| "[]".to_string()),
                    "application/json"
                ),
                Err(e) => {
                    eprintln!("Veritabanı hatası: {:?}", e);
                    (
                        "HTTP/1.1 500 Internal Server Error",
                        "{\"success\":false,\"message\":\"Database error.\"}".to_string(),
                        "application/json"
                    )
                }
            }
        }
