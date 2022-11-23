"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type']
};
