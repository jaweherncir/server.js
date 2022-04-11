const PostModel=require('../models/post.model')
const UserModel=require('../models/user.model')

const ObjectID = require("mongoose").Types.ObjectId;


//post methodes
module.exports.readPost=(req,res)=>{
PostModel.find((err,docs)=>{
    if(!err) res.send(docs);
    else console.log('Error to get data:'+err);
}).sort({createdAt:-1})
}
module.exports.createPost=async (req,res)=> {

//uplad array iamge to post
const  {posterId,message}=req.body
    let picture = [];

    if (req.files.length > 0) {
        picture = req.files.map((file) => {
            return { img: file.filename };
        });
    }

    console.log(req.body)
console.log(req.files)
    const newPost=new PostModel({
                                posterId,
                                message,
                                picture ,
                                likers:[],
                                comments:[],
                                partage:[],
                                tags:[]
                                });
    newPost.save((error, newPost) => {
        if (error) return res.status(400).json({ error });
        if (newPost) {
            res.status(201).json({ newPost, files: req.files });
        }
    });
};
module.exports.updatePost=(req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    const updatePub={
                       message:req.body.message
                     }
     PostModel.findByIdAndUpdate(
         req.params.id,
         {$set:updatePub},{new:true},
         (err,docs)=>{
            if(!err) res.send(docs)
             else console.log("update error:"+err);
         }
     )
}
module.exports.deletePost=(req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    PostModel.findByIdAndRemove(req.params.id,
        (err,docs)=>{
            if(!err) res.send(docs)
            else console.log("delete  error:"+err);
        })

}
//like methodes
module.exports.likePost=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try{
            await  PostModel.findByIdAndUpdate(req.params.id,{
            $addToSet:{likers:req.body.id}    },{new :true},
            (err,docs)=>
            {
            if(err)return res.status(400).send(err);
            }

            );
            await  UserModel.findByIdAndUpdate(req.body.id,
                {
                           $addToSet:{likes:req.params.id}
                        },{new:true},(err,docs)=>{
                if(!err)res.send(docs)
                    else res.status(400).send(err)
                })
       }
    catch (err) {
                     res.status(400).send(err)
                  }
}
module.exports.unlikePost=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try{
        await  PostModel.findByIdAndUpdate(req.params.id,{
                $pull:{likers:req.body.id}    },{new :true},
            (err,docs)=>
            {
                if(err)return res.status(400).send(err);
            }

        );
        await  UserModel.findByIdAndUpdate(req.body.id,
            {
                $pull:{likes:req.params.id}
            },{new:true},(err,docs)=>{
                if(!err)res.send(docs)
                else res.status(400).send(err)
            })
    }
    catch (err) {
        res.status(400).send(err)
    }
}
//comment post
module.exports.commentPost= (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
       return   PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        textcomment: req.body.textcomment,
                        timestamp: new Date().getTime(),

                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};
module.exports.editCommentPost=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
try{
    return  PostModel.findById(
        req.params.id,
        (err,docs)=>{
            const thecomment=docs.comments.find((comment)=>
                comment._id.equals(req.body.commenteId)
            )
                if (!thecomment)return res.status(400).send('comment not found')
                 thecomment.textcomment=req.body.textcomment;
                return docs.save((err)=>{
                    if(!err)return res.status(200).send(docs);
                    return  res.status(500).send(err)
                })
        }
    )
   }catch (err) {
    return  res.status(400).send("ID unknown:"+req.params.id);
}
};
module.exports.SupprimerCommentPost=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};
//like comment
module.exports.likeComment= (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try{
        return  PostModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $push: {

                        likescomment: {
                            userId: req.body.userId,
                            commentaireId: req.body.commentaireId,
                            timestamp: new Date().getTime(),

                        },
                    }

            },{new :true},
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }

        );

    }
    catch (err) {
        res.status(400).send(err)
    }
}
module.exports.unlikeComment =  (req,res) => {
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
         PostModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $pull : {
                    likescomment: {
                        _id:req.body.likescomment
                    }
                    } //$pull reterai (-) dun valeur specifique
            }, //id de personne qui elle suivi
            {new :true },
            (err,data) =>{

                if(!err) {
                    res.status(201).json(data);
                    console.log("bien supprimer")
                }

                else return res.status(400).json(err);
            }

        );



    }catch (err){
        return res.status(500).json({message: err});

    }

}
//repand comment methodes
module.exports.repand=(req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        return   PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    repandComent: {
                                    msg: req.body.msg,
                                    commantaireId: req.body.commantaireId,
                                    userId: req.body.userId,

                                    userPseudo: req.body.userPseudo,
                                    timestamp: new Date().getTime(),
                                  },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
}
module.exports.editRepant=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try{
        return  PostModel.findById(
            req.params.id,
            (err,docs)=>{
                const theRepand=docs.repandComent.find((repand)=>
                    repand._id.equals(req.body.repandId)
                )
                if (!theRepand)return res.status(400).send('comment not found')
                theRepand.msg=req.body.msg;
                return docs.save((err)=>{
                    if(!err)return res.status(200).send(docs);
                    return  res.status(500).send(err)
                })
            }
        )
    }catch (err) {
        return  res.status(400).send("ID unknown:"+req.params.id);
    }
};
module.exports.deletRepant=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    repandComent: {
                        _id: req.body.repandId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};
module.exports.LikeRepant= (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try{
        return  PostModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $push: {

                    likesRepand: {
                        userId: req.body.userId,
                        repandId: req.body.repandId,
                        timestamp: new Date().getTime(),

                    },
                }

            },{new :true},
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }

        );

    }
    catch (err) {
        res.status(400).send(err)
    }
}
module.exports.unlikeRepand =  (req,res) => {
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
        PostModel.findByIdAndUpdate(
            {_id:req.params.id},//id d personne qui faire labonne
            {
                $pull : {
                    likesRepand: {
                        _id:req.body.likesRepand
                    }
                } //$pull reterai (-) dun valeur specifique
            }, //id de personne qui elle suivi
            {new :true },
            (err,data) =>{

                if(!err) {
                    res.status(201).json(data);
                    console.log("bien supprimer")
                }

                else return res.status(400).json(err);
            }

        );



    }catch (err){
        return res.status(500).json({message: err});

    }

}
//nbr like of repand
module.exports.getCountlikersRepand= async (req,res)=>{



    const likes = await PostModel.findById(req.params.id,(err,date)=>{
        if(!err){
            //return res.status(200).send(date);
            console.log(date.likesRepand.length)
            const nbrlikesComnt=date.likesRepand.length
            return  res.json({nbrlikesComnt: nbrlikesComnt})
        }
        else
            return  res.status(400).send(err)
    }).select('likesRepand -_id');
    //return res.json({nbrlikes: likes});


}
// nbr  like of post
module.exports.getlikers= async (req,res)=>{



    const likes = await PostModel.findById(req.params.id,(err,date)=>{
        if(!err){
            //return res.status(200).send(date);
            console.log(date.likers.length)
            const nbrlikes=date.likers.length
            return  res.json({nbrlikes: nbrlikes})
        }
        else
            return  res.status(400).send(err)
    }).select('likers -_id');
    //return res.json({nbrlikes: likes});


}
//nbr like of comment
module.exports.getCountLikeComment= async (req,res)=>{



    const likes = await PostModel.findById(req.params.id,(err,date)=>{
        if(!err){
            //return res.status(200).send(date);
            console.log(date.likescomment.length)
            const nbrlikesComnt=date.likescomment.length
            return  res.json({nbrlikesComnt: nbrlikesComnt})
        }
        else
            return  res.status(400).send(err)
    }).select('likescomment -_id');
    //return res.json({nbrlikes: likes});


}
//count comment
module.exports.getCountComment= async (req,res)=>{



    const comments = await PostModel.findById(req.params.id,(err,date)=>{
        if(!err){
            console.log(date.comments.length)
            const nbrcomments=date.comments.length
            return  res.json({nbrcomments: nbrcomments})

        }
        else
            return  res.status(400).send(err)
    }).select('comments -_id');
    //return res.json({nbrcomments: comments});

}
//share post
module.exports.sharePost=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        await PostModel.findByIdAndUpdate(
            req.body.idPost,
            {
                $addToSet: {
                    partage: {
                        idUserPost: req.body.idUserPost,
                        idUserPartagere: req.params.id,
                        idPost: req.body.idPost,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err)  res.status(200).send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
}
//tags amis
module.exports.tagAmi=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        await PostModel.findByIdAndUpdate(
            req.body.idPost,
            {
                $addToSet: {
                    tags: {
                        idPost: req.body.idPost,
                        idUsersend: req.params.id,
                        idUserReceve: req.body.idUserReceve,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err)  res.status(200).send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
}



