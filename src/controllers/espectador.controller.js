const EspectadorModel = require('../models/espectador.model');
const espectadorController = {};

espectadorController.getAll = async (req, res) => {
  const espectadores = await EspectadorModel.find();
  res.json({ data: espectadores });
};

espectadorController.getById = async (req, res) => {
  const id = req.params.id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const espectador = await EspectadorModel.findById(id);
    res.json({ data: espectador });
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha encontrado un espectador con el id '${id}'`,
    });
  }
};

espectadorController.create = async (req, res) => {
  const espectador = new EspectadorModel(req.body);

  try {
    const espectadorGuardado = await EspectadorModel.create(espectador);
    res.json({ data: espectadorGuardado });
  } catch (err) {
    res.status(400).json({
      status: '400',
      message: 'Error al crear el espectador',
      error: err,
    });
  }
};

espectadorController.deleteById = async (req, res) => {
  const id = req.params.id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const deleted = await EspectadorModel.findByIdAndDelete(id);
    res.json({ data: !!deleted });
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha podido eliminar el espectador con el id '${id}'`,
    });
  }
};

module.exports = espectadorController;
