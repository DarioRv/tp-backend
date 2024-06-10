const express = require('express');
const router = express.Router();

const espectadorController = require('../controllers/espectador.controller');

router.get('/', espectadorController.getAll);
router.get('/:id', espectadorController.getById);
router.post('/', espectadorController.create);
router.delete('/:id', espectadorController.deleteById);

module.exports = router;
