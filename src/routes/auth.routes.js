const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const pool = require("../../db");
const { signAccessToken} = require("../utils/tokens");

// Registro
router.post("/register",
body("email").isEmail(),
body("password").isLength({ min: 6}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { email, password, role } = req.body;
    const [exist] = await pool.query("SELECT id FROM usuarios WHERE email=?", [email]); 
    if (exist.length) return res.status(409).json({ error: "Email ya registrado" });

    const hash = await bcrypt.hash(password, 10);
    const rol = role === "admin"? "admin": "user";

    const [result] = await pool.query(
    "INSERT INTO usuarios (email, password_hash, role) VALUES (?,?,?)", 
    [email, hash, rol] 
    );
    
    const token = signAccessToken({ id:result.insertId, email, role:rol});
    res.status(201).json({message: "Usuario registrado", token});
    }
);

router.post("/login",
    body("email").isEmail(),
    body("password").notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (lerrors.isEmpty()) return res.status(400).json(errors.array());

        const { email, password} = req.body;
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE email=?", [email]);
        if (!rows.length) return res.status (401).json({ error: "Credenciales inválidas" });

        const user = rows[0];
        const ok = await bcrypt.compare (password, user.password_hash);
        if (lok) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = signAccessToken({ id: user.id, email, role: user.role });
        res.json({ token, role: user.role });
    });

module.exports = router;