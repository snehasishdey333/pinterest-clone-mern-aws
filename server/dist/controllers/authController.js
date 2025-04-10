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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.loginController = exports.registerController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../middleware/error");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (existingUser) {
            throw new error_1.CustomError(400, "User already exists!");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "3d" });
        const { password: _ } = newUser, userInfo = __rest(newUser, ["password"]);
        res.cookie("token", token, {
        // httpOnly:true,
        // secure:true,
        // sameSite:"none"
        }).status(201).json(userInfo);
    }
    catch (error) {
        next(error);
    }
});
exports.registerController = registerController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, username } = req.body;
        if (!email && !username) {
            throw new error_1.CustomError(400, "Email or username is required!");
        }
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (!user) {
            throw new error_1.CustomError(404, "User not found!");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw new error_1.CustomError(400, "Wrong credentials!");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "3d" });
        const { password: _ } = user, userInfo = __rest(user, ["password"]);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(201).json(userInfo);
    }
    catch (error) {
        next(error);
    }
});
exports.loginController = loginController;
const logoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json("User logged out successfully!");
    }
    catch (error) {
        next(error);
    }
});
exports.logoutController = logoutController;
