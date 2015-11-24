var mysql = require('mysql');
var conector = require('../comun/conector_mysql');

module.exports.getPedidosCliente = function(codclien, callback) {
    var pedidos = [];
    var sql = "SELECT"
    sql += " sc.numpedcl AS numpedcl,";
    sql += " sc.codclien AS codclien,";
    sql += " sc.fecpedcl AS fecpedcl,";
    sql += " sc.fecentre AS fecentre,";
    sql += " sl2.total AS totalped,";
    sql += " sl.numlinea AS numlinea,";
    sql += " sl.codartic AS codartic,";
    sql += " sl.nomartic AS nomartic,";
    sql += " sl.precioar AS precioar,";
    sql += " sl.cantidad AS cantidad,";
    sql += " sl.servidas AS servidas,";
    sql += " sl.dtoline1 AS dtoline1,";
    sql += " sl.dtoline2 AS dtoline2,";
    sql += " sl.importel AS importel";
    sql += " FROM scaped AS sc";
    sql += " LEFT JOIN sliped AS sl ON sl.numpedcl = sc.numpedcl";
    sql += " LEFT JOIN (SELECT numpedcl, SUM(importel) AS total";
    sql += " FROM sliped";
    sql += " GROUP BY numpedcl) AS sl2 ON sl2.numpedcl = sc.numpedcl";
    sql += " WHERE sc.codclien = ?";
    sql += " ORDER BY sc.fecpedcl DESC,sc.numpedcl,sl.numlinea;";
    sql = mysql.format(sql, codclien);
    var connection = conector.getConnectionAriges();
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
            closeConnection(connection);
            return;
        }
        // hay que procesar a JSON
        callback(null, fnPedidosFromDbToJson(result));
        conector.closeConnection(connection);
    });
};

var fnPedidosFromDbToJson = function(pedidos) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var numpedAnt = 0;
    for (var i = 0; i < pedidos.length; i++) {
        var pedido = pedidos[i];
        if (numpedAnt != pedido.numpedcl) {
            // es una pedido nueva
            // si ya habiamos procesado una la pasamos al vector
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                numpedcl: pedido.numpedcl,
                fecpedcl: pedido.fecpedcl,
                fecentre: pedido.fecentre,
                totalped: pedido.totalped,
                lineas: []
            };
            numpedAnt = pedido.numpedcl;
        }
        // siempre se procesa una linea
        if (pedido.numlinea) {
            linJs = {
                numlinea: pedido.numlinea,
                codartic: pedido.codartic,
                nomartic: pedido.nomartic,
                precioar: pedido.precioar,
                cantidad: pedido.cantidad,
                servidas: pedido.servidas,
                dtoline1: pedido.dtoline1,
                dtoline2: pedido.dtoline2,
                importel: pedido.importel
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}
