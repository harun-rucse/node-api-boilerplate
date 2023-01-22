const express = require('express');
const userController = require('../controllers/user-controller');
const { protect, verified } = require('../middlewares/auth-middleware');
const { uploadAvatar, saveImageUrl } = require('../middlewares/image-middleware');
const { checkPermission } = require('../middlewares/permission-middleware');

const router = express.Router();

router.use(protect);

router.get('/my-profile', verified, userController.getMyProfile);
router.patch('/update-me', [verified, uploadAvatar, saveImageUrl('User')], userController.updateMe);

router
  .route('/')
  .get(checkPermission, userController.getAllUsers)
  .post(checkPermission, [uploadAvatar, saveImageUrl('User')], userController.createNewUser);

router
  .route('/:id')
  .get(checkPermission, userController.getOneUser)
  .patch(checkPermission, userController.updateOneUser)
  .delete(checkPermission, userController.deleteOneUser);

module.exports = router;
