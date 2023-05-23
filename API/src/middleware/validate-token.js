import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log("AQUI SALTA UNDEFINED");
  // console.log(token);

  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(400).json({ error: "Token no valido, acceso denegado" });
  }
};

export default verifyToken;
