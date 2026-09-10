import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

import pool from './db.js';

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

// =============================
// TEST SERVER
// =============================
app.get('/', (req, res) => {
    res.json({
        message: 'E-vent API is running'
    });
});

// =============================
// TEST DATABASE
// =============================
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS result');

        res.json({
            success: true,
            message: 'Database connected successfully',
            data: rows
        });
    } catch (error) {
        console.error('Database error:', error);

        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// =============================
// GET USERS
// =============================
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id,
                name,
                email,
                avatar,
                role,
                phone,
                department,
                created_at,
                updated_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Get users error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: error.message
        });
    }
});

// =============================
// CREATE USER
// =============================
app.post('/api/users', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
            department,
            avatar
        } = req.body;

        // Validasi data wajib
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Cek apakah email sudah digunakan
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Simpan user
        const [result] = await pool.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password_hash,
                avatar,
                role,
                phone,
                department
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                passwordHash,
                avatar || null,
                role || 'MEMBER',
                phone || null,
                department || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: result.insertId,
                name,
                email,
                role: role || 'MEMBER',
                phone: phone || null,
                department: department || null,
                avatar: avatar || null
            }
        });

    } catch (error) {
        console.error('Create user error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
});

// =============================
// UPDATE USER
// =============================
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            role,
            phone,
            department,
            avatar
        } = req.body;

        // Validasi data wajib
        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and role are required'
            });
        }

        // Cek apakah user yang akan diubah ada
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE id = ?',
            [id]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Cek apakah email sudah digunakan user lain
        const [emailUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, id]
        );

        if (emailUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered by another user'
            });
        }

        // Update user
        await pool.query(
            `
            UPDATE users
            SET
                name = ?,
                email = ?,
                role = ?,
                phone = ?,
                department = ?,
                avatar = ?
            WHERE id = ?
            `,
            [
                name,
                email,
                role,
                phone || null,
                department || null,
                avatar || null,
                id
            ]
        );

        // Ambil data terbaru
        const [updatedUsers] = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                avatar,
                role,
                phone,
                department,
                created_at,
                updated_at
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUsers[0]
        });

    } catch (error) {
        console.error('Update user error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
});

// =============================
// DELETE USER
// =============================
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah user ada
        const [existingUsers] = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [id]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = existingUsers[0];

        // Jangan hapus user ADMIN
        if (user.role === 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'ADMIN user cannot be deleted'
            });
        }

        // Hapus user
        await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Delete user error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

// =============================
// CREATE LOGIN
// =============================

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }

        // Cari user berdasarkan email
        const [rows] = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                password_hash,
                avatar,
                role,
                phone,
                department,
                created_at,
                updated_at
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        // User tidak ditemukan
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        const user = rows[0];

        // Cek password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Jangan kirim password_hash ke frontend
        delete user.password_hash;

        return res.json({
            success: true,
            message: 'Login berhasil',
            data: user
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});