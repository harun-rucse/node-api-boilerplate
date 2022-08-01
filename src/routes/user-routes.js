const express = require('express');
const userController = require('../controllers/user-controller');
const { protect, verified, restrictTo } = require('../middlewares/auth-middleware');
const { uploadAvatar, saveImageUrl } = require('../middlewares/image-middleware');

const router = express.Router();

router.use(protect);

router.get('/my-profile', verified, userController.getMyProfile);
router.patch('/update-me', [verified, uploadAvatar, saveImageUrl('User')], userController.updateMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(restrictTo('admin'), [uploadAvatar, saveImageUrl('User')], userController.createNewUser);

router
  .route('/:id')
  .get(restrictTo('admin'), userController.getOneUser)
  .patch(restrictTo('admin'), userController.updateOneUser)
  .delete(restrictTo('admin'), userController.deleteOneUser);

module.exports = router;
