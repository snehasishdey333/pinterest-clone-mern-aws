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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCommentsController = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../middleware/error");
const prisma = new client_1.PrismaClient();
const postCommentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { comment, pinId, userId } = req.body;
        if (!comment || !pinId || !userId) {
            throw new error_1.CustomError(400, "All fields are required!");
        }
        const pinExist = yield prisma.pin.findUnique({
            where: {
                id: pinId
            }
        });
        if (!pinExist) {
            throw new error_1.CustomError(404, "Pin does not exist!");
        }
        const newComment = yield prisma.comment.create({
            data: {
                comment,
                pinId,
                userId
            }
        });
        res.status(200).json(newComment);
    }
    catch (error) {
        next(error);
    }
});
exports.postCommentsController = postCommentsController;
