require('dotenv').config();
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const HomeRouter = require('./routes/HomeRouter');
const ApiRouter = require('./routes/ApiRouter');

require('./models/db');

const port = 9090 || process.env.PORT;

app.use(bodyparser.json());
app.use(express.json());    
app.use(cors({
    origin:`${process.env.FRONTEND_URL}`,
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));

app.use('/auth',AuthRouter);
app.use('/home',HomeRouter);
app.use('/api',ApiRouter);
app.listen(port,()=>{
    console.log(`successfully running on port ${port}`);
});
