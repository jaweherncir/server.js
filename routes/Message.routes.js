const router=require('express').Router();
const Message=require("../controller/Message.controller")
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "client/public/uploads/chatMessage"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});

const upload = multer({ storage });
router.post('/new-message',Message.newMessage)
router.put('/add-message/:id',upload.array("messageImage"),Message.addmessage)
//get all message of one conversation
router.get('/allmessage-conversation/:conversationId',Message.allMessageConversation)
//get all imag of conversation
//router.get('/allImageMessage/:conversationId',Message.allImageMessage)
router.delete('/delet_message/:id',Message.deleteMessage)
module.exports=router;