//db.rs

use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use dotenv::dotenv;
use std::env;

// Bu fonksiyon dışa açık olmalı (pub), böylece main.rs çağırabilir
pub async fn connect() -> Result<PgPool, sqlx::Error> {
    dotenv().ok(); // .env dosyasını yükle
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL not set");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    Ok(pool)
}
