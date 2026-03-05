import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import './Database/db.js';
import userRoutes from './Routes/userRouters.js';
const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 4000;



app.get('/', (req, res) => {
    res.json('Server Running successfully')
})
app.use('/api', userRoutes);
app.listen(PORT, () => {
    console.log(`Server Running On http://localhost:${PORT}`);
})
