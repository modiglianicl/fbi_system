import express from 'express';
import 'dotenv/config';
import { userRouter } from "./routes/userRouter.js";
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';

let app = express()
let PORT = process.env.PORT || 3000;

// Public static
app.use(express.static('public'))

// Motor
app.engine('hbs',engine({
    extname : '.hbs'
}));
app.set('view engine','hbs');
app.set('views','./views')

// Middlewares
app.use(express.urlencoded( {extended:true} ))
app.use(cookieParser())

// Rutas
app.use('/',userRouter)


app.listen(PORT,()=> {
    console.log(`Server UP on http://localhost:${PORT}`)
})