import express from "express";

const router = express.Router()

router.get('/login', (req, res) => {
  const currentURL = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/sso/callback`);
  const ssoURL = `https://huemul.utalca.cl/sso/login.php?url=${currentURL}`;
  res.redirect(ssoURL);
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

router.get('/api/auth/sso/callback', (req, res) => {
  const { id, v } = req.query;

  if (!id || !v) {
    return res.status(400).send('Login inválido');
  }

  req.session.idSSO = id;
  req.session.sso = true;

  res.redirect('/target');
});

export default router;