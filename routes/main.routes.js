import express from "express"

import { requireAuth } from "../middleware/auth.middleware.js"

const router = express.Router()


router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/health', (req, res) => {
  res.send('Healthy!');
});

//Ruta protegida de obtener sesión
router.get('/api/user', requireAuth, (req, res) => {
  res.json({ id: req.session.idSSO });
});

// Ruta protegida de ejemplo
router.get('/target', requireAuth, (req, res) => {
  res.send('Target');
});

export default router