const MessageModel=require("../models/Message.model");
const ObjectID = require("mongoose").Types.ObjectId;
module.exports.newMessage=async (req,res)=>{

    const newMessage=new MessageModel({
        conversationId:req.body.conversationId,
        sender:req.body.sender,
        image:[],
        message:[]
    });
    try{
        const savedMessage=await newMessage.save();
        res.status(200).json(savedMessage);



    }
    catch (err)
    {
        return res.status(500).json({message: err});

    }
}
module.exports.addmessage= (req,res)=>{

    let image = [];

    if (req.files.length > 0) {
        image = req.files.map((file) => {
            return {img: file.filename  };
        });
    }

    console.log(req.body)
    console.log(req.files)
    try{
          MessageModel.findByIdAndUpdate({_id:req.params.id},

            {$push:{

                            message:{
                                messages: req.body.messages,

                                   },
                    image

                    }
                },
            {new :true},
            (err,data)=>{
            if(!err)res.status(200).send(data)
                else res.status(400).send(err)
            }
            )
    //    const addMessage=await newMessage.save();
      //  res.status(200).json(savedMessage);



    }
    catch (err)
    {
        return res.status(400).json({message: err});

    }
}
module.exports.allMessageConversation=async (req,res)=>{
    try{
        const messages=await MessageModel.find(
            {conversationId: req.params.conversationId})
        res.status(200).json(messages);
       }
    catch (err)
    {
        return res.status(500).json({message: err});

    }
}
module.exports.deleteMessage=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await MessageModel.remove({_id:req.params.id})
        res.status(200).json({message: "succes deleted message"});

    }catch (err)
    {
        return res.status(500).json({message: err});

    }
}
//delet all message of conversation
//send  video in message

