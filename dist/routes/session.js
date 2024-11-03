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
    const { email } = req.body;
    const mid = Math.floor(email.length / 2);
    const leftPart = email.slice(0, mid);
    const rightPart = email.slice(mid);
    const user = yield index_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    const sessionID = leftPart + user.id + rightPart;
    const session = yield index_1.prisma.conclave.findUnique({
        where: { id: sessionID },
    });
    const sessionData = {
        id: sessionID,
        active: true,
    };
    if (session)
        return res.status(200).send({ message: 'Session already exists', session, userId: user.id });
    else if (!session) {
        yield index_1.prisma.conclave.create({
            data: sessionData,
        });
    }
    return res.status(201).send({ message: 'Session created successfully', sessionData, userId: user.id });
}));
exports.default = router;
