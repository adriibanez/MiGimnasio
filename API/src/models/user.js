import { Schema, model } from "mongoose";

const userSchema = Schema({
  dni: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: String,
    required: true,
  },
  fechaInscripcion: {
    type: String,
    // default: Date.now,
  },
  membresia: {
    type: String,
    required: true,
  },
  numIban: {
    type: String,
    required: true,
  },
});

export default model("users", userSchema);
