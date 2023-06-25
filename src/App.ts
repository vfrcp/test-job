import express from "express";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import requestTimeout from "connect-timeout";

import routes from "./routes";
import middlewares from "./middlewares";
import { config } from "./config";
import logger from "./models/logger";

const App = express()

App.use(requestTimeout(config.app.reqTimeout))
App.use(express.json())
App.use(cookieParser())
App.use(middlewares)
App.use(routes)

const start = async () => {
  await connect(config.db.url)
  App.listen(config.app.port, () => {
    console.log(`The app has been started at ${config.app.port} port`)
  })
}

start()