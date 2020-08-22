import express from "express";
const Authrouter = express.Router();
const controller = require("../controller/auth.controller");

Authrouter.get('/reset',controller.showRecoverPass);

Authrouter.post('/reset',controller.recoverPass )
Authrouter.get('/confirm/:token', controller.confirm);

export default Authrouter;
