const express = require("express");

const router = express.Router();
const Usercontroller = require("../controllers/User");

router.get('/alleq/:email', Usercontroller.getEq);
router.get("/getoneuser/:email",Usercontroller.getOneuser);


router.post('/postSocialLogin',Usercontroller.postSocialLogin);



module.exports = router;