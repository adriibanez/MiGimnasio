import express from "express";
import Rutina from "../models/rutina.js";
import Joi from "joi";

const router = express.Router();

const schemaRutina = Joi.object({
  nombre: Joi.string().min(3).max(30).required().messages({
    "any.required": `El campo nombre es requerido`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "string.base": `El campo nombre tiene que ser de tipo texto`,
    "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  descripcion: Joi.string().min(10).max(200).required().messages({
    "any.required": `El descripcion  es requerido`,
    "string.empty": `El descripcion  no puede estar vacío`,
    "string.base": `El descripcion  tiene que ser de tipo texto`,
    "string.min": `El descripcion  tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El descripcion  tiene que ser máximo de {#limit} carácteres`,
  }),
  fechaCreacion: Joi.string().required().messages({
    "any.required": `El campo fechaCreacion es requerido`,
    "string.empty": `El campo fechaCreacion no puede estar vacío`,
  }),
  ejercicios: Joi.array().items(
    Joi.object({
      nombre: Joi.string().min(3).max(30).required().messages({
        "any.required": `El campo nombre es requerido`,
        "string.empty": `El campo nombre no puede estar vacío`,
        "string.base": `El campo nombre tiene que ser de tipo texto`,
        "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
        "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
      }),
      series: Joi.number().min(1).required().messages({
        "any.required": `El campo series es requerido`,
        "number.empty": `El campo series no puede estar vacío`,
        "number.base": `El campo series tiene que ser de tipo númerico`,
        "number.min": `El campo series tiene que ser mínimo de {#limit} series`,
      }),
      repeticiones: Joi.number().min(5).required().messages({
        "any.required": `El campo repeticiones es requerido`,
        "number.empty": `El campo repeticiones no puede estar vacío`,
        "number.base": `El campo repeticiones tiene que ser de tipo númerico`,
        "number.min": `El campo repeticiones tiene que ser mínimo de {#limit} repeticiones`,
      }),
      descanso: Joi.number().min(60).messages({
        "any.required": `El campo descanso es requerido`,
        "number.empty": `El campo descanso no puede estar vacío`,
        "number.base": `El campo descanso tiene que ser de tipo númerico`,
        "number.min": `El campo descanso tiene que ser mínimo de {#limit} segundos`,
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

// Esquema añadir personal
const schemaEjercicio = Joi.object({
  nombre: Joi.string().min(3).max(30).required().messages({
    "any.required": `El campo nombre es requerido`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "string.base": `El campo nombre tiene que ser de tipo texto`,
    "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  series: Joi.number().min(1).required().messages({
    "any.required": `El campo series es requerido`,
    "number.empty": `El campo series no puede estar vacío`,
    "number.base": `El campo series tiene que ser de tipo númerico`,
    "number.min": `El campo series tiene que ser mínimo de {#limit} series`,
  }),
  repeticiones: Joi.number().min(5).required().messages({
    "any.required": `El campo repeticiones es requerido`,
    "number.empty": `El campo repeticiones no puede estar vacío`,
    "number.base": `El campo repeticiones tiene que ser de tipo númerico`,
    "number.min": `El campo repeticiones tiene que ser mínimo de {#limit} repeticiones`,
  }),
  descanso: Joi.number().min(60).messages({
    "any.required": `El campo descanso es requerido`,
    "number.empty": `El campo descanso no puede estar vacío`,
    "number.base": `El campo descanso tiene que ser de tipo númerico`,
    "number.min": `El campo descanso tiene que ser mínimo de {#limit} segundos`,
  }),
});

//--------------------------EJERCICIOS------------------------------------------

//Añadir ejercicio a una rutina
router.post("/:nombre/exercises", async (req, res) => {
  // Validar los datos del ejercicio
  const { error: exerciseError } = schemaEjercicio.validate(req.body);
  if (exerciseError) {
    console.log(req.body);
    return res.status(400).send(exerciseError.details[0].message);
  }

  // Buscar la rutina en la base de datos
  const routine = await Rutina.findOne({ nombre: req.params.nombre });
  if (!routine) {
    return res.status(404).json("Rutina no encontrada");
  }

  // Agregar el ejercicio a la rutina
  routine.ejercicios.push({
    nombre: req.body.nombre,
    series: req.body.series,
    repeticiones: req.body.repeticiones,
    descanso: req.body.descanso,
  });

  // Guardar la rutina actualizada en la base de datos
  await routine.save();

  // Enviar la respuesta
  res.send(routine);
});

//Eliminar ejercicio de una rutina
router.delete("/:nombre/exercises/:exerciseName", async (req, res) => {
  // Buscar la rutina en la base de datos
  const routine = await Rutina.findOne({ nombre: req.params.nombre });
  if (!routine) {
    return res.status(404).json("Rutina no encontrada");
  }

  // Buscar el ejercicio en la matriz de ejercicios de la rutina
  const exercise = routine.ejercicios.find(
    (e) => e.nombre === req.params.exerciseName
  );
  if (!exercise) {
    return res.status(404).json("Ejercicio no encontrado en la rutina");
  }

  // Eliminar el ejercicio de la matriz de ejercicios de la rutina
  routine.ejercicios = routine.ejercicios.filter(
    (e) => e.nombre !== req.params.exerciseName
  );

  // Guardar la rutina actualizada en la base de datos
  await routine.save();

  // Enviar la respuesta
  res.send(routine);
});

//--------------------------RUTINAS------------------------------------------

//obtener todas las rutinas
router.get("/", (req, res) => {
  Rutina.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Obtener todas las rutinas de un usuario
router.get("/user/:emailUser", async (req, res) => {
  try {
    const routines = await Rutina.find({
      emailUser: req.params.emailUser,
    });
    res.send(routines);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Obtener todas las rutinas creadas por un empleado
router.get("/emp/:emailEmpleado", async (req, res) => {
  try {
    const routines = await Rutina.find({
      emailEmpleado: req.params.emailEmpleado,
    });
    res.send(routines);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Agregar una rutina
router.post("/", async (req, res) => {
  try {
    const { error } = schemaRutina.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existeRutina = await Rutina.findOne({ nombre: req.body.nombre });
    if (existeRutina) {
      return res.status(400).json("Ya existe una rutina con ese nombre");
    }

    // Crear la nueva rutina en la base de datos
    const routine = new Rutina({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      fechaCreacion: req.body.fechaCreacion,
      ejercicios: [],
      emailUser: req.body.emailUser,
      emailEmpleado: req.body.emailEmpleado,
    });

    await routine.save();

    res.send(routine);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Editar una rutina
router.put("/:id", async (req, res) => {
  try {
    const { error } = schemaRutina.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existeRutina = await Rutina.findOne({ nombre: req.body.nombre });
    if (existeRutina) {
      return res.status(400).json("Ya existe una rutina con ese nombre");
    }

    const routine = await Rutina.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        fechaCreacion: req.body.fechaCreacion,
        ejercicios: [],
        emailUser: req.body.emailUser,
        emailEmpleado: req.body.emailEmpleado,
      },
      { new: true }
    );

    if (!routine)
      return res
        .status(404)
        .send("La rutina con el ID especificado no se encontró");

    res.send(routine);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta para actualizar una rutina
router.patch("/:id", async (req, res) => {
  try {
    const updatedRutina = await Rutina.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
      },
      { new: true }
    );

    res.json(updatedRutina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar una rutina
router.delete("/:nombre", (req, res) => {
  const { nombre } = req.params;
  Rutina.deleteOne({ nombre: nombre })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

export default router;
