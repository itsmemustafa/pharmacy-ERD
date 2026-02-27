
import express from "express";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "../../middlewares/error-handler.js";
import notFound from "../../middlewares/not-found.js";

/**
 * @param {Array<{path: string, router: import('express').Router}>} routes
 * @returns {import('express').Express}
 */
const createTestApp = (routes = []) => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    for (const { path, router } of routes) {
        app.use(path, router);
    }

    app.use(errorHandlerMiddleware);
    app.use(notFound);

    return app;
};

export default createTestApp;
