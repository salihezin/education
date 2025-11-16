const mysql = require('mysql2/promise');
require('dotenv').config();

// Veritabanı bağlantı havuzu oluştur
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4',
    ssl: false // cPanel için SSL'i devre dışı bırak
});

// Bağlantı test fonksiyonu
const testConnection = async () => {
    try {
        console.log('🔄 Veritabanı bağlantısı test ediliyor...');
        console.log('📍 Host:', process.env.DB_HOST);
        console.log('👤 User:', process.env.DB_USER);
        console.log('🗃️  Database:', process.env.DB_NAME);
        
        const connection = await pool.getConnection();
        
        // Veritabanını seç ve test sorgusu çalıştır
        const [result] = await connection.execute('SELECT 1 as test');
        console.log('✅ MariaDB bağlantısı başarılı!');
        console.log('🎯 Test sonucu:', result);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Veritabanı bağlantı hatası:');
        console.error('   Hata kodu:', error.code);
        console.error('   Hata mesajı:', error.message);
        console.error('   SQL State:', error.sqlState);
        return false;
    }
};

module.exports = {
    pool,
    testConnection
};