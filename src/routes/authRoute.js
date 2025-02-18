import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, username, password, gender } = req.body;

        
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                gender
            }
        });

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                gender: newUser.gender
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

       
        const payload = {
            userId: user.id,
            email: user.email,
            username: user.username,
        };

        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token: token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
