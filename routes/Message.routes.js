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
        cb(null, file.originalname.toLowerCase().split(' ').join('-'));
    },
});
/*const imageUpload = multer({

    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|mp4|MPEG-4|mkv|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})*/
const upload = multer({ storage: storage });
router.post('/new-message',upload.array("messageImage"),Message.newMessage)
//router.put('/add-message/:id',upload.array("messageImage"),Message.addmessage)
//get all message of one conversation
router.get('/allmessage-conversation/:conversationId',Message.allMessageConversation)
//get all imag of conversation
router.get('/allImageMessage/:conversationId',Message.allImageMessage)
router.delete('/delet_message/:id',Message.deleteMessage)
module.exports=router;