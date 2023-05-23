import express from "express";
import User from "../models/user.js";
import Joi from "joi";

const router = express.Router();

// Esquema del registro
const schemaUpdate = Joi.object({
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
  password: Joi.string().min(6).required(),
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

router.get("/", (req, res) => {
  User.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//obetener usuario concreto por id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//modificar usuario concreto
router.put("/:id", async (req, res) => {
  // Validaciones del registro
  const { error } = schemaUpdate.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const {
    dni,
    name,
    email,
    password,
    fechaNacimiento,
    fechaInscripcion,
    membresia,
    numIban,
  } = req.body;

  await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        dni: dni,
        name: name,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        fechaInscripcion: fechaInscripcion,
        membresia: membresia,
        numIban: numIban,
      },
    },
    { new: true }
  )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//eliminar usuario concreto por email
/**
 * @swagger
 * /api/users/:email:
 *  delete:
 *    summary:  Elimina a un usuario por email
 *    tags: [User]
 *    requestBoyd:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Usuario eliminado
 */
router.delete("/:email", async (req, res) => {
  //Validación del email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email no encontrado" });
  }
  const { email } = req.params;
  User.deleteOne({ email: email })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

export default router;
