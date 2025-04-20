const express = require('express')
const cors = require('cors')
const session = require('express-session');
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/health', (req, res) => {
  res.send('Healthy!')
})

app.use(express.json());
app.use(session({
  secret: "clavesecreta",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 900000 } // 15 min
}));

//API USER DEVUELVE EL RUT DEL USUARIO CONECTADO
app.get('/api/user', (req,res)=>{
  if (!req.session.sso){
    return res.status(401).json({error:"Unauthorized"})
  }
  res.json({id: req.session.idSSO})
})

app.get('/login', (req, res) => {
  const currentURL = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/sso/callback`);
  const ssoURL = `https://huemul.utalca.cl/sso/login.php?url=${currentURL}`;
  res.redirect(ssoURL);
})
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }

    //limpiar la cookie de sesión en el cliente
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.get('/api/auth/sso/callback', (req, res) => {
    const { id, v } = req.query;

  if (!id || !v) {
    return res.status(400).send('Login inválido');
  }

  req.session.idSSO = id;
  req.session.sso = true;

  res.redirect('/target');
})

app.get('/target', (req, res) => {
   if (!req.session.sso){
    return res.status(401).json({error:"Unauthorized"})
  }
  res.send('Target')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
