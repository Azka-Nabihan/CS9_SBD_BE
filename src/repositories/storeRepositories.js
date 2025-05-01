const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
});

// Update data item berdasarkan ID
exports.updateItem = async (id, name, price, store_id, image_url, stock) => {
    const result = await pool.query(
        "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *",
        [name, price, store_id, image_url, stock, id]
    );
    return result.rows[0];
};

exports.deleteItem = async (id) => {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Tambah item baru ke database
exports.createItem = async (name, price, store_id, image_url, stock) => {
    const result = await pool.query(
        "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, price, store_id, image_url, stock]
    );
    return result.rows[0];
};

// Ambil data item berdasarkan ID
exports.getItemById = async (id) => {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
};

// Ambil semua data item
exports.getAllItems = async () => {
    const result = await pool.query('SELECT * FROM items');
    return result.rows;
};

// Ambil semua data toko
exports.getAllStores = async () => {
    const result = await pool.query('SELECT * FROM stores');
    return result.rows;
}

// Tambah toko baru ke database
exports.createStore = async (name, address) => {
    const result = await pool.query(
        "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
        [name, address]
    );
    return result.rows[0];
};

// Ambil data toko berdasarkan ID
exports.getStoreById = async (id) => {
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    return result.rows[0];
}

// Update data toko berdasarkan ID
exports.updateStore = async (id, name, address) => {
    const result = await pool.query(
        "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
        [name, address, id]
    );
    return result.rows[0];
};

// Hapus data toko berdasarkan ID
exports.deleteStore = async (id) => {
    const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Nambah data users
exports.createUser = async (name, email, password, balance = 0) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password, balance]
    );
    return result.rows[0];
};

// Ambil data user berdasarkan email
exports.getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Ambil data user berdasarkan email dan password
exports.getUserByEmailAndPassword = async (email, password) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    return result.rows[0];
};

// Update data user berdasarkan ID
exports.updateUser = async (id, name, email, password) => {
    const result = await pool.query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
        [name, email, password, id]
    );
    return result.rows[0];
};

exports.deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Update balance user berdasarkan ID
exports.updateUserBalance = async (id, balance) => {
    const result = await pool.query(
        "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
        [balance, id]
    );
    return result.rows[0];
};

// Ambil data user berdasarkan ID
exports.getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

// Tambah transaksi baru ke database
exports.createTransaction = async (user_id, item_id, quantity, total) => {
    const result = await pool.query(
        `INSERT INTO transactions (user_id, item_id, quantity, total, status, created_at)
         VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING *`,
        [user_id, item_id, quantity, total]
    );
    return result.rows[0];
};

// Ambil data transaksi berdasarkan ID
exports.getTransactionById = async (id) => {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0];
};

// Update status transaksi
exports.updateTransactionStatus = async (id, status) => {
    const result = await pool.query(
        "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
    );
    return result.rows[0];
};

// Update stok item berdasarkan ID
exports.updateItemStock = async (id, stock) => {
    const result = await pool.query(
        "UPDATE items SET stock = $1 WHERE id = $2 RETURNING *",
        [stock, id]
    );
    return result.rows[0];
};

// Perbaiki implementasi deleteTransaction di controller
exports.deleteTransaction = async (id) => {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};