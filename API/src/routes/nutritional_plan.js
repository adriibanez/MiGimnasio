import express from "express";
import Planning from "../models/nutritional_plan.js";
import Joi from "joi";

const router = express.Router();

// Esquema añadir el plannning
const schemaPlanning = Joi.object({
  nombre: Joi.string().min(3).max(40).required().messages({
    "any.required": `El campo nombre es requerido`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "string.base": `El campo nombre tiene que ser de tipo texto`,
    "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  descripcion: Joi.string().min(10).max(200).required().messages({
    "any.required": `El descripcion nombre es requerido`,
    "string.empty": `El descripcion nombre no puede estar vacío`,
    "string.base": `El descripcion nombre tiene que ser de tipo texto`,
    "string.min": `El descripcion nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El descripcion nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  fechaCreacion: Joi.string().required().messages({
    "any.required": `El campo fechaCreacion es requerido`,
    "string.empty": `El campo fechaCreacion no puede estar vacío`,
  }),
  comidas: Joi.array().items(
    Joi.object({
      nombre: Joi.string().min(3).max(20).required().messages({
        "any.required": `El campo nombre es requerido`,
        "string.empty": `El campo nombre no puede estar vacío`,
        "string.base": `El campo nombre tiene que ser de tipo texto`,
        "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
        "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
      }),
      descripcion: Joi.string().min(10).max(100).messages({
        "any.required": `El campo descripcion es requerido`,
        "string.empty": `El campo descripcion no puede estar vacío`,
        "string.base": `El campo descripcion tiene que ser de tipo texto`,
        "string.min": `El campo descripcion tiene que ser mínimo de {#limit} carácteres`,
        "string.max": `El campo descripcion tiene que ser máximo de {#limit} carácteres`,
      }),
      calorias: Joi.number().min(1).required().messages({
        "any.required": `El campo calorias es requerido`,
        "number.empty": `El campo calorias no puede estar vacío`,
        "number.base": `El campo calorias tiene que ser de tipo númerico`,
        "number.min": `El campo calorias tiene que ser mínimo de {#limit} kcal`,
      }),
    })
  ),
  emailUser: Joi.string()
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
});

// Esquema añadir la comida
const schemaComida = Joi.object({
  nombre: Joi.string().min(3).max(20).required().messages({
    "any.required": `El campo nombre es requerido`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "string.base": `El campo nombre tiene que ser de tipo texto`,
    "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  descripcion: Joi.string().min(10).max(100).messages({
    "any.required": `El campo descripcion es requerido`,
    "string.empty": `El campo descripcion no puede estar vacío`,
    "string.base": `El campo descripcion tiene que ser de tipo texto`,
    "string.min": `El campo descripcion tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo descripcion tiene que ser máximo de {#limit} carácteres`,
  }),
  calorias: Joi.number().min(1).required().messages({
    "any.required": `El campo calorias es requerido`,
    "number.empty": `El campo calorias no puede estar vacío`,
    "number.base": `El campo calorias tiene que ser de tipo númerico`,
    "number.min": `El campo calorias tiene que ser mínimo de {#limit} kcal`,
  }),
});

//--------------------------Comida------------------------------------------

//Añadir comida a un planning
router.post("/:nombre/foods", async (req, res) => {
  // Validar los datos de la comida
  const { error: exerciseError } = schemaComida.validate(req.body);
  if (exerciseError) {
    return res.status(400).json(exerciseError.details[0].message);
  }

  // Buscar el planning en la base de datos
  const planning = await Planning.findOne({ nombre: req.params.nombre });
  if (!planning) {
    return res.status(404).json("Planning no encontrado");
  }

  // Agregar la comida al planning
  await planning.comidas.push({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    calorias: req.body.calorias,
  });

  // Guardar el planning actualizado en la base de datos
  await planning.save();

  // Enviar la respuesta
  res.send(planning);
});

//Eliminar comida de un planning
router.delete("/:nombre/foods/:comidaNombre", async (req, res) => {
  // Buscar la planning en la base de datos
  const planning = await Planning.findOne({ nombre: req.params.nombre });
  if (!planning) {
    return res.status(404).json("Planning no encontrado");
  }

  // Buscar la comida en la matriz de comidas del planning
  const comida = planning.comidas.find(
    (e) => e.nombre === req.params.comidaNombre
  );
  if (!comida) {
    return res.status(404).json("Comida no encontrada en el planning");
  }

  // Eliminar la comida de la matriz de comidas del planning
  planning.comidas = planning.comidas.filter(
    (e) => e.nombre !== req.params.comidaNombre
  );

  // Guardar el planning actualizada en la base de datos
  await planning.save();

  // Enviar la respuesta
  res.send(planning);
});

//--------------------------PLANNING------------------------------------------

//obtener todas los planning
router.get("/", (req, res) => {
  Planning.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Obtener todos los planning de un usuario
router.get("/user/:emailUser", async (req, res) => {
  try {
    const plannings = await Planning.find({
      emailUser: req.params.emailUser,
    });
    res.send(plannings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Error en el servidor");
  }
});

// Obtener todos los plannings creados por un empleado
router.get("/emp/:emailEmpleado", async (req, res) => {
  try {
    const plannings = await Planning.find({
      emailEmpleado: req.params.emailEmpleado,
    });
    res.send(plannings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Error en el servidor");
  }
});

// Agregar un planning
router.post("/", async (req, res) => {
  try {
    const { error } = schemaPlanning.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const existePlanning = await Planning.findOne({ nombre: req.body.nombre });
    if (existePlanning)
      return res.status(400).json("Ya existe un planning con ese nombre");

    // Crear la nueva planning en la base de datos
    const planning = new Planning({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      fechaCreacion: req.body.fechaCreacion,
      comidas: [],
      emailUser: req.body.emailUser,
      emailEmpleado: req.body.emailEmpleado,
    });

    await planning.save();

    res.send(planning);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Editar un planning
router.put("/:id", async (req, res) => {
  try {
    const { error } = schemaPlanning.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existePlanning = await Planning.findOne({ nombre: req.body.nombre });
    if (existePlanning)
      return res.status(400).json("Ya existe un planning con ese nombre");

    const planning = await Planning.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        fechaCreacion: req.body.fechaCreacion,
        comidas: [],
        emailUser: req.body.emailUser,
        emailEmpleado: req.body.emailEmpleado,
      },
      { new: true }
    );

    if (!planning)
      return res
        .status(404)
        .json("El planning con el ID especificado no se encontró");

    res.send(planning);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta para actualizar un planning
router.patch("/:id", async (req, res) => {
  try {
    const updatedPlanning = await Planning.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
      },
      { new: true }
    );

    res.json(updatedPlanning);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar un planning
router.delete("/:nombre", (req, res) => {
  const { nombre } = req.params;
  Planning.deleteOne({ nombre: nombre })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

export default router;
