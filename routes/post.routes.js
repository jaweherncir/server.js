const router=require('express').Router();
const postController=require('../controller/post.controller');

/*const multer=require('multer')
const path = require("path");
const shortid = require("shortid");
const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null,path.join(path.dirname(__dirname),"client/public/uploads/posts"))
    },

    filename: (req, file, cb) => {
        cb(null,Date.now()+'--'+file.originalname)
    },

    limits: {
        fileSize: 1024 * 1024
    }
});
const upload =multer({storage:my_storage})*/
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "client/public/uploads/posts"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

//getAllPub
router.get('/',postController.readPost);
//AddPub
router.post('/newPost',upload.array("images"),postController.createPost);
//update Pub
router.put('/:id',postController.updatePost);
//Delet pub
router.delete('/:id',postController.deletePost);
//like des post
router.patch('/like-post/:id',postController.likePost);
router.patch('/unlike-post/:id',postController.unlikePost);
//commenter publication
router.patch('/commente-post/:id',postController.commentPost);
router.patch('/edit-commente-post/:id',postController.editCommentPost);
router.patch('/delete-commente-post/:id',postController.SupprimerCommentPost);
router.put('/like-commanet/:id',postController.likeComment);

router.patch('/unlike-commanet/:id',postController.unlikeComment);
//repand comment
router.patch('/Repand_Comment/:id',postController.repand);
router.patch('/update_Repand_Comment/:id',postController.editRepant);
router.patch('/delete_Repand_Comment/:id',postController.deletRepant);
router.patch('/like_Repand_Comment/:id',postController.LikeRepant);
router.patch('/unlike-Repand/:id',postController.unlikeRepand);
//nbr like of repand
router.get('/nbr_likes_repand/:id',postController.getCountlikersRepand);
//count nmbr like
router.get('/nbr_likes_post/:id',postController.getlikers);
//count nmber comment
router.get('/nbr_comment_post/:id',postController.getCountComment);
router.get('/nbr_like_comment/:id',postController.getCountLikeComment);
//share post
router.patch('/share_post/:id',postController.sharePost);
//tag amis
router.patch('/tag_post_ami/:id',postController.tagAmi);
module.exports=router;