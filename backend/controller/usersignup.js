const usermodel = require("../models/usermodel");
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function usersignupcontroller(req, res) {
    try {
        const { email, password, name ,profilepic} = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                message: "Please provide email, password, and name",
                error: true,
                success: false,
            });
        }
        
     
        console.log('User input:', { email, name });

        const Password = await hashPassword(password);
        
        const payload = {
            email,
            password: Password,
            name,
            profilepic
        };

     
        console.log('Payload before saving:', payload);

        const userData = new usermodel(payload);
        const savedUser = await userData.save();

        res.status(201).json({
            data: savedUser,
            success: true,
            error: false,
            message: "User created successfully",
        });
    } catch (err) {
      
        console.error('Error during user signup:', err);

        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

module.exports = { usersignupcontroller };
