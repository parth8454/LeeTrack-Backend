const usermodel  = require('../../models/user');
const axios = require('axios');

const information = async(req,res) =>{
    
    const email = req.params;

    try{
    const user = await usermodel.findOne(email,['leetcodeUsername','stats']);
    return res.status(200).json(user);
    }catch(error){
        return res.status(500).json({message:"server error",error:error});
    }
}

module.exports = information;