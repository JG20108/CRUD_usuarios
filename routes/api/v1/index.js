const express = require('express');
const router = express.Router();

const categoriesRoutes = require('./categorias');
const usuariosRoutes = require('./usuarios');
const ingresosEgresosRoutes = require('./ingresosEgresos');

router.use('/categories', categoriesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/ingresosEgresos', ingresosEgresosRoutes);

module.exports = router;
