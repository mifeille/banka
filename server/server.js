import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes/myRoutes';
import v2Routes from './routes/v2Routes';


dotenv.config();


const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/api/v1/', apiRoutes);
app.use('/api/v2/', v2Routes);


const port=process.env.PORT||3050;


const server=app.listen(port, ()=>console.log(`The server is listening on port ${port}`));

module.exports = server
