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

app.listen(3000, () => {
    console.log("Local sunucu port 3000'de.");
});
