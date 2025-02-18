import express from 'express';
import { PrismaClient } from '@prisma/client';
import { middleware } from '../middleware/authMiddleware.js';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const router = express.Router();

router.get("/profile", middleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      email: user.email,
      username: user.username,
      gender: user.gender,
      avatar_id: user.avatar_id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate", middleware, async (req, res) => {
  const { skills, domain, temperament } = req.body;

  try {
    if (!skills || !domain || !temperament) {
      return res.status(403).json({ message: "Params are missing" });
    }

    const prompt = `I am a skilled developer looking for an interview with skills ${skills.join(
      ', '
    )} looking for an interview in ${domain} with ${temperament} you have to generate 10 interview questions for this interview that are expected along with their answer`;

    
   const result= await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: process.env.MODEL,
      });
      return res.json(result)
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
});

export default router;