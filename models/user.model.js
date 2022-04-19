const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt");
//const {Error} = require("mongoose");
//const {Error} = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true //supprimer les espace
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
        },
        nomfamille:{
            type:String
        },
        prenom:{
            type:String
        },
        nom:{
            type:String
        },
        datenass:{
            type:Date
        },
        pays:{
            type:String
        },
        ville:{
            type:String
        },
        numero:{
            type:String,

        },

        langueCourant:{
            type:String
        },
        langueSecondaire:{
            type:String
        },
        profession:{
            type:String
        },
        silhoutte:{
            type:String
        },
        orgineethnique:{
            type:String
        },
        nature:{
            type:String
        },
        orientationsexe:{
            type:String
        },
        preferences:{
            type:String
        },
        valeurscroyances:{
            type:String
        },
        typerelation:{
            type:String
        },
        votrecaractere:{
            type:String
        },
        temperament:{
            type:String
        },
        interet:{
            type:String
        },
        photo:{
            required: true,
            type: [String],
            data: Buffer,
        },
        couvertir:{
            required: true,
            type: [String],
            data: Buffer,
        },
        vip:{  type: Boolean,
            default: false
        },
        libre:{  type: Boolean,
            default: false
        },
        visibile:{  type: Boolean,
            default: false
        },

        friends:{
            type:[String]
        },

        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String] // les pub qui deja likes par user  metter un quere rouge comme si deja likeee
        },

        status: {
            type: Boolean,
            default: false
        },
        deactivate: {  type: Boolean , default: false },
        resetPasswordLink: {
            data: String,
            default: ""
        },
    },
    {
        timestamps: true,
    }
);


//play function before save into display : 'block'
userSchema.pre("save", async function(next) {
const  salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);
next();
});//avant faire le save dans la base de donne faire cette function

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;

