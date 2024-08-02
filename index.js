
import dotenv from 'dotenv';
import authRoutes from './routes/Authroutes.js';
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
app.use('/api/auth', authRoutes);

