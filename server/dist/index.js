"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const pins_1 = __importDefault(require("./routes/pins"));
const comments_1 = __importDefault(require("./routes/comments"));
const users_1 = __importDefault(require("./routes/users"));
const error_1 = require("./middleware/error");
const verifyToken_1 = __importDefault(require("./middleware/verifyToken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/api/auth", auth_1.default);
app.use("/api/pins", pins_1.default);
app.use("/api/comments", comments_1.default);
app.use("/api/users", verifyToken_1.default, users_1.default);
app.use((err, req, res, next) => {
    (0, error_1.errorHandler)(err, req, res, next);
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
