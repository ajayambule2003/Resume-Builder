const usermodel = require("../models/usermodel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function usersignincontroller(req, res) {
    try {
        const { email, password,profilepic} = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: "Please provide email",
                error: true,
                success: false,
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "Please provide password",
                error: true,
                success: false,
            });
        }

        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const check = await bcrypt.compare(password, user.password);
        console.log("checkpassword", check);
        if (check) {
            const tokendata = {
                id: user.id,
                email: user.email,
            };
            const token = await jwt.sign(tokendata, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });
            res.cookie("token", token).json({
                message: "Login successful",
                data: {
                    token,
                    user: {
                        name: user.name,
                        email: user.email,
                        profilepic: user.profilepic 
                    }
                },
                success: true,
                error: false
            });
        } else {
            return res.status(401).json({
                message: "Invalid password",
                error: true,
                success: false,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
            error: true,
            success: false,
        });
    }
}

module.exports = { usersignincontroller };
