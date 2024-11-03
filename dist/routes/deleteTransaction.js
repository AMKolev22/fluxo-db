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
    const { transactionId, email } = req.body;
    console.log("pedal");
    try {
        const user = yield index_1.prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            yield index_1.prisma.transaction.delete({
                where: { id: transactionId, userId: user.id },
            });
            return res.status(200).json({ message: "Transaction deleted" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
}));
exports.default = router;
