const express = require('express');
const router = express.Router();
const mangoController = require('../controllers/mango.controller');
const upload = require('../middlewares/upload')



router.post('/', upload.single('image'),mangoController.createMango);

router.get('/', mangoController.getAllMangoes);

module.exports = router;
