const usermodel  = require('../../models/user');
const axios = require('axios');

const get_stats = async (req,res) =>{

    const email = req.params;

try{   
    const stats = await usermodel.findOne(email,['stats']);
    return res.json(stats);
}catch(error){
    return res.status(500).json({"message":"Can't fetch stats",error:error});
    }
}

module.exports = get_stats;