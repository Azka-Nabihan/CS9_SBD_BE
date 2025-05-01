const express = require("express");
const multer = require("multer");
const router = express.Router();
const storeController = require("../controllers/storeController");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint untuk menghapus data item berdasarkan ID
router.delete("/item/:id", storeController.deleteItem);

router.get("/item/byId/:id", storeController.getItemById);

router.put("/item", upload.single("image"), storeController.updateItem);

// Endpoint untuk mendapatkan semua data item
router.get("/item", storeController.getAllItems);

// Endpoint untuk upload image
router.post("/item/create", upload.single("image"), storeController.uploadImage);

// Endpoint untuk mendapatkan semua data toko
router.get("/store/getAll", storeController.getAllStores);

// Endpoint untuk membuat toko baru
router.post("/store/create", storeController.createStore);

// Endpoint untuk Mengambil data store berdasarkan ID
router.get("/store/:id", storeController.getStoreById);

// Endpoint untuk mengupdate data toko
router.put("/store/:id", storeController.updateStore);

// Endpoint untuk mendelete data toko
router.delete("/store/:id", storeController.deleteStore);

// Endpoint untuk membuat user baru
router.post("/user/register", storeController.createUser);

// Endpoint untuk login user
router.post("/user/login", storeController.loginUser);

// Endpoint untuk mendapatkan data user berdasarkan email
router.get("/user/:email", storeController.getUserByEmail);

// Endpoint untuk mengupdate data user berdasarkan ID
router.put("/user", storeController.updateUser);

// Endpoint untuk menghapus user berdasarkan ID
router.delete("/user/:id", storeController.deleteUser);

// Endpoint untuk top up balance
router.post("/user/topUp", storeController.topUpBalance);

// Endpoint untuk membuat transaksi baru 
router.post("/transaction/create", storeController.createTransaction);

// Endpoint untuk mendapatkan data transaksi berdasarkan ID
router.post("/transaction/pay/:id", storeController.payTransaction);

// Endpoint untuk menghapus transaksi berdasarkan ID
router.delete("/transaction/:id", storeController.deleteTransaction);

module.exports = router;