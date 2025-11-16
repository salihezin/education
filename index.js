const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Local API çalışıyor!" });
});

app.post("/hello", (req, res) => {
    const { name } = req.body;
    res.json({ welcome: `Merhaba ${name}` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Sunucu port:", PORT);
});
