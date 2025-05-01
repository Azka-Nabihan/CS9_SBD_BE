const storeRepository = require('../repositories/storeRepositories');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');   // Untuk hash password
const stream = require('stream');   // // Untuk upload image

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Controller untuk menambah item baru
exports.updateItem = async (req, res) => {
    const { id, name, price, store_id, stock } = req.body;

    if (!id || !name || !price || !store_id || !stock) {
        return res.status(400).json("Missing required fields: id, name, price, store_id, or stock");
    }

    try {
        let imageUrl = req.body.image_url;

        if (req.file) {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            const cloudinaryResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                bufferStream.pipe(uploadStream);
            });

            imageUrl = cloudinaryResponse.secure_url;
        }

        const item = await storeRepository.updateItem(
            id,
            name,
            price,
            store_id,
            imageUrl,
            stock
        );

        if (item) {
            res.json({
                success: true,
                message: 'Item updated',
                payload: item
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'store doesnt exist found',
                payload: null
            });
        }
    } catch (err) {
        console.error("Error during item update:", err);
        res.status(500).json({
            success: false,
            message: 'store doesnt exist found',
            payload: null
        });
    }
};

// Controller untuk mengupdate data item berdasarkan ID
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await storeRepository.deleteItem(id);
        if (item) {
            res.json({
                success: true,
                message: 'Item deleted',
                payload: item
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Item not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await storeRepository.getAllItems();
        res.json({
            success: true,
            message: 'Items found',
            payload: items
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadImage = async (req, res) => {
    const { name, price, store_id, stock } = req.body;

    if (!req.file) {
        return res.status(400).json("Missing image file");
    }

    if (!name || !price || !store_id || !stock) {
        return res.status(400).json("Missing required fields: name, price, store_id, or stock");
    }

    try {
        // Periksa apakah store_id ada
        const store = await storeRepository.getStoreById(store_id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'store doesnt exist',
                payload: null
            });
        }

        console.log("Starting image upload...");

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        const cloudinaryResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            bufferStream.pipe(uploadStream);
        });

        console.log("Image uploaded to Cloudinary:", cloudinaryResponse);

        const item = await storeRepository.createItem(
            name,
            price,
            store_id,
            cloudinaryResponse.secure_url,
            stock
        );

        console.log("Item created in database:", item);

        res.json({
            success: true,
            message: 'Item created',
            payload: item
        });
    } catch (err) {
        console.error("Error during image upload or item creation:", err);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            payload: null
        });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await storeRepository.getItemById(id);
        if (item) {
            res.json({
                success: true,
                message: 'Item found',
                payload: item
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Item not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller untuk mengambil semua data toko
exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        res.json({
            success: true,
            message: 'Stores found',
            payload: stores
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Controller untuk menambah toko baru
exports.createStore = async (req, res) => {
    try {
        const { name, address } = req.body;
        const newStore = await storeRepository.createStore(name, address);
        res.status(201).json({
            success: true,
            message: 'Store created',
            payload: newStore
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'store doesnt exist',
            payload: null
        });
    }
};

// Controller untuk mengambil data toko berdasarkan ID
exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await storeRepository.getStoreById(id);
        if (store) {
            res.json({
                success: true,
                message: 'Store found',
                payload: store
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Store not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Controller untuk mengupdate data toko
exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;
        if (!id || !name || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing store ID, name, or address",
                payload: null
            });
        }

        const store = await storeRepository.updateStore(id, name, address);
        if (store) {
            res.json({
                success: true,
                message: 'Store updated',
                payload: store
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Store not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            payload: null
        });
    }
};

// Controller untuk menghapus toko
exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await storeRepository.deleteStore(id);
        if (store) {
            res.json({
                success: true,
                message: 'Store deleted',
                payload: store
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Store not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller untuk menambah user baru
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, balance } = req.body.name ? req.body : req.query;

        // Validasi input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing username, email, or password",
                payload: null
            });
        }

        // validasi format email menggunakan regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
                payload: null
            });
        }

        // Valiasi format password menggunakan regex
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters, 1 number, and 1 special character",
                payload: null
            });
        } 

        // Periksa apakah email sudah digunakan
        const existingUser = await storeRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already used",
                payload: null
            });
        }
        
        // Hash password sebelum menyimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user baru ke database
        const newUser = await storeRepository.createUser(name, email, hashedPassword, balance);
        res.status(201).json({
            success: true,
            message: 'User created',
            payload: newUser
        });

    } catch (error) {
        if (error.code === '23505') { // PostgreSQL error code for unique violation
            res.status(400).json({
                success: false,
                message: "Email already used",
                payload: null
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message,
                payload: null
            });
        }
    }
};

// Controller untuk login user
exports.loginUser = async (req, res) => {
    try {
        // Destructure email dan password dari query
        const { email, password } = req.body;

        // Validasi Input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password",
                payload: null
            });
        }

         // Ambil user berdasarkan email
         const user = await storeRepository.getUserByEmail(email);
         if (!user) {
             return res.status(401).json({
                 success: false,
                 message: "Invalid email or password",
                 payload: null
             });
        }

        // Bandingkan password yang di-hash dengan password dari request
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                payload: null
            });
        }
        
        // Jika password valid, kirimkan respons sukses
        res.json({
            success: true,
            message: "Login successful",
            payload: {
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            payload: null
        });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await storeRepository.getUserByEmail(email);
        if (user) {
            res.json({
                success: true,
                message: 'User found',
                payload: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            payload: null
        });
    }
};

// Controller untuk mengupdate data user berdasarkan ID
exports.updateUser = async (req, res) => {
    try {
        const { id, name, email, password } = req.body;

        // Validasi input
        if (!id || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing user ID, name, email, or password",
                payload: null
            });
        }

        // Validasi format email menggunakan regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
                payload: null
            });
        }

        // Valisasi format password menggunakan regex
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if(!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least 8 characters, 1 number, and 1 special character',
                payload: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await storeRepository.updateUser(id, name, email, hashedPassword);
        if (user) {
            res.json({
                success: true,
                message: 'User updated',
                payload: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            payload: null
        });
    }
};

// Controller untuk menghapus user berdasarkan ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await storeRepository.deleteUser(id);
        if (user) {
            res.json({
                success: true,
                message: 'User deleted',
                payload: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            payload: null
        });
    }
};

exports.topUpBalance = async (req, res) => {
    try {
        const { id, amount } = req.query;

        // Validasi Input
        const topUpAmount = parseInt(amount, 10);
        if (isNaN(topUpAmount) || topUpAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a valid number larger than 0",
                payload: null
            });
        }

        // Ambil data user
        const user = await storeRepository.getUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }

        // Update balance user
        const updatedBalance = user.balance + topUpAmount;
        await storeRepository.updateUserBalance(id, updatedBalance);

        // Respons berhasil
        res.status(200).json({
            success: true,
            message: "Top up successful",
            payload: {
                ...user,
                balance: updatedBalance
            }
        });
    } catch (error) {
        // Tangani error tak terduga
        console.error("Error in topUpBalance:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            payload: null
        });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { item_id, quantity, user_id } = req.body;

        // Validasi input
        if (!item_id || !quantity || !user_id) {
            return res.status(400).json({
                success: false,
                message: "Missing item_id, quantity, or user_id",
                payload: null
            });
        }

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be larger than 0",
                payload: null
            });
        }

        // Ambil data item berdasarkan item_id
        const item = await storeRepository.getItemById(item_id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }

        // Hitung total harga
        const total = item.price * parsedQuantity;

        // Simpan transaksi ke database
        const transaction = await storeRepository.createTransaction(user_id, item_id, parsedQuantity, total);

        res.status(201).json({
            success: true,
            message: "Transaction created",
            payload: transaction
        });
    } catch (error) {
        console.error("Error in createTransaction:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            payload: null
        });
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil data transaksi berdasarkan ID
        const transaction = await storeRepository.getTransactionById(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction failed to pay",
                payload: null
            });
        }

        // Periksa apakah transaksi sudah dibayar
        if (transaction.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Transaction already paid",
                payload: null
            });
        }

        // Ambil data user dan item terkait
        const user = await storeRepository.getUserById(transaction.user_id);
        const item = await storeRepository.getItemById(transaction.item_id);

        if (!user || !item) {
            return res.status(404).json({
                success: false,
                message: "User or item not found",
                payload: null
            });
        }

        // Periksa apakah saldo user cukup
        if (user.balance < transaction.total) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
                payload: null
            });
        }

        // Periksa apakah stok item cukup
        if (item.stock < transaction.quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
                payload: null
            });
        }

        // Kurangi saldo user dan stok item
        const updatedBalance = user.balance - transaction.total;
        const updatedStock = item.stock - transaction.quantity;

        await storeRepository.updateUserBalance(user.id, updatedBalance);
        await storeRepository.updateItemStock(item.id, updatedStock);

        // Ubah status transaksi menjadi "paid"
        const updatedTransaction = await storeRepository.updateTransactionStatus(id, "paid");

        res.status(200).json({
            success: true,
            message: "Payment successful",
            payload: updatedTransaction
        });
    } catch (error) {
        console.error("Error in payTransaction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to pay",
            payload: null
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil data transaksi berdasarkan ID
        const transaction = await storeRepository.getTransactionById(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                payload: null
            });
        }

        // Hapus transaksi dari database
        const deletedTransaction = await storeRepository.deleteTransaction(id);

        res.status(200).json({
            success: true,
            message: "Transaction deleted",
            payload: deletedTransaction
        });
    } catch (error) {
        console.error("Error in deleteTransaction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete transaction",
            payload: null
        });
    }
};