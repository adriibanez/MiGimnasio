import { Schema, model } from "mongoose";

const Comida = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  calorias: {
    type: Number,
    required: true,
  },
});

const Planning = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  fechaCreacion: {
    type: String,
    required: true,
  },
  comidas: [Comida],
  emailUser: {
    type: String,
    required: true,
  },
  emailEmpleado: {
    type: String,
    required: true,
  },
});

export default model("plannings", Planning);
