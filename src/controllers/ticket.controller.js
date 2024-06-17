const TicketModel = require('../models/ticket.model');
const ticketController = {};

ticketController.getAll = async (req, res) => {
  if (req.query.categoria) {
    const tickets = await TicketModel.find({
      categoriaEspectador: req.query.categoria,
    });
    return res.json({ data: tickets });
  }

  const tickets = await TicketModel.find();

  res.json({ data: tickets });
};

ticketController.getById = async (req, res) => {
  const id = req.params.id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const ticket = await TicketModel.findById(id);
    res.json({ data: ticket });
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha encontrado el ticket con el id '${id}'`,
    });
  }
};

ticketController.create = async (req, res) => {
  const ticket = new TicketModel(req.body);

  try {
    const ticketGuardado = await ticket.save();
    res.status(201).json({ data: ticketGuardado });
  } catch (err) {
    res.status(400).json({
      status: '400',
      message: 'Error al crear el ticket',
    });
  }
};

ticketController.update = async (req, res) => {
  const id = req.body._id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const ticket = await TicketModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ data: ticket });
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha podido actualizar el ticket con el id '${id}'`,
    });
  }
};

ticketController.deleteById = async (req, res) => {
  const id = req.params.id;
  if (!id && !isValidObjectId(id)) {
    return res.status(400).json({
      status: '400',
      message: 'El ID no es válido',
    });
  }

  try {
    const deleted = await TicketModel.findByIdAndDelete(id);
    res.json({
      data: !!deleted,
    });
  } catch (err) {
    res.status(404).json({
      status: '404',
      message: `No se ha podido eliminar el ticket con el id '${id}'`,
    });
  }
};

module.exports = ticketController;
