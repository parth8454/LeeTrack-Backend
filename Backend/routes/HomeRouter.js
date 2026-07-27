const getLeetCodeStats = require('../controllers/HomeControllers/Tracker');
const isAuthenticated = require('../middlewares/ensureAuthenticated/IsAuthenticated');
const HomeRouter = require('express').Router();
const leaderboard = require('../controllers/HomeControllers/leaderboard');
const ask_sensei = require('../controllers/HomeControllers/Sensei')

HomeRouter.get('/:UserName',isAuthenticated,getLeetCodeStats);
HomeRouter.post('/Sensei',ask_sensei)

module.exports = HomeRouter;