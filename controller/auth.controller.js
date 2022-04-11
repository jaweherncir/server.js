const UserModel = require('../models/user.model');
const jwt = require("jsonwebtoken");
const {singUpErrors,singInErrors}=require('../utils/errors.utils');

const maxAge=3*24*60*60*1000;
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