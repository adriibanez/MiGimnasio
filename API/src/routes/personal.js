import express from "express";
import Personal from "../models/personal.js";
import Joi from "joi";

const router = express.Router();

// Esquema añadir personal
const schemaUpdatePersonal = Joi.object({
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

// Obtener todo el personal
router.get("/", async (req, res) => {
  await Personal.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//modificar personal concreto
router.put("/:id", async (req, res) => {
  // Validaciones del registro
  const { error } = schemaUpdatePersonal.validate(req.body);
  //Mando un error
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;
  const {
    dni,
    name,
    email,
    password,
    fechaNacimiento,
    fechaInscripcion,
    cargo,
  } = req.body;

  await Personal.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        dni: dni,
        name: name,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        fechaInscripcion: fechaInscripcion,
        cargo: cargo,
      },
    },
    { new: true }
  )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//eliminar persoal concreto
router.delete("/:email", async (req, res) => {
  //Validación del email
  const emailExist = await Personal.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email no encontrado" });
  }

  const { email } = req.params;
  Personal.deleteOne({ email: email })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

export default router;
