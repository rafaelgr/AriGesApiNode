var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var async = require('async');

module.exports.getIndicadores = function(codclien, codmacta, callback) {
    // como son llamadas diversas hay que hacer espera asíncrona
    async.parallel([
        function(fnFinal) {
            // obtener el número de ofertas
            var sql = ""
        },
        function(fnFinal) {
            // obtener el número de pedidos
        },
        function(fnFinal) {
            // obtener el número de albaranes
        },
        function(fnFinal) {
            // obtener saldo pendiente y vencido
        }
    ], function(err, results) {
    	if (err){
    		callback(err, null);
    		return;
    	}
    	var indicadores = {
    		ofertas: results[0],
    		pedidos: results[1],
    		albaranes: results[2],
    		saldoPendiente: results[3].saldoPendiente,
    		saldoVencido: results[3].saldoVencido
    	}
    	callback(null, indicadores);
    });
};
