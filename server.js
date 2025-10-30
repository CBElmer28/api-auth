require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", require("./src/routes/auth.routes.js"));
app.use("/api", require("./src/routes/api.routes.js"));

app.listen(process.env.PORT || 3000, () => {
console.log(" Servidor corriendo en http://localhost:3000");
});