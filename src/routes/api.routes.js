const router = require("express").Router();
const { authenticateJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const pool = require("../../db");

router.get("/me", authenticateJWT, async (req, res) => {
const [rows] = await pool.query("SELECT id, email, role FROM usuarios WHERE id=?", [req.user.id]);
res.json(rows[0]);
});

router.get("/admin/usuarios", authenticateJWT, authorizeRoles ("admin"), async (req, res) => {
const [rows] = await pool.query("SELECT id, email, role, created_at FROM usuarios");
res.json(rows);
});

module.exports = router;