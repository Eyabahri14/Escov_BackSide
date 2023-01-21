const express = require("express");

const router = express.Router();
const Newslettercontroller = require("../controllers/Newsletter");

// TODO add auth middleware to all the routes
router.post("/", Newslettercontroller.createNewsletters);

router.put("/:id", Newslettercontroller.modifyNewsletter);

router.get("/getAll", Newslettercontroller.getAll);

router.get("/:id", Newslettercontroller.getOneNewsletter);

router.delete("/:id", Newslettercontroller.deleteOneNewsletter);
module.exports = router;