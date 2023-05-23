import express from "express";
import Solicitud from "../models/solicitud.js";
import Joi from "joi";

const router = express.Router();

// Esquema añadir la membresia
const schemaSolicitud = Joi.object({
  fecha: Joi.string().required().messages({
    "any.required": `El campo fecha es requerido`,
    "string.empty": `El campo fecha no puede estar vacío`,
  }),
  emailUsuario: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "es"] } })
    .required()
    .messages({
      "any.required": `El campo emailUsuario es requerido`,
      "string.empty": `El campo emailUsuario no puede estar vacío`,
      "string.email": `El campo emailUsuario no es válido`,
    }),
  emailEmpleado: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "es"] } })
    .required()
    .messages({
      "any.required": `El campo emailEmpleado es requerido`,
      "string.empty": `El campo emailEmpleado no puede estar vacío`,
      "string.email": `El campo emailEmpleado no es válido`,
    }),
  mensaje: Joi.string().min(10).max(100).required().messages({
    "any.required": `El campo mensaje es requerido`,
    "string.empty": `El campo mensaje no puede estar vacío`,
    "string.base": `El campo mensaje tiene que ser de tipo texto`,
    "string.min": `El campo mensaje tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo mensaje tiene que ser máximo de {#limit} carácteres`,
  }),
  estado: Joi.string()
    .valid("Pendiente", "Hecho", "Rechazada")
    .required()
    .messages({
      "any.required": `El campo estado es requerido`,
      "string.empty": `El campo estado no puede estar vacío`,
      "any.only": "El estado debe ser uno de los siguientes valores: {#valids}",
    }),
});

//obtener todas los solicitudes de un usuario
router.get("/user/:emailUsuario", async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({
      emailUsuario: req.params.emailUsuario,
    });

    if (solicitudes) {
      res.json(solicitudes);
    } else {
      res.status(400).json({ error: "No se ha encontrado al usuario" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//obtener todas los solicitudes de un empleado
router.get("/empleado/:emailEmpleado", async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({
      emailEmpleado: req.params.emailEmpleado,
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//obtener todas los solicitudes
router.get("/", async (req, res) => {
  try {
    const solicitudes = await Solicitud.find();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//añadir una nueva solicitud
router.post("/", async (req, res) => {
  try {
    //Validar los datos de la solicitud
    const { error } = schemaSolicitud.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const solicitud = new Solicitud({
      fecha: req.body.fecha,
      emailUsuario: req.body.emailUsuario,
      emailEmpleado: req.body.emailEmpleado,
      mensaje: req.body.mensaje,
      estado: req.body.estado,
    });

    await solicitud.save();

    res.send(solicitud);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

//actualizar el estado de una solicitud
router.put("/:id", async (req, res) => {
  try {
    // Obtener la solicitud de la base de datos
    const solicitud = await Solicitud.findById(req.params.id);

    // Verificar si la solicitud existe
    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    // Validar los datos de la solicitud
    const { error, value } = schemaSolicitud.validate(req.body);

    // Verificar si hay errores de validación
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }

    // Actualizar los campos de la solicitud con los nuevos valores
    solicitud.fecha = value.fecha;
    solicitud.emailUsuario = value.emailUsuario;
    solicitud.emailEmpleado = value.emailEmpleado;
    solicitud.mensaje = value.mensaje;
    solicitud.estado = value.estado;

    // Guardar la solicitud actualizada en la base de datos
    await solicitud.save();

    // Devolver la solicitud actualizada en la respuesta HTTP
    res.json(solicitud);
  } catch (error) {
    // Manejar los errores
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar la solicitud" });
  }
});

export default router;
