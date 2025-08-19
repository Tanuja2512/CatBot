import express from "express";
import { loginUser, myProfile, verifyUser } from "../controllers/usercontrollers.js";
import { isAuth } from "../middlewares/isAuth.js";


 const router = express.Router();

 // login route  should be POST
 router.post("/login",loginUser);
 router.post("/verify",verifyUser);
 router.get("/me",isAuth,myProfile)

 export default router;
