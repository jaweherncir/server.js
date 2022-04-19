const UserModel = require('../models/user.model');
const jwt = require("jsonwebtoken");
const {singUpErrors,singInErrors}=require('../utils/errors.utils');
const {sendEmail}=require("../helpers")
const maxAge=3*24*60*60*1000;
const _ = require("lodash");
const createToken = (id) =>{
    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: maxAge
    })
}


module.exports.signUp= async (req,res) =>{

            const  {
                pseudo,email,password,nomfamille,prenom,nom,datenass,pays,
                ville,numero,langueCourant,langueSecondaire,
                profession,silhoutte,orgineethnique,nature,orientationsexe,preferences,
                valeurscroyances,typerelation,votrecaractere,temperament,interet,
                 }=req.body
    const photo=req.files.photo[0].filename
    const couvertir=req.files.couvertir[0].filename
    console.log(req.files)
    try {

        const user = await  UserModel.create({pseudo,email,password,nomfamille,prenom,nom,
            datenass,pays,ville,numero,langueCourant,langueSecondaire,
            profession,silhoutte,orgineethnique,nature,orientationsexe,preferences,
            valeurscroyances,typerelation,votrecaractere,temperament,interet,photo,couvertir
            });

        res.status(201).json({user: user._id});
    }
    catch (err){
        res.status(400).send({err});

    }

}
module.exports.signIn=async (req,res) =>{
    const {email,password } = req.body
    try {
        const user = await UserModel.login(email,password); //verifier si cette utilisateur existe ou non dans la base de donee
        const token = createToken(user._id);

        //console.log(user);
       // console.log(token);
        res.cookie('jwt', token,{httpOnly: true, maxAge});
        res.status(201).json({user:user._id});


    }catch (err){
        const errors =singInErrors(err)
        res.status(200).json({errors});

    }

}
module.exports.logOut=async (req,res) =>{
    res.cookie('jwt','',{maxAge:1}); //max age 1 mellisecound (supprimer le cookie)
    res.redirect('/');

}
exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    UserModel.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};
exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    UserModel.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        UserModel.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};
