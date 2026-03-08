
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../Database/db.js";


const allowedRoles = ["student", "teacher"];

export const userRegister = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create users"
            });
        }

        const { name, email, password } = req.body;
        const role = req.body.role?.toLowerCase();

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email=$1",
            [email]
        );

        if (existingUser.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)",
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




export const userLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const user = await pool.query(
            "SELECT id,name,email,password_hash,role FROM users WHERE email=$1",
            [email]
        );

        if (user.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const dbUser = user.rows[0];

        const match = await bcrypt.compare(password, dbUser.password_hash);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: dbUser.id,
                role: dbUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};




export const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




export const updateUser = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update users"
            });
        }

        const { id } = req.params;
        const { name, email, password } = req.body;
        const role = req.body.role?.toLowerCase();

        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const user = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [id]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let hashPassword = user.rows[0].password_hash;

        if (password) {
            hashPassword = await bcrypt.hash(password, 10);
        }

        if (email) {
            const emailCheck = await pool.query(
                "SELECT id FROM users WHERE email=$1 AND id<>$2",
                [email, id]
            );

            if (emailCheck.rowCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }
        }

        const result = await pool.query(
            `UPDATE users
       SET name=$1,email=$2,password_hash=$3,role=$4
       WHERE id=$5
       RETURNING id,name,email,role`,
            [
                name || user.rows[0].name,
                email || user.rows[0].email,
                hashPassword,
                role || user.rows[0].role,
                id
            ]
        );

        res.json({
            success: true,
            message: "User updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};




export const deleteUser = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete users"
            });
        }

        const { id } = req.params;

        if (req.user.id === Number(id)) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot delete himself"
            });
        }

        const user = await pool.query(
            "SELECT id FROM users WHERE id=$1",
            [id]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await pool.query(
            "DELETE FROM users WHERE id=$1",
            [id]
        );

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};



export const getAllUsers = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view users"
            });
        }

        const users = await pool.query(
            "SELECT id,name,email,role FROM users ORDER BY id"
        );

        res.json({
            success: true,
            users: users.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};




export const getUserById = async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view users"
            });
        }

        const { id } = req.params;

        const user = await pool.query(
            "SELECT id,name,email,role FROM users WHERE id=$1",
            [id]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: user.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};