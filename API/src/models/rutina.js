import { Schema, model } from "mongoose";

const Ejercicio = Schema({
  nombre: {
    type: String,
    required: true,
  },
  series: {
    type: Number,
    required: true,
  },
  repeticiones: {
    type: Number,
    required: true,
  },
  descanso: {
    type: Number,
  },
});

const Rutina = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fechaCreacion: {
    type: String,
    required: true,
  },
  ejercicios: [Ejercicio],
  emailUser: {
    type: String,
    required: true,
  },
  emailEmpleado: {
    type: String,
    required: true,
  },
});

export default model("routines", Rutina);
