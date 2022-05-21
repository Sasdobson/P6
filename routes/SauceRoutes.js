const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/SauceController');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/Multer-config');


router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
