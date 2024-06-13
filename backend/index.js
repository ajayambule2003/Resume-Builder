const express =require('express')
const cors=require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const connectdb =require('./config/db')
const authRoutes = require('./routes/authRoutes');
const router = require('./routes/routes');
const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', router);
app.use('/api/auth', authRoutes);
const PORT=8080 || process.env.PORT

connectdb().then(()=>{
app.listen(PORT,()=>{
    console.log("connect to db")
    console.log(`server is running on ${PORT}`);
})
})