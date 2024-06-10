const ProductoModel = require('../models/producto.model');
const productoController = {};

productoController.getAll = async (req, res) => {
  const productos = await ProductoModel.find();

  res.json({ data: productos });
};

productoController.getFeatured = async (req, res) => {
  const productosDestacados = await ProductoModel.find({ destacado: true });

  res.json({ data: productosDestacados });
};

productoController.create = async (req, res) => {
  const producto = new ProductoModel(req.body);

  try {
    const productoGuardado = await producto.save();
    res.json({ data: productoGuardado });
  } catch (err) {
    res.status(400).json({
      status: '400',
      message: 'Error al crear el producto',
    });
  }
};

productoController.update = async (req, res) => {
  const producto = req.body;

  try {
    const productoActualizado = await ProductoModel.findOneAndUpdate(
      { _id: producto._id },
      { ...producto }
    );
    res.json({ data: productoActualizado });
  } catch (err) {
    res.status(400).json({
      status: '400',
      message: 'Error al actualizar el producto',
    });
  }
};

productoController.deleteById = async (req, res) => {
  const id = req.params.id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const deleted = await ProductoModel.deleteOne({ _id: id });
    res.json({ data: !!deleted });
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha podido eliminar el producto con el id '${id}'`,
    });
  }
};

module.exports = productoController;
