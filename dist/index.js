"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const deposit_1 = __importDefault(require("./routes/deposit"));
const withdraw_1 = __importDefault(require("./routes/withdraw"));
const newBudget_1 = __importDefault(require("./routes/newBudget"));
const send_1 = __importDefault(require("./routes/send"));
const editTransaction_1 = __importDefault(require("./routes/editTransaction"));
const session_1 = __importDefault(require("./routes/session"));
const deleteTransaction_1 = __importDefault(require("./routes/deleteTransaction"));
const getSessionInfo_1 = __importDefault(require("./routes/getSessionInfo"));
const deleteSession_1 = __importDefault(require("./routes/deleteSession"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Prisma client with detailed logging
exports.prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.get('/', (req, res) => {
    res.status(200).send({ data: 'ROOT' });
});
app.use('/auth', auth_1.default);
app.use('/deposit', deposit_1.default);
app.use('/withdraw', withdraw_1.default);
app.use('/newBudget', newBudget_1.default);
app.use('/send', send_1.default);
app.use('/editTransaction', editTransaction_1.default);
app.use('/deleteTransaction', deleteTransaction_1.default);
app.use('/session', session_1.default);
app.use("/getInfo", getSessionInfo_1.default);
app.use("/deleteSession", deleteSession_1.default);
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
