const express = require("express");
const { pool, testConnection } = require('./database');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Local API çalışıyor!" });
});

// Veritabanı bağlantı testi
app.get("/db-test", async (req, res) => {
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            res.json({ 
                success: true, 
                message: "MariaDB bağlantısı başarılı!",
                server: "python02-host-cl.turkticaret.net"
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Veritabanı bağlantısı başarısız!" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Bağlantı hatası: " + error.message 
        });
    }
});

// Örnek veritabanı sorgusu
app.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users LIMIT 10');
        res.json({ 
            success: true, 
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Sorgu hatası: " + error.message 
        });
    }
});

// Kullanıcı ekleme
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Ad ve email zorunlu!"
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, created_at) VALUES (?, ?, NOW())',
            [name, email]
        );

        res.json({
            success: true,
            message: "Kullanıcı başarıyla eklendi!",
            userId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Kullanıcı ekleme hatası: " + error.message
        });
    }
});

app.post("/hello", (req, res) => {
    const { name } = req.body;
    res.json({ welcome: `Merhaba ${name}` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log("Sunucu port:", PORT);
    console.log("🚀 Server başlatılıyor...");
    
    // Uygulama başladığında veritabanı bağlantısını test et
    const isConnected = await testConnection();
    if (isConnected) {
        console.log("📊 Veritabanı hazır!");
    } else {
        console.log("⚠️  Veritabanı bağlantı problemi!");
    }
    
    console.log("📡 API Endpoints:");
    console.log("  GET  /         - Ana sayfa");
    console.log("  GET  /db-test  - DB bağlantı testi");
    console.log("  GET  /users    - Kullanıcıları listele");
    console.log("  POST /users    - Yeni kullanıcı ekle");
});
