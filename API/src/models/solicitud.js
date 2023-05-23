import { Schema, model } from "mongoose";

const Solicitud = Schema({
  fecha: {
    type: String,
    required: true,
  },
  emailUsuario: {
    type: String,
    required: true,
  },
  emailEmpleado: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["Pendiente", "Hecho", "Rechazada"],
    default: "Pendiente",
    require: true,
  },
});

export default model("solicitudes", Solicitud);
