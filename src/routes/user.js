const express = require("express"); // Importa el módulo express para crear el servidor
const userSchema = require("../models/user"); // Importa el esquema de usuario de Mongoose para interactuar con la base de datos
const Joi = require("joi"); // Importa el módulo Joi para la validación de datos

// Importa los esquemas de validación definidos en auth.js
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../routes/auth");

// Crea un router de Express para definir las rutas del API
const router = express.Router();

//Endpoint registrar usuario
router.post("/users", async (req, res) => {
  // Valida el cuerpo de la solicitud usando el esquema de validación de registro
  const { error } = registerValidationSchema.validate(req.body);
  if (error) {
    // Si hay un error de validación, responde con un estado 400 y el mensaje de error
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Verifica si el nombre de usuario ya existe en la base de datos
    const usernameExists = await userSchema.findOne({
      user: req.body.user,
    });

    if (usernameExists) {
      // Si el usuario ya existe, responde con un estado 400 y un mensaje de error
      return res.status(400).json({ message: "User already exists" });
    }

    // Crea una nueva instancia del modelo de usuario con los datos de la solicitud
    const user = new userSchema(req.body);

    // Guarda el nuevo usuario en la base de datos
    const savedUser = await user.save();

    // Responde con un estado 201 y un mensaje de éxito
    res.status(201).json({ message: "Usuario creado satisfactoriamenete" });
  } catch (err) {
    // Si hay un error durante el guardado, responde con un estado 500 y el mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Endpoint inicio de sesión
router.post("/login", async (req, res) => {
  const { error } = loginValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await userSchema.findOne({ user: req.body.user });
    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña invalido" });
    }

    if (req.body.password !== user.password) {
      return res.status(400).json({ message: "Usuario o contraseña invalido" });
    }

    res.json({ message: "¡Autenticación satisfactoria!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get all users
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

/*
//get a users
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//update a users
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { user, password } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { user, password } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//delete a users
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
}); */

module.exports = router;
