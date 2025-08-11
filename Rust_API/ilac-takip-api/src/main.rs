// src/main.rs
mod server;
mod db; // db.rs modülünüz varsayıldı
mod routes;
mod verimodelleri;

use sqlx::{postgres::PgPoolOptions, PgPool};
use dotenv::dotenv; // dotenvy yerine dotenv
use std::time::Duration;


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok(); // .env dosyasını yükle

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&database_url)
        .await?;

    println!("Veritabanı bağlantısı başarılı!");

    // Düzeltilen kısım: `start_server` olarak çağır
    server::start_server(pool).await?;

    Ok(())
}