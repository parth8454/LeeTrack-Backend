const axios = require('axios');
const usermodel = require('../../models/user');

const getLeetCodeStats = async(req,res) => {

    // bhia yha username ko le to le phle...
    const user = await usermodel.findOne({ email:req.query.email});

    if (!user) {
    return res.status(404).json({ message: "user nahi mila", success: false });
    }

    const {UserName} = req.params;

    if(user){

    const graphQL_URL = 'https://leetcode.com/graphql';

    const query = {
        query:` query getUserData($username : String!){
            matchedUser(username : $username){profile {ranking} submitStats {acSubmissionNum {difficulty count} } } }`,
        
        variables:{username : UserName}
    };

    try{
        const response = await axios.post(graphQL_URL,query,{
            headers:{
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const stats = {
            "rank": response.data.data.matchedUser.profile.ranking,
            "totalSolved": response.data.data.matchedUser.submitStats.acSubmissionNum[0].count,
            "easy": response.data.data.matchedUser.submitStats.acSubmissionNum[1].count,
            "medium": response.data.data.matchedUser.submitStats.acSubmissionNum[2].count,
            "hard": response.data.data.matchedUser.submitStats.acSubmissionNum[3].count,
            "points":response.data.data.matchedUser.submitStats.acSubmissionNum[1].count+(2)*response.data.data.matchedUser.submitStats.acSubmissionNum[2].count + (3)*response.data.data.matchedUser.submitStats.acSubmissionNum[3].count
        };

        try{
            // console.log("Stats to save:", stats); // YEH ADD KAR
            await usermodel.findByIdAndUpdate(req.user._id,{
                stats:{...stats,lastUpdated : new Date()},
                leetcodeUsername:UserName,
            }); 
        }catch(err){
            console.log(`Stats are not stored in DB    error : ${err}`);
        }

        return res.status(200).json({message:'Here are your leetcode stats',stats:stats,success:true});

    }catch(err){
        return res.status(403).json({message:"We are unable to fetch your stats, kindly recheck your leetcode username",success:false});
    }}
};

module.exports = getLeetCodeStats;