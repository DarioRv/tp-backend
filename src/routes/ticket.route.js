const express = require('express');
const router = express.Router();

const ticketController = require('../controllers/ticket.controller');

router.get('/', ticketController.getAll);
router.get('/:id', ticketController.getById);
router.post('/', ticketController.create);
router.patch('/', ticketController.update);
router.delete('/:id', ticketController.deleteById);

module.exports = router;
