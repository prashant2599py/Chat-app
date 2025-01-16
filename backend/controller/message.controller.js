import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req, res) =>{
    
    try {
        const { message } = req.body;
        const { id  : receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] }
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        // await newMessage.save();
        // await conversation.save();
        // Thiss will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
        
    } catch (error) {
        console.log("error is message controller : ", error.message);
        res.status(500).json({message : "Internal Server Error"})
    }
    
}

export const getMessages = async(req, res) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]}
        }).populate("messages")

        if(!conversation){
            res.status(200).json([]);
        }
        const messages = conversation.messages

        res.status(200).json(messages)

    } catch (error) {
        console.log("error is message controller : ", error.message);
        res.status(500).json({message : "Internal Server Error"})
    }
}