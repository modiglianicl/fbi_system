import { addUserQuery,verifyUserQuery } from "../models/userQueries.js";
import { check , validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

let secretKey = process.env.JWT_SECRET_KEY;


let home = (req,res) => {
    res.render('home' , {
        title : "home page"
    })
};

let loginForm = (req,res) => {
    res.render("login",{
        title :  "Login Page"
    })
};

let registerForm = (req,res) => {
    res.render("register",{
        title : "Register"
    })
};

let contactForm = (req,res) => {
    res.render("contact",{
        title : "Contact Page"
    })
}

let admin = (req,res) => {
    try {
            // verificar token
            let token = req.cookies.jwtToken;
            let { email } = jwt.verify(token,secretKey);
            console.log(email)
            if(!email) {
                return new Error("Not authorized.")
            }
        
            res.render("admin",{
                title : "Admin Page",
                email
            })
    } catch (error) {
        console.log(error)
        console.log(error.code)
        console.log(error.message)
        res.status(500).send(error.message);
    }
}

let addUser = async (req, res) => {
    try {
      //recibimos los datos del formulario
      const { name, email, password, confirm_password } = req.body;
  
      //validamos password
      await check("name").notEmpty().withMessage("Nombre es requerido").run(req);
      await check("email").isEmail().withMessage("Email es requerido").run(req);
      await check("password").isLength({ min: 6}).withMessage("La contraseña debe ser minimo 6 caracteres").run(req);
      await check("confirm_password").equals(password).withMessage("Las contraseñas no coinciden").run(req);
  
  
  
      const errors = validationResult(req);
  //Si hay errores devolver
   if (!errors.isEmpty()) {
    return res.render("register", {
      title: "Register Page",
      errors: errors.array(),
      old: req.body
    })
  }
  
      //Verificacion
      const userVerify = await verifyUserQuery(email);
      if (userVerify) {
        res.render("register", {
          title: "Register Page",
          errors: [{ msg: "El correo ya se encuentra registrado" }],
        })
      }
  
      //Hashear el password
      const passwordHash = await bcrypt.hash(password, 10);
  
      //Guardar en la BBDD
      await addUserQuery(name, email, passwordHash);
      res.status(201).redirect("/login");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

let login = async(req,res) => {
    try {
        let { email , password } = req.body;
        // Verificar que existe
        let userVerify = await verifyUserQuery(email);
        if (!userVerify) {
            return  res.status(400).send("User not found.")
        }

        // Crear token
        let token = jwt.sign({email : userVerify.email},secretKey, {
            expiresIn: 60
        });

        res.cookie("jwtToken",token,{
            httpOnly: true,
            maxAge : 40000
        }).redirect("/admin");

    } catch (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        res.status(500).send(error.message);
    }
}

export {
    home,
    loginForm,
    registerForm,
    contactForm,
    admin,
    addUser,
    login
}