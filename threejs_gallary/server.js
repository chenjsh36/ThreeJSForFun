const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const r_demo = require('./back/router/r_demo');
const PREURL = '/threejs';
let app = express();


app.set('views', path.join(__dirname, 'front/dist/view'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));

app.use(`${PREURL}/static`, express.static('front/dist/static'));

app.use(`${PREURL}/demo`, r_demo);


let product = process.env.SSH_CLIENT ? false : true;
let ip = product === true ? '127.0.0.1' : serverConfig.IP;
let port = product === true ? 3088 : serverConfig.port;
let server = app.listen(port, ip, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('ThreeJS Gallary App listening at http://%s:%s', host, port);
});
