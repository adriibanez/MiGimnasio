import { Schema, model } from "mongoose";

const Ventaja = Schema({
  descripcion: {
    type: String,
  },
});

const Membresia = Schema({
  nombre: {
    type: String,
    required: true,
  },
  ventajas: [Ventaja],
  precio: {
    type: Number,
    required: true,
  },
});

export default model("membresia", Membresia);
