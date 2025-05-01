require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes/storeRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Konfigurasi CORS 
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // middleware CORS
app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, this is the backend!');
});