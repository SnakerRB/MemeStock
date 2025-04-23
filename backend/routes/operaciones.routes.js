const express = require('express');
const router = express.Router();
const operacionesController = require('../controllers/operaciones.controller');

router.post('/', operacionesController.registrarOperacion);
router.get('/:userId', operacionesController.listarOperaciones);

module.exports = router;
