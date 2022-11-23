"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const homeRoute_1 = __importDefault(require("./routes/homeRoute"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
const db_1 = __importDefault(require("./config/db"));
// load env files
dotenv_1.default.config({
    debug: process.env.NODE_ENV !== 'production'
});
//connect database
const connectMongodb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.connect();
});
connectMongodb();
// initialize application
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(config_1.corsOptions));
app.get('/api', (req, res) => {
    return res.status(200).json({ msg: 'hello express' });
});
// load routes
app.use('/api/home', homeRoute_1.default);
app.use('/api/review', reviewRoute_1.default);
app.use('/api/upload', uploadRoute_1.default);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`NODE_ENV is ${String(process.env.NODE_ENV) === 'production'
        ? 'production'
        : 'development'}`);
    console.log(`server running port 5000 at http://localhost:${port}`);
});
