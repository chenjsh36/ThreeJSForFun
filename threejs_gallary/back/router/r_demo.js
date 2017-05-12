var express = require('express');
var path = require('path');

/*
    Exports and Create Server
 */
var app = module.exports = express();   

app.set('views', path.join(__dirname, './../../front/dist/view'));

app.get('/:filename', function(req, res) {
    var filename = req.params.filename;
    console.log('req ', req.params.filename)
    res.render(filename, {
        title: 'Demo' + req.params.filename
    });
});