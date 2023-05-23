import { Schema, model } from "mongoose";

const personalSchema = Schema({
  dni: {
    type: String,
    required: true,
    unique: true,
    minlength: 9,
    maxlength: 9,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  fechaNacimiento: {
    type: String,
    required: true,
  },
  fechaInscripcion: {
    type: String,
  },
  cargo: {
    type: String,
    enum: ["nutricionista", "entrenador", "admin"],
    required: true,
  },
});

export default model("staff", personalSchema);
