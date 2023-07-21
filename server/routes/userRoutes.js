const express = require('express');
const userController = require(`./../controllers/userController`);
const authController = require(`./../controllers/authController`);

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/updateMyPassword").patch(authController.protect, authController.updatePassword);
router.route("/logout").patch(authController.logout);



router
    .route("/")
    .get(authController.protect,authController.restrictTo('admin'),userController.getAll)
    .post(authController.protect,authController.restrictTo('admin'),userController.createOne);

router
    .route("/:id")
    .get(authController.protect,authController.restrictTo('admin'),userController.getOne)   
    .patch(authController.protect,authController.restrictTo('admin'),userController.updateOne)
    .delete(authController.protect,authController.restrictTo('admin'),userController.deleteOne);


module.exports = router;