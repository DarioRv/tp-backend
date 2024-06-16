const TransaccionModel = require('../models/transaccion.model');
const transaccionController = {};

transaccionController.getAll = async (req, res) => {
  if (req.query.emailCliente) {
    const transacciones = await TransaccionModel.find({
      emailCliente: req.query.emailCliente,
    });

    return res.json({ data: transacciones });
  }

  if (req.query.monedaOrigen && req.query.monedaDestino) {
    const transacciones = await TransaccionModel.find({
      monedaOrigen: req.query.monedaOrigen,
      monedaDestino: req.query.monedaDestino,
    });

    return res.json({ data: transacciones });
  }

  const transacciones = await TransaccionModel.find();
  res.json({ data: transacciones });
};

transaccionController.create = async (req, res) => {
  const transaccion = new TransaccionModel(req.body);

  try {
    const transaccionGuardada = await transaccion.save();
    res.status(201).json({ data: transaccionGuardada });
  } catch (err) {
    res.status(400).json({
      status: '400',
      message: 'Error al crear la transacción',
    });
  }
};

module.exports = transaccionController;
