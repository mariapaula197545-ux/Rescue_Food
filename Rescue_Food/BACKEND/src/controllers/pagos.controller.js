// Importa modelo pagos (DB)
const PagoModel = require('../models/pagos.model');

// Crear pago
const createPago = async (req, res) => {
  try {
    const { pedido_id, metodo_pago, referencia } = req.body; // datos body

    // Validación: Verifica que el identificador del pedido y el método de pago no estén vacíos
    if (!pedido_id || !metodo_pago) {
      return res.status(400).json({
        ok: false,
        msg: 'pedido_id y metodo_pago son obligatorios'
      });
    }

    const pedido = await PagoModel.getPedidoById(pedido_id); // busca pedido
    
    // Validación: Comprueba la existencia real del pedido antes de intentar procesar el pago
    if (!pedido) {
      return res.status(404).json({
        ok: false,
        msg: 'Pedido no encontrado'
      });
    }

    const pagoExistente = await PagoModel.getPagoByPedido(pedido_id); // valida si ya pagó
    
    // Validación de duplicidad: Evita registrar múltiples transacciones para un mismo pedido
    if (pagoExistente) {
      return res.status(409).json({
        ok: false,
        msg: 'Ese pedido ya tiene un pago registrado'
      });
    }

    // Registra la nueva transacción inyectando el total del pedido de forma automática
    const pagoId = await PagoModel.createPago({
      pedido_id,
      metodo_pago,
      referencia,
      monto: pedido.total, // toma total del pedido
      estado: 'pagado' // estado pago
    });

    await PagoModel.updatePedidoEstado(pedido_id, 'pagado'); // actualiza pedido

    const pago = await PagoModel.getPagoByPedido(pedido_id); // trae pago

    // Retorna éxito con los datos del pago o un respaldo con el ID generado mediante cortocircuito
    return res.status(201).json({
      ok: true,
      msg: 'Pago registrado correctamente',
      data: pago || { id: pagoId }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Obtener pago por pedido
const getPagoByPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params; // id pedido

    const pago = await PagoModel.getPagoByPedido(pedidoId); // consulta DB
    
    // Validación: Corta el flujo si la base de datos no arroja registros de pago para ese pedido
    if (!pago) {
      return res.status(404).json({
        ok: false,
        msg: 'No hay pago registrado para este pedido'
      });
    }

    return res.status(200).json({
      ok: true,
      data: pago
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message }); // error servidor
  }
};

// Exporta controladores
module.exports = {
  createPago,
  getPagoByPedido
};