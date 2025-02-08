import express from 'express'
import { sendMessage } from '../controller/message.controller.js';
import {getMessages} from '../controller/message.controller.js';
import secureRoute from '../middleware/secureRoute.js';
const router= express.Router()
router.post("/send/:id",secureRoute,sendMessage);

router.get("/get/:id",secureRoute,getMessages);

export default router;