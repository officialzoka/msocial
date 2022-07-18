const router = require('express').Router();
const USER = require('./controllers/user.controller');

router.post('/search/:query', USER.SearchUsers);
router.post('/follow/:userId', USER.FollowUser);
router.post('/unfollow/:userId', USER.UnfollowUser);
router.post('/approve-follow/:userId', USER.ApproveFollow);
router.post('/reject-follow/:userId', USER.RejectFollow);

module.exports = router;
