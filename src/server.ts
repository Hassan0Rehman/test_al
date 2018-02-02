/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as dotenv from "dotenv";
// import * as flash from "express-flash";
import * as path from "path";
import * as minifyHTML from "express-minify-html";
import * as minify from "express-minify";
import * as useragent from "express-useragent";
import * as cookieParser from "cookie-parser";
import * as memCache from "./helpers/memcache";
import * as useragentMiddleware from "./helpers/useragent-middleware";
import * as serverPathHelper from "./helpers/server-path-helper";
import * as cachePubSub from "./helpers/cache-pub-sub";
import expressValidator = require("express-validator");
import regionMiddleware from "./helpers/region-middleware";
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });


/**
 * Controllers (route handlers).
 */
import * as homeController from "./modules/home/home.controller";
import * as matchController from "./controllers/match";
import * as storiesController from "./modules/stories/stories.controller";
import * as punsubCacheController from "./controllers/pub-sub-cache";
import * as imageOptimization from "./helpers/image-processing";
import * as matchesColtroller from "./modules/match/match.controller";
import * as appController from "./modules/app/app-downloads.controller";
import * as seriesController from "./modules/series/series.controller";
import * as newsController from "./modules/news/news-controller";
/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 31286);
if (process.env.CIG_ENV === "production") {
  const _viewPath = "/views", _serverPath = __dirname;
  serverPathHelper.default.set(_viewPath, _serverPath);
  app.set("views", path.join(__dirname, "/views"));
} else {
  const _viewPath = "../views", _serverPath = __dirname;
  serverPathHelper.default.set(_viewPath, _serverPath);
  app.set("views", path.join(__dirname, "../views"));
}
app.set("view engine", "ejs");
app.use(compression());

// IMPORTANT:: UN-COMMENT THIS LINE IN PRODUCTION
if (process.env.CIG_ENV === "production") {
  app.use(minify());
}

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(useragent.express());
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET
// }));
// app.use(flash());

app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
  }
}));

// imageOptimization.default.convertImages();
app.use(express.static(path.join(__dirname, "/public"), { maxAge: 31557600000 }));
/**
 * Primary app routes.
 */
app.get("/", useragentMiddleware.default.setDevice(), memCache.default.cache("home-page-level", 31557600000), homeController.index);
app.get("/stories/:id/:title", useragentMiddleware.default.setDevice(), storiesController.index);
// app.get("/match", matchController.startMatch);
// app.get("/stories/:id/:title", memCache.default.cache("stories-page-level", 31557600000), storiesController.index);
app.get("/pub-sub-cache", punsubCacheController.index);
app.get("/match/:id", useragentMiddleware.default.setDevice(), matchesColtroller.index);
app.get("/live-cricket-app", useragentMiddleware.default.setDevice(), memCache.default.cache("apppage", 31557600000), appController.index);
app.get("/series/:id/:title", useragentMiddleware.default.setDevice(), seriesController.index);
app.get("/news/:id/:title", useragentMiddleware.default.setDevice(), newsController.index);

// START PUBSUB SUBSCRIPTION
cachePubSub.default.start();

// TODO:: EXAMPLE FOR USING LOCALS, NOT USING ANYWHERE
app.locals.utility = {
  matchType: {
    test: "1",
    odi: "2",
    t20: "3"
  }
};


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

// app.locals.jsChunkName = serverPathHelper.default.getJsChunk();
// console.log(app.locals.jsChunkName);
/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), process.env.CIG_ENV);
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;
