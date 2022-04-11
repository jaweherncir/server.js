const mongoose = require('mongoose');
const PostSchema=new mongoose.Schema(
    {
               posterId:{
                   type:String,
                    required:true
               },
               message:{
                   type:String,
                   trim:true,
                   maxlength:1000000,
               },
               picture: [
                           { img: { type: String } }
                        ],

               likers:{
                       type:[String],
                       required:true
                       },
               likescomment:[{
                    userId:String,
                    //userId:String,
                    commentaireId:String,

                          }],
               repandComent:[{
                    msg:String,
                    commantaireId:String,
                    userId:String,
                    userPseudo:String,
                    timestamp:Number}],
               likesRepand:[{
                    userId:String,
                    repandId:String,

                           }],
               comments:{
                   type:[{
                          commenterId: String,
                          commenterPseudo:String,
                          textcomment:String,
                          timestamp:Number
                        }],
                 required:true
                  },
               visible:{type: Boolean,
                         default: false},
               partage:{type:[
                {
                    idUserPost:String,
                    idUserPartagere:String,
                    idPost:String,
                    timestamp:Number
                }

            ]},
               tags:{type:[
                {
                    idPost:String,
                    idUsersend:String,
                    idUserReceve:String,
                    timestamp:Number
                }

            ]}


             },
    {timestamps:true}



);
module.exports=mongoose.model('post',PostSchema);