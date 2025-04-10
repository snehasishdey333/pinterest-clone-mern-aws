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
exports.updateUserController = exports.getUsercontroller = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsercontroller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                pins: true
            }
        });
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsercontroller = getUsercontroller;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const { userId } = req.params;
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `users/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            contentType: file.mimetype
        };
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION
        });
        const uploadResult = yield new lib_storage_1.Upload({
            client: s3Client,
            params: uploadParams
        }).done();
        const imageUrl = uploadResult.Location;
        const updatedUser = yield prisma.user.update({
            where: {
                id: userId
            },
            data: {
                image: imageUrl
            }
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
