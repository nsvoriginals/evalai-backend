import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
    return res.send("Hello there");
});

app.listen(3000, () => {
    console.log("Server starting at port 3000");
});



