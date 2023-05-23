import express from "express";
import User from "../models/user.js";
import Joi from "@hapi/joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import IBAN from "iban";
// import betterdni from "better-dni";

const router = express.Router();

// Esquema del login
const schemaLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "es"] } })
    .required()
    .messages({
      "any.required": `El campo email es requerido`,
      "string.empty": `El campo email no puede estar vacío`,
      "string.email": `El campo email no es válido`,
    }),
  password: Joi.string().min(6).required().messages({
    "any.required": `El campo contraseña es requerido`,
    "string.empty": `El campo contraseña no puede estar vacío`,
    "string.base": `El campo contraseña tiene que ser de tipo texto`,
    "string.min": `El campo contraseña tiene que ser mínimo de {#limit} carácteres`,
  }),
});

// Esquema del registro
const schemaRegister = Joi.object({
  dni: Joi.string().min(9).max(9).required(),
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": `El campo nombre es requerido`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "string.base": `El campo nombre tiene que ser de tipo texto`,
    "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "es"] } })
    .required()
    .messages({
      "any.required": `El campo email es requerido`,
      "string.empty": `El campo email no puede estar vacío`,
      "string.email": `El campo email no es válido`,
    }),
  password: Joi.string().min(6).required().messages({
    "any.required": `El campo contraseña es requerido`,
    "string.empty": `El campo contraseña no puede estar vacío`,
    "string.base": `El campo contraseña tiene que ser de tipo texto`,
    "string.min": `El campo contraseña tiene que ser mínimo de {#limit} carácteres`,
  }),
  fechaNacimiento: Joi.string().required().messages({
    "any.required": `El campo fechaNacimiento es requerido`,
    "string.empty": `El campo fechaNacimiento no puede estar vacío`,
  }),
  fechaInscripcion: Joi.string().required().messages({
    "any.required": `El campo fechaInscripcion es requerido`,
    "string.empty": `El campo fechaInscripcion no puede estar vacío`,
  }),
  membresia: Joi.string().required().messages({
    "any.required": `La membresia es requerido`,
    "string.empty": `La membresia no puede estar vacía`,
    "string.base": `La membresia tiene que ser de tipo texto`,
  }),
  numIban: Joi.string().max(24).required().messages({
    "any.required": `El numIban es requerido`,
    "string.empty": `El numIban no puede estar vacía`,
    "string.base": `El numIban tiene que ser de tipo texto`,
  }),
});

//LOGIN USER
router.post("/login", async (req, res) => {
  try {
    // Validaciones de login
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Validacion y existencia
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    // Validacion de password en la base de datos
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Constraseña incorrecta" });

    // Creando token
    jwt.sign({ user: user }, process.env.TOKEN_SECRET, async (err, token) => {
      res.json({
        user: user,
        token: token,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  // Validaciones del registro
  const { error } = schemaRegister.validate(req.body);
  //Mando un error
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //Validación del ni
  const dniExist = await User.findOne({ dni: req.body.dni });
  if (dniExist) {
    return res.status(400).json({ error: "Dni ya registrado" });
  }
  //Validación del correo
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email ya registrado" });
  }

  //Validación del iban
  const ibanIsValid = IBAN.isValid(req.body.numIban);
  if (!ibanIsValid) {
    return res.status(400).json({ error: "El iban es no es válido" });
  }

  //Encripto la contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //Usuario a registrar
  const user = new User({
    dni: req.body.dni,
    name: req.body.name,
    email: req.body.email,
    password: password,
    fechaNacimiento: req.body.fechaNacimiento,
    fechaInscripcion: req.body.fechaInscripcion,
    membresia: req.body.membresia,
    numIban: req.body.numIban,
  });

  try {
    const savedUser = await user.save();
    res.json({
      error: null,
      data: savedUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

export default router;
