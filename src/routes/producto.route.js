const express = require('express');
const router = express.Router();

const productoController = require('../controllers/producto.controller');

router.get('/', productoController.getAll);
router.get('/featured', productoController.getFeatured);
router.post('/', productoController.create);
router.patch('/', productoController.update);
router.delete('/:id', productoController.deleteById);

module.exports = router;
