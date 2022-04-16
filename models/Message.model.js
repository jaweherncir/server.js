const mongoose = require('mongoose');
const MessageSchema=new mongoose.Schema(
    {
      conversationId:{type:String},
        sender:{type:String},
        visible:{
          type:Boolean,
            default : false
        },
        message:{type:[
                {

                    like:{
                        type:Boolean,
                        default:false
                        },
                    timestamp:Number,
                    messages: {
                        type:String,
                             },
                   image: [{img: {type: Array}}],


                },


            ]

        },

    },
    {timestamps:true}



);
module.exports=mongoose.model('Message',MessageSchema);