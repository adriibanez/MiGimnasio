import express from "express";
import Membresia from "../models/membresia.js";
import Ventaja from "../models/membresia.js";
import Joi from "joi";

const router = express.Router();

// Esquema añadir la membresia
const schemaMembresia = Joi.object({
  nombre: Joi.string().min(3).max(15).required().messages({
    "any.required": `El campo nombre es requerido`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "string.base": `El campo nombre tiene que ser de tipo texto`,
    "string.min": `El campo nombre tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo nombre tiene que ser máximo de {#limit} carácteres`,
  }),
  ventajas: Joi.array().items(
    Joi.object({
      descripcion: Joi.string().min(3).max(20).required().messages({
        "any.required": `El campo ventaja es requerido`,
        "string.empty": `El campo ventaja no puede estar vacío`,
        "string.base": `El campo ventaja tiene que ser de tipo texto`,
        "string.min": `El campo ventaja tiene que ser mínimo de {#limit} carácteres`,
        "string.max": `El campo ventaja tiene que ser máximo de {#limit} carácteres`,
      }),
    })
  ),
  precio: Joi.number().min(1).required().messages({
    "any.required": `El campo precio es requerido`,
    "number.empty": `El campo precio no puede estar vacío`,
    "number.base": `El campo precio tiene que ser de tipo texto`,
    "number.min": `El campo precio tiene que ser mínimo de {#limit} €`,
  }),
});

// Esquema añadir la ventajas
const schemaVentaja = Joi.object({
  descripcion: Joi.string().min(3).max(20).required().messages({
    "any.required": `El campo ventaja es requerido`,
    "string.empty": `El campo ventaja no puede estar vacío`,
    "string.base": `El campo ventaja tiene que ser de tipo texto`,
    "string.min": `El campo ventaja tiene que ser mínimo de {#limit} carácteres`,
    "string.max": `El campo ventaja tiene que ser máximo de {#limit} carácteres`,
  }),
});

//--------------------------Ventaja------------------------------------------

router.post("/:nombre/ventajas", async (req, res) => {
  try {
    const nombreMembresia = req.params.nombre;
    // const ventajas = req.body.ventajas;

    //Validar los datos de la ventaja
    const { error: ventajasError } = schemaVentaja.validate(req.body);
    if (ventajasError) {
      return res.status(400).json(ventajasError.details[0].message);
    }

    // Buscar la membresia en la base de datos
    const membresia = await Membresia.findOne({ nombre: nombreMembresia });
    if (!membresia) {
      return res.status(404).json("Membresia no encontrada");
    }

    membresia.ventajas.push({ descripcion: req.body.descripcion });

    await membresia.save();

    res.json(membresia);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json("Ha ocurrido un error al agregar las ventajas a la membresía.");
  }
});

//Obtener ventajas de membresia
router.get("/:nombre/ventajas", async (req, res) => {
  try {
    const membresia = await Membresia.findOne({ nombre: req.params.nombre });
    if (!membresia) {
      return res.status(404).json({ error: "Membresia no encontrada" });
    }

    const ventajas = await Ventaja.find({ nombre: membresia.nombre });
    res.json(ventajas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Eliminar ventaja de una membresia
router.delete("/:nombre/ventajas/:ventaja", async (req, res) => {
  // Buscar la membresia en la base de datos
  const membresia = await Membresia.findOne({ nombre: req.params.nombre });
  if (!membresia) {
    return res.status(404).send("Membresia no encontrado");
  }

  // Buscar la ventaja en la matriz de ventajas de la membresia
  const ventaja = membresia.ventajas.find(
    (e) => e.descripcion === req.params.ventaja
  );
  if (!ventaja) {
    return res.status(404).send("Ventaja no encontrada en la membresia");
  }

  // Eliminar la ventaja de la matriz de ventajas de la membresia
  membresia.ventajas = membresia.ventajas.filter(
    (e) => e.descripcion !== req.params.ventaja
  );

  // Guardar la membresia actualizada en la base de datos
  await membresia.save();

  // Enviar la respuesta
  res.send(membresia);
});

//--------------------------Membresia------------------------------------------

//obtener todas las membresias
router.get("/", (req, res) => {
  Membresia.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Agregar una membresia
router.post("/", async (req, res) => {
  try {
    const { error } = schemaMembresia.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existeMembresia = await Membresia.findOne({
      nombre: req.body.nombre,
    });
    if (existeMembresia) return res.status(400).json("La membresía ya existe");

    // Crear la nueva membresia en la base de datos
    const membresia = new Membresia({
      nombre: req.body.nombre,
      ventajas: [],
      precio: req.body.precio,
    });

    await membresia.save();

    res.send(membresia);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Editar una membresia
router.put("/:id", async (req, res) => {
  try {
    const { error } = schemaMembresia.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existeMembresia = await Membresia.findOne({
      nombre: req.body.nombre,
    });
    if (existeMembresia)
      return res.status(400).json("Ya existe una membresía con ese nombre");

    const membresia = await Membresia.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        ventajas: [],
        precio: req.body.precio,
      },
      { new: true }
    );

    if (!membresia)
      return res
        .status(404)
        .json("La membresia con el ID especificado no se encontró");

    res.send(membresia);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta para actualizar un planning
router.patch("/:id", async (req, res) => {
  try {
    const updatedMembresia = await Membresia.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        precio: req.body.precio,
      },
      { new: true }
    );

    res.json(updatedMembresia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar una membresia
router.delete("/:nombre", (req, res) => {
  const { nombre } = req.params;
  Membresia.deleteOne({ nombre: nombre })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

export default router;
