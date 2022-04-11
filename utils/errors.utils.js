module.exports.singUpErrors = (err)=>{
    //si pseudo ou email ou password nest pas vide
    let errors = {pseudo:'',email:'',password:''}; //let si declarer un objet errors
    if (err.message.includes('pseudo'))
        errors.pseudo="pseuo incorrect ";
    if (err.message.includes('email'))
        errors.email="Email incorrect ";
    if (err.message.includes('password'))
        errors.password = "le mot de passe doit faire 6 caractères minimum";
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes(("pseudo")))
        errors.pseudo="cette pseudo est deja pris";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes(("email")))
        errors.email="cette email est deja enregistre";

    return errors;

}
module.exports.singInErrors = (err) =>{//err est lereur de catch dans le parametre
 let errors = {email:'',password:''}
 if(err.message.includes("email"))
     errors.email="email inconnu";
 if(err.message.includes("password"))
     errors.password="le mot de passe ne correspond pas";
 return errors;





}
