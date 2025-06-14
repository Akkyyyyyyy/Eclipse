import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { register,login,logout,editProfile,followOrUnfollow, getProfile, getSuggestedUsers } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js"


const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePicture'),editProfile);
router.route('/suggested').get(isAuthenticated,getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);

export default router;