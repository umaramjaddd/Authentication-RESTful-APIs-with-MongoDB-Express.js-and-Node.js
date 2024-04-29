import express from "express";
import { getAllUsers, login, logout, signup, update } from "../Controllers/userController.js";
import {  authMiddleware } from "../Middleware/Authentication.js";

const route = express.Router();

route.post("/signup", signup)
route.post('/login', login)
route.get('/logout', logout)
route.put('/update/:id', authMiddleware,  update)
route.get('/getAllUsers', getAllUsers)
export default route;
