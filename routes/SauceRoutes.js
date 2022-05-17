// const express = require('express');
// const router = express.Router();

// const sauceCtrl = require('../controllers/SauceController');

// router.get('/hello', sauceCtrl.hello);

// /**
//  * Créer les routes pour lister toutes les sauces. une sauce, supprimer une sauce, mettre à jour une sauce, like / dislike
//  */


// module.exports = router;
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
// router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
