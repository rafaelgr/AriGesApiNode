var express = require('express');
var router = express.Router();
var indicadoresMysql = require('./indicadores_mysql');


router.get('/', function(req, res){
	var codclien = req.query.codclien;
	var codmacta = req.query.codmacta;
	if (codclien && codmacta){
		indicadoresMysql.getIndicadores(codclien, codmacta, function(err, result){

		});
	}else{
		res.status(400).send('Formato de la petición incorrecto');
	}
	
});

// exportar router
module.exports = router;