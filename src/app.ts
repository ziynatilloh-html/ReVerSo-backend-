import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import authRouter from "./router.auth"; // Adjust the path as necessary
import { MORGAN_FORMAT } from "./libs/types/config";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import passport from "passport";
import "./libs/utils/passport";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/

app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 3,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  const sessionInstance = req.session as T;

  if (req.isAuthenticated() && req.user) {
    res.locals.member = req.user; // ✅ Passport user
  } else if (sessionInstance.member) {
    res.locals.member = sessionInstance.member; // ✅ Custom session user
  } else {
    res.locals.member = null;
  }

  next();
});
/** 3-VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);
app.use("/", router);
//GOOGLE AUTH
app.use("/auth", authRouter);

export default app;
