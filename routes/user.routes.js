const  router = require('express').Router();
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const uploadController = require("../controller/upload.controller");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const shortid = require('shortid')

const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(path.dirname(__dirname),"client/public/uploads/profil"))
    },

    filename: (req, file, cb) => {
       cb(null,shortid.generate()+"_"+file.originalname)
    },

    limits: {
        fileSize: 1024 * 1024
    }
});

// file filter function
const fileFilterFunction = (req, file, cb) => {
    const file_extention = path.extname(file.originalname);
    const allowedExtentions = [".jpg", ".jpeg", ".png", ".gif"]
    if (!allowedExtentions.includes(file_extention)) {
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
};
// 2.0 create upload

const upload = multer({ storage: my_storage },{fileFilter:fileFilterFunction})
var cpUpload = upload.fields([{ name: 'photo' }, { name: 'couvertir'}])
var uploadImageUser=multer({storage:my_storage})

//authentification
router.post("/signup",cpUpload,authController.signUp);
router.post("/login",authController.signIn);
router.get("/logout",authController.logOut);

//user display block
router.get("/",userController.getAllUsers);
router.get("/:id",userController.userInfo);
router.put("/:id",userController.updateUser);
router.delete("/:id",userController.DeleteUser);
router.patch("/:id",userController.follow);// id de user qui deja connecter
router.patch("/unfollow/:id",userController.unfollow);

//upload
router.put("/update_profil_image/:id",uploadImageUser.single('profil'),userController.updateProfil)
router.put("/update_couvertir_image/:id",uploadImageUser.single('couvertir'),userController.updateCouvertir)
//router.post("/upload",upload.single('file'),uploadController.uploadProfile);
module.exports=router;