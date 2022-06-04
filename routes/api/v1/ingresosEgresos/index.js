const express = require('express');
const router = express.Router();
const IngresosEgresos = require('../../../../libs/ingresosEgresos');
const IngresosEgresosDao = require('../../../../dao/models/IngresosEgresosDao');
const ingresosEgresosDao = new IngresosEgresosDao();
const ingresosEgresos = new IngresosEgresos(ingresosEgresosDao);
ingresosEgresos.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await ingresosEgresos.getIngresosEgresosVersion();
    return res.status(200).json(versionData);
  } catch ( ex ) {
    // manejar el error que pueda tirar el controlador
    console.error('Error Ingresos Egresos', ex);
    return res.status(502).json({'error': 'Error Interno de Server'});
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const incomeExpenses = await ingresosEgresos.getIngresosEgresos();
    return res.status(200).json(incomeExpenses);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const {codigo} = req.params;
    if (!(/^\d+$/.test(codigo))){
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await ingresosEgresos.getIngresoEgresoById({codigo: parseInt(codigo)});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {
        type = '',
        description = '',
        amount = '',
        category = ''} = req.body;
    if (/^\s*$/.test(category)) {
        return res.status(400).json({
          error: 'Se espera valor de type'
        });
      }
    if (/^\s*$/.test(description)) {
      return res.status(400).json({
        error: 'Se espera valor de description'
      });
    }
    if (/^\s*$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor de amount'
      });
    }
    if (!(/^(INCOME)|(EXPENSE)$/.test(type))) {
      return res.status(400).json({
        error: 'Se espera valor de type en INCOME o EXPENSE'
      });
    }
    const newIngresoEgreso = await ingresosEgresos.addIngresoEgreso({
        type,
        description,
        amount:parseFloat(amount),
        category});
    return res.status(200).json(newIngresoEgreso);
  } catch(ex){
    console.error(ex);
    return res.status(502).json({error:'Error al procesar solicitud'});
  }
});

router.put('/update/:codigo', async (req, res)=>{
  try {
    const {codigo} = req.params;
    if(!(/^\d+$/.test(codigo))) {
      return res.status(400).json({error:'El codigo debe ser un dígito válido.'});
    }
    const {description, type} = req.body;
    if (/^\s*$/.test(description)) {
      return res.status(400).json({
        error: 'Se espera valor de description'
      });
    }
    const {amount} = req.body;
    if (/^\s*$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor de amount'
      });
    }
    const {category} = req.body;
    if (/^\s*$/.test(category)) {
      return res.status(400).json({
        error: 'Se espera valor de category'
      });
    }
    if (!(/^(INCOME)|(EXPENSE)$/.test(type))) {
      return res.status(400).json({
        error: 'Se espera valor de type en INCOME o EXPENSE'
      });
    }

    const updateResult = await ingresosEgresos.updateIngresoEgreso({codigo:parseInt(codigo), type, description, amount:parseFloat(amount), category });

    if (!updateResult) {
      return res.status(404).json({error:'Ingreso o Egreso no encontrado.'});
    }
    return res.status(200).json({updatedIngresoEgreso:updateResult});

  } catch(ex) {
    console.error(ex);
    res.status(500).json({error: 'Error al procesar solicitud.'});
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedIngresoEgreso = await ingresosEgresos.deleteIngresoEgreso({ codigo: parseInt(codigo)});

    if (!deletedIngresoEgreso) {
      return res.status(404).json({ error: 'Ingreso o Egreso no encontrada.' });
    }
    return res.status(200).json({ deletedIngresoEgreso});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;