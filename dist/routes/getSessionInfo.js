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
const express_1 = require("express");
const index_1 = require("../index");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, id } = req.body;
        const mid = Math.floor((token.length - id.length) / 2);
        const leftPart = token.slice(0, mid);
        const rightPart = token.slice(mid + id.length);
        const user = yield index_1.prisma.user.findUnique({
            where: { email: leftPart + rightPart },
        });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        else if (user) {
            const transactions = yield index_1.prisma.transaction.findMany({
                where: { userId: user.id },
            });
            const data = {
                email: user.email,
                balance: user.balance,
                id: user.id,
                transactions: transactions,
            };
            return res.status(200).send(JSON.stringify(data));
        }
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
}));
exports.default = router;
