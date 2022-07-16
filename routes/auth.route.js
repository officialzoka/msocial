const router = require('express').Router();
const Controller = require('../controllers/auth.controller');

router.post('/login', Controller.Login);
router.post('/register', Controller.Register);
router.post('/verify', Controller.SendEmailActivation);
router.get('/verify/:token/:userId', Controller.ActivateUserEmail);

module.exports = router;
