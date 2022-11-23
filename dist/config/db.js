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
const mongoose_1 = __importDefault(require("mongoose"));
class DB {
    constructor() {
        this.convertDocToObj = (leanDocument) => {
            const _id = leanDocument._id.toString();
            const createdAt = leanDocument.createdAt.toString();
            const updatedAt = leanDocument.updatedAt.toString();
            return Object.assign(Object.assign({}, leanDocument), { _id,
                createdAt,
                updatedAt });
        };
        this.connection = {
            isConnected: 0
        };
    }
    readyStateLogger() {
        console.log(`current readyState = ${this.connection.isConnected}`);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.MONGODB_URI)
                return console.log('url is wrong');
            if (this.connection.isConnected) {
                console.log('mongodb was already connected');
                return;
            }
            if (mongoose_1.default.connections.length > 0) {
                this.connection.isConnected = mongoose_1.default.connections[0].readyState;
                if (this.connection.isConnected === 1) {
                    console.log('use previous connection');
                    return;
                }
                yield mongoose_1.default.disconnect();
                console.log('previous mongoose connection was disconnected');
                this.readyStateLogger();
            }
            const db = yield mongoose_1.default.connect(process.env.MONGODB_URI);
            this.connection.isConnected = db.connections[0].readyState;
            console.log('mongoose connect done successfully');
            this.readyStateLogger();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection.isConnected &&
                process.env.NODE_ENV === 'production') {
                yield mongoose_1.default.disconnect();
                this.connection.isConnected = 0;
                console.log('mongoose disconnected');
            }
            else {
                console.log('not disconnected (env = development)');
                this.readyStateLogger();
            }
        });
    }
}
exports.default = new DB();
