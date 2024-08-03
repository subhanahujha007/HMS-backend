
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
dotenv.config(
    {
        path:'./.env'
    }
);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8001, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
// Routes

import authRoutes from './routes/Authroutes.js';
import roomroutes from './routes/Roomroutes.js'
import { verifyJWT } from './middleware/verify-jwt.js';
import  patientroute from "./routes/patientroute.js"
import bedRoutes from "./routes/Bedroutes.js"
app.use('/api/auth', authRoutes);

app.use('/api/rooms',verifyJWT , roomroutes);
app.use('/api/beds', verifyJWT, bedRoutes); 
app.use('/api/patient',verifyJWT,patientroute)