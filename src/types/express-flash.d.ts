
/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {
    interface Request extends Flash {}
}

interface Flash {
    flash(type: string, message: any): void;
}

declare module "express-flash";

declare module "express-minify-html";

declare module "memory-cache";

declare module "express-minify";

declare module "file-type";

declare module "uglifycss";

declare module "ejs";

declare module "redis";

declare module "html-minifier";

declare module "perfect-scrollbar";

declare module "cookie-parser";

declare module "express-useragent";
