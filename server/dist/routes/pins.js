"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pinsController_1 = require("../controllers/pinsController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post("/", upload.single("file"), pinsController_1.createPinController);
router.get("/", pinsController_1.getPinsController);
router.get("/:pinId", pinsController_1.getPinController);
exports.default = router;
