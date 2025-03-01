

import express from 'express';
import { secureRoute } from '../middleware/secureRoute.js';  
import { getUserProfile } from '../controller/user.controller.js';  
import { login} from '../controller/user.controller.js';  
import { signup } from '../controller/user.controller.js';  
import { logout} from '../controller/user.controller.js';  
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


router.get("/getUserProfile", secureRoute, getUserProfile);  

export default router;

