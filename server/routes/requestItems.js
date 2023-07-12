const { Router } = require("express");

const { isAdmin, Auth } = require("../middleware/auth");
const { getRequestedItems, approveItemRequest } = require("../controller/itemController");
const { sendMail } = require("../nodemailer/email");
const router = Router();
router.use(Auth);
router.route("/").get(isAdmin, getRequestedItems);
router.route("/approveRequestItem").put(isAdmin, approveItemRequest);
router.route('/sendMail').post(sendMail)

module.exports = router;
