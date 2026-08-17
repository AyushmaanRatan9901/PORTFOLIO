import Message from '../models/Message.js';
export const createMessage=async(req,res)=>{const message=await Message.create(req.body);res.status(201).json({message})};
export const getMessages=async(req,res)=>{const messages=await Message.find().sort({createdAt:-1});res.json({messages})};
export const deleteMessage=async(req,res)=>{await Message.findByIdAndDelete(req.params.id);res.json({message:'Message deleted'})};
