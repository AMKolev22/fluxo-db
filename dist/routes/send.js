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
        const { amount, category, email, target } = req.body;
        const user = yield index_1.prisma.user.findUnique({
            where: { email: email },
        });
        const targetUser = yield index_1.prisma.user.findUnique({
            where: { email: target },
        });
        if (!user || !targetUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        if (amount <= user.balance) {
            const date = new Date();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;
            const transaction = yield index_1.prisma.transaction.create({
                data: {
                    amount: amount,
                    category: category,
                    target: target,
                    userId: user.id,
                    timeProcessed: currentTime,
                    typeOfTransaction: "SEND TO USER"
                },
            });
            const updatedSender = yield index_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    balance: user.balance - amount,
                },
            });
            const updatedRecipient = yield index_1.prisma.user.update({
                where: { id: targetUser.id },
                data: {
                    balance: targetUser.balance + amount,
                },
            });
            return res.status(201).json({ transaction, updatedSender, updatedRecipient });
        }
        else {
            throw new Error("Insufficient funds");
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}));
exports.default = router;
