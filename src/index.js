const express = require("express");
const cors = require("cors");
const storeRoutes = require("./routes/storeRoutes");

const app = express();      // Membuat instance aplikasi express

app.use(cors());        // mengaktifkan cors untuk semua route
app.use(express.json());        // mengaktifkan request body json
app.use("/api", storeRoutes);       // menggunakan route storeRoutes dengan prefix /api pada setiap route

module.exports = app;       // export app agar bisa diakses dari file lain