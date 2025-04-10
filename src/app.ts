import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import authRouter from "./router.auth";
import { MORGAN_FORMAT } from "./libs/types/config";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import passport from "passport";
import "./libs/utils/passport";
import cookieParser from "cookie-parser";

//====Database Connection====//
const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

//====Express====//
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(MORGAN_FORMAT));

//====Sessions====//

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
    res.locals.member = req.user; //== User from passport==//
  } else if (sessionInstance.member) {
    res.locals.member = sessionInstance.member; //== User from session(local)==//
  } else {
    res.locals.member = null;
  }
  next();
});

//====VIEW ENGINE====//
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//====ROUTES====//
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});
//====Admin Routes====//
app.use("/admin", routerAdmin);
//====Member Routes====//
app.use("/", router);
//====Google Auth Routes====//
app.use("/auth", authRouter);

export default app;
