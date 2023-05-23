import express from "express";
import Personal from "../models/personal.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Esquema añadir personal
const schemaAddPersonal = Joi.object({
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
  cargo: Joi.string().valid("nutricionista", "entrenador", "admin").required(),
});

// Esquema del login del personal
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

//LOGIN STAFF
router.post("/login", async (req, res) => {
  try {
    // Validaciones de login
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Validacion y existencia
    const staff = await Personal.findOne({ email: req.body.email });
    if (!staff)
      return res.status(400).json({ error: "Personal no encontrado" });

    // Validacion de password en la base de datos
    const validPassword = await bcrypt.compare(
      req.body.password,
      staff.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Constraseña incorrecta" });

    // Creando token
    jwt.sign({ staff: staff }, process.env.TOKEN_SECRET, (err, token) => {
      res.json({
        staff: staff,
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
  const { error } = schemaAddPersonal.validate(req.body);
  //Mando un error
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //Validación del dni
  const dniExist = await Personal.findOne({ dni: req.body.dni });
  if (dniExist) {
    return res.status(400).json({ error: "Dni ya registrado" });
  }
  //Validación del correo
  const emailExist = await Personal.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email ya registrado" });
  }

  //Encripto la contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  //Usuario a registrar
  const personal = new Personal({
    dni: req.body.dni,
    name: req.body.name,
    email: req.body.email,
    password: password,
    fechaNacimiento: req.body.fechaNacimiento,
    fechaInscripcion: req.body.fechaInscripcion,
    cargo: req.body.cargo,
  });
  try {
    const savedPersonal = await personal.save();
    res.json({
      error: null,
      data: savedPersonal,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
