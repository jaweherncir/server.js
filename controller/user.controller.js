const userModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers= async (req,res) =>{
    const users = await userModel.find().select('-password');//afiicher touts les information des users sauf password
    res.status(200).json(users);

}
module.exports.userInfo= async (req,res) =>{
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
     return res.status(400).send('ID unknown : '+ req.params.id);

    userModel.findById(req.params.id, (err,data)=>{
        if(!err)
            res.send(data);
        else
            console.log('ID unknow : '+err);

    }).select('-password');


}
module.exports.updateUser= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    email: req.body.email,
                    nomfamille: req.body.nomfamille,
                    prenom: req.body.prenom,
                    nom: req.body.nom,
                    datenass: req.body.datenass,
                    pays: req.body.pays,
                    ville: req.body.ville,
                    numero: req.body.numero,
                    langueCourant: req.body.langueCourant,
                    langueSecondaire: req.body.langueSecondaire,
                    profession: req.body.profession,
                    silhoutte: req.body.silhoutte,
                    orgineethnique: req.body.orgineethnique,
                    nature: req.body.nature,
                    orientationsexe: req.body.orientationsexe,
                    preferences: req.body.preferences,
                    valeurscroyances: req.body.valeurscroyances,
                    typerelation: req.body.typerelation,
                    votrecaractere: req.body.votrecaractere,
                    temperament: req.body.temperament,
                    interet: req.body.interet,
                    typerelation: req.body.typerelation,





                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }

}
module.exports.DeleteUser = async (req,res)=>{
 if (!ObjectID.isValid(req.params.id))
     return res.status(400).send('ID unknown '+req.params.id);
 try {
     await userModel.remove({_id:req.params.id})
     res.status(200).json({message: "succes deleted"});

 }catch (err)
 {
     return res.status(500).json({message: err});

 }
}
module.exports.follow = async (req,res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
        await userModel.findByIdAndUpdate(
            req.params.id,//id d personne qui faire labonne
            {
                $addToSet : {following: req.body.idToFollow}
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );
        //add to following liste
        // 9owet el request patch est non put
        await userModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet : {followers : req.params.id}},
            {new: true, upsert:true},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(400).json(err);

            }
        )
    }catch (err){
        return res.status(500).js({message: err});

    }

}
module.exports.unfollow = async (req,res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        // add to the follower liste
        await userModel.findByIdAndUpdate(
            req.params.id,//id d personne qui faire labonne
            {
                $pull : {following: req.body.idToUnFollow} //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );
        //add to following liste
        // 9owet el request patch est non put
        await userModel.findByIdAndUpdate(
            req.body.idToUnFollow,
            {$pull : {followers : req.params.id}},
            {new: true, upsert:true},
            (err,data) =>{
                //if (!err) res.status(201).json(data); impossible de routerner deux repponse status
                if (err) return res.status(400).json(err);

            }
        )


    }catch (err){
        return res.status(500).json({message: err});

    }

}
module.exports.updateProfil=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    photo: req.file.filename

                     }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }


}
module.exports.updateCouvertir=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    couvertir: req.file.filename

                     }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }


}