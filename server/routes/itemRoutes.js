const { Router } = require("express");
const {
  createNewItem,
  getItemsById,
  getAllItems,
  requestItems,
  
} = require("../controller/itemController");
const { isAdmin, Auth } = require("../middleware/auth");
const router = Router();
router.use(Auth);

router.route("/:id").get(getItemsById);
router.route("/").get(getAllItems);
router.route("/").post(isAdmin, createNewItem);
router.route("/requestItem").post(requestItems);


module.exports = router;
