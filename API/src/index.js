//-----------DEPENDENCIAS-----------

import express, { json, urlencoded } from "express";
import userAuth from "./routes/userAuth.js";
import staffAuth from "./routes/staffAuth.js";
import userRoutes from "./routes/user.js";
import rutinaRoutes from "./routes/rutina.js";
import nutritionRoutes from "./routes/nutritional_plan.js";
import personalRoutes from "./routes/personal.js";
import membresiaRoutes from "./routes/membresia.js";
import solicitudRoutes from "./routes/solicitud.js";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import verifyToken from "./middleware/validate-token.js";

//-----------VARIABLES DEFINIDAS-----------

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/.env` });

//-----------CORS-----------
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();

app.use((req, res, next) => {
  // Establecer la cabecera personalizada
  res.setHeader("ngrok-skip-browser-warning", "2");
  next();
});

app.use(cors(corsOptions));

app.use(json());
app.use(urlencoded({ extended: false }));

//-------------------------MIDDLEWARES-----------------------------

app.use("/api/userAuth", userAuth);
app.use("/api/staffAuth", staffAuth);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/routines", verifyToken, rutinaRoutes);
app.use("/api/plannings", verifyToken, nutritionRoutes);
app.use("/api/staff", verifyToken, personalRoutes);
app.use("/api/membresias", membresiaRoutes);
app.use("/api/solicitudes", verifyToken, solicitudRoutes);

//---------------RUTAS----------------------

app.get("/", (req, res) => {
  res.json({ mensaje: "Bienvenido a la API de MiGimnasio" });
});

//--------------CONEXIÓN A LA BASE DE DATOS DE MONGODB ATLAS----------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a la base de datos de MONGODB ATLAS");
  })
  .catch((e) => {
    console.log("Error de conexión", e);
  });

//--------PUERTO DE ESCUCHA DE LA API----------
const PORT = process.env.PORT || 8002;
console.log(process.env.PORT);

app.listen(PORT, () => {
  console.log(`El servidos se ha iniciado en el puerto: ${PORT}`);
});
