const EspectadorModel = require('../models/espectador.model');
const userController = {};

userController.getAll = async (req, res) => {
  const espectadores = await EspectadorModel.find();
  res.json({ data: espectadores });
};

userController.getById = async (req, res) => {
  const id = req.params.id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const espectador = await EspectadorModel.findById();
    res.json(espectador);
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha encontrado un espectador con el id '${id}'`,
    });
  }
};

userController.create = async (req, res) => {
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

userController.deleteById = async (req, res) => {
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

module.exports = userController;
