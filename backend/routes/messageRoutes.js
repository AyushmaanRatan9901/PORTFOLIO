import express from 'express';import { createMessage,deleteMessage,getMessages } from '../controllers/messageController.js';import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();router.post('/',createMessage);router.get('/',protect,getMessages);router.delete('/:id',protect,deleteMessage);export default router;
