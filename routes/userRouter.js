import { Router } from 'express';
import { home,loginForm,registerForm,contactForm,admin,addUser,login } from '../controllers/userController.js';

let userRouter = Router()

userRouter.get('/',home)
userRouter.get('/login',loginForm)
userRouter.get('/contact',contactForm)
userRouter.get('/admin',admin)
userRouter.get('/register',registerForm)
userRouter.post('/register',addUser)
userRouter.post('/login',login)



userRouter.get('*',(req,res) => {
    res.send('404!')
})

export {
    userRouter
}