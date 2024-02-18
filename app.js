require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const http = require('http');
const bodyParser = require('body-parser');
const { join } = require('path');

const port = parseInt(process.env.PORT) || 3002;

const app = express();
const server = http.createServer(app);
app.server = server;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('views', join(__dirname, 'views'));
app.set('port', port);

// moment.tz.add('Asia/Bangkok|ICT|-70|0|');
// process.env.TZ = 'Asia/Bangkok';

require('./routes')(app);
app.get('*', (req, res) => res.status(200).send({ message: 'Not found' }));

server.listen(port, () => {
	console.log(`App's running on port ${port}`);
});
