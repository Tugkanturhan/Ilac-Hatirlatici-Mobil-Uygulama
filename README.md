# Yaşlı ve Hastalar için İlaç Takip Sistemi

Bu proje, yaşlı ve hastaların ilaçlarını zamanında almalarını sağlamak için basit bir kullanıcı 
arayüzü (UI) ile alarm kurup hatırlatma yapan bir sistemdir.Aynı zamanda hasta yakınları ve bakım elemanlarının 
ilaç takibini kolaylaştırmak amacıyla geliştirilmiştir.  

Projeye aktif olarak devam ediyorum, bu nedenle bazı eksiklikler olabilir.

---

## Kullanılan Teknolojiler

- **React Native Expo**  
  Mobil uygulama geliştirmeyi hızlandırmak ve hem iOS hem Android platformlarına tek kod 
  tabanı ile destek vermek için tercih ettim. Expo, geliştirme sürecini kolaylaştıran hazır araçlar sunuyor.

- **JavaScript**  
  React Native ile uyumlu ve geniş ekosistemi olan dinamik bir dil olduğu için seçtim. Hızlı 
  prototipleme ve topluluk desteği avantajları var.

- **Rust**  
  Performans ve güvenlik gerektiren backend servisleri için Rust’ı kullandım. Hafıza yönetimi
   ve hız açısından C++ gibi dillerle yarışıyor, ancak modern sözdizimi ile daha güvenli ve verimli.
    Özellikle API ve veri tabanı işlemlerinde hata yapma ihtimalini azaltıyor.

- **PostgreSQL**  
  JSON destekleyerek esnek veri yapılarıyla çalışmaya imkan veriyor. İleri seviye SQL desteği, 
  güçlü veri bütünlüğü ve gelişmiş sorgulama yetenekleri sunuyor. Ücretsiz ve açık kaynak.

---

## Backend ve REST API

Projenin backend kısmı Rust dili ile geliştirilmiştir.  

Backend kısmı Rust ile yazıldı ve REST API şeklinde çalışıyor. Yani mobil uygulama 
gibi istemciler, HTTP üzerinden JSON formatında veri gönderip alıyor. Bu sayede frontend 
ile backend arasında hızlı ve anlaşılır bir iletişim sağlanıyor.

---

## Veri Tabanı Tabloları ve ER Diyagramı

**users** tablosu:  
- user_id (PK)  
- kullanıcı_adi (varchar)  
- ad (varchar)  
- soyad (varchar)  
- email (varchar)  
- sifre (hashlenmiş, varchar)  
- rol (varchar)  
- kayit_tarihi (timestamp)  

**medications** tablosu:  
- ilac_id (PK)  
- ilac_adi (varchar)  
- doz (varchar)  
- kullanim_talimatı (text)  

**alarms** tablosu:  
- alarm_id (PK)  
- user_id (FK)  
- ilac_adi (varchar)  
- doz (varchar)  
- tekrar (varchar)  
- pazartesi, sali, carsamba, persembe, cuma, cumartesi, pazar (boolean)  
- baslangic_tarihi (date)  
- saat (time)  
- aktif_mi (boolean)  
- notlar (text, opsiyonel)  

**user_relations** tablosu:  
- relation_id (PK)  
- user_id (FK)  
- related_user_id (FK)  
- iliski_tipi (varchar)  

**medication_logs** tablosu:  
- log_id (PK)  
- alarm_id (FK)  
- alim_zamani (timestamp)  
- durum (varchar)  

---

## Design Pattern

Bu projede Model-View-ViewModel (MVVM) tasarım desenini kullandım.  

MVVM, kodun okunabilirliğini, sürdürülebilirliğini ve test edilebilirliğini artırmak 
için ideal bir yaklaşımdır. Özellikle karmaşık kullanıcı arayüzü (UI) içeren uygulamalarda tercih edilir.

---

## Kurulum ve Çalıştırma

1. İlk olarak iki terminal penceresi açın.

2. **Birinci terminalde:**  
   1- cd ilac-takip
   2- npx expo start

3. İkinci terminalde ise bunları yazın
    1- cd ilac-takip/Rust_API/ilac-takip-api
    2- cargo run

---



## Ekran Resimi 1
<img width="1909" height="1079" alt="TerminalEkrani1" src="https://github.com/user-attachments/assets/c246b230-16d6-4b07-bbf0-781e228aa422" />
## Ekran Resimi 2 
<img width="1916" height="1079" alt="TerminalEkrani2" src="https://github.com/user-attachments/assets/102ae72c-eeb1-40e8-8d14-5dff46bc8201" />
## Ekran Resimi 3
<img width="1919" height="1079" alt="TerminalEkrani3" src="https://github.com/user-attachments/assets/3ba00524-43ef-4ce1-89a6-7a3e8d3cbd66" />
## Ekran Resimi 4
<img width="1919" height="1079" alt="TerminalEkrani4" src="https://github.com/user-attachments/assets/e10a31e7-23aa-4ce6-80a6-e1df908020e8" />
## Ekran Resimi 5
<img width="1919" height="1072" alt="TerminalEkrani5" src="https://github.com/user-attachments/assets/4745e1d7-ca5d-4b00-9a31-586bd7f8001b" />


