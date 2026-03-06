import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import './Database/db.js';
import userRoutes from './Routes/userRouters.js';
import secRouters from './Routes/sectionRouter.js';
import TeacherRouter from './Routes/teacherRouter.js';
import StudentRouter from './Routes/studentRouter.js';
import ClassRoomRouter from './Routes/classRoomRouter.js';
import timetableRouter from './Routes/timeTableRouter.js';
import subjectRouter from './Routes/subjectRouter.js';
const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 4000;



app.get('/', (req, res) => {
    res.json('Server Running successfully')
})
// user Router 
app.use('/api', userRoutes);
// section Router
app.use('/sec', secRouters);
//  teacher Router
app.use('/teacher', TeacherRouter);
//  Student Router
app.use('/student', StudentRouter);
//  classRoom Router
app.use('/classRoom', ClassRoomRouter);
//  timetable Router
app.use('/timeTable', timetableRouter);
//  timetable Router
app.use('/subject', subjectRouter);


app.listen(PORT, () => {
    console.log(`Server Running On http://localhost:${PORT}`);
})
