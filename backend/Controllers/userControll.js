import { pool } from "../Database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const userRegister = async (req, res) => {
    const { name, email, password, role } = req.body

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin cannot create another admin"
            });
        }
        const user = await pool.query("SELECT email From users WHERE email=$1", [email]);
        if (user.rowCount > 0) {
            return res.status(409).json({success:false, message: "user already exist" });
        }
        
        const hashPassword = await bcrypt.hash(password ,10);

        const result = await pool.query(
            "INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4)",
            [name, email, hashPassword, role]
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
}

export const userLogin = async (req, res) => {
    const {  email, password } = req.body

    try {
        const user = await pool.query(
            "SELECT id, name, email, password_hash, role FROM users where email=$1",
            [email]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({success:false, message: "user not found" });
        }
    
        const dbUser = user.rows[0];

        const match = await bcrypt.compare(password, dbUser.password_hash);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
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
            secure: false,
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
}

export const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
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