const get_stats = require('../controllers/API/User_stats');
// const ContestTracker = require('../controllers/HomeControllers/ContestTracker');
const information = require('../controllers/HomeControllers/information');
const leaderboard = require('../controllers/HomeControllers/leaderboard');

const ApiRouter = require('express').Router();

ApiRouter.get('/',leaderboard)
ApiRouter.get('/information/:email',information)
// ApiRouter.post('/Contest',ContestTracker);
ApiRouter.get('/getstats/:email',get_stats);


module.exports = ApiRouter;