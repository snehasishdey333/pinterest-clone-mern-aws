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
exports.getPinController = exports.getPinsController = exports.createPinController = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const { title, description, userId, link } = req.body;
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `pins/${Date.now()}-${file.originalname}`,
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
        const pin = yield prisma.pin.create({
            data: {
                title,
                description,
                userId,
                link: link || "",
                image: imageUrl
            }
        });
        res.status(201).json(pin);
    }
    catch (error) {
        next(error);
    }
});
exports.createPinController = createPinController;
const getPinsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pins = yield prisma.pin.findMany();
        res.status(200).json(pins);
    }
    catch (error) {
        next(error);
    }
});
exports.getPinsController = getPinsController;
const getPinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pinId } = req.params;
        const pin = yield prisma.pin.findUnique({
            where: {
                id: pinId
            },
            include: {
                user: true,
                comments: true
            }
        });
        res.status(200).json(pin);
    }
    catch (error) {
        next(error);
    }
});
exports.getPinController = getPinController;
