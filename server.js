import cors from 'cors'
import express from "express"
import session from 'express-session'
import authRoutes from "./routes/auth.routes.js"
import mainRoutes from "./routes/main.routes.js"

const server = express()

const port = 8080

server.use(cors())
server.use(express.json())

server.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 15} //seg * segs * mins - 15min
}))

server.use(authRoutes)
server.use(mainRoutes)

server.listen(port, () => {
  console.log("server listening on port: ", port)
})