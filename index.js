const express = require('express');
const cors = require('cors');

const CashID = require('cashid');
const cashid = new CashID('auth.cashid.org', '/');

const bodyParser = require('body-parser');

const conf = require('./config/config');
const env = process.env.NODE_ENV || 'development';
const knex = require('knex')(conf[`${env}`]);

const http = require('http');
const socketIo = require('socket.io');

const server = express();

const port = 4000;
server.use(cors());
server.use(bodyParser.json());
server.use(express.static('public'));

const httpServer = http.createServer(server);
const io = socketIo(httpServer);

let interval;
io.on('connection', socket => {
  console.log('New client connected');

  // prevent opening multiple connections for same client
  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => {
  //   console.log('do stuff');
  // }, 10000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

function generateURI(action, data, metadata) {
  return cashid.createRequest(action, data, metadata);
}

function validateRequest(obj) {
  return cashid.validateRequest(obj);
}

function parseRequest(uri) {
  return cashid.parseCashIDRequest(uri);
}

async function getRequests(action, data) {
  const rows = await knex('Requests')
    .where({
      action,
      data
    })
    .orderBy('created_at', 'desc')
    .limit(15);

  return rows;
}

function formatObj(cashIDObj, parsed) {
  const { request, address, signature } = cashIDObj;

  return {
    request,
    address,
    signature,
    action: parsed.parameters.action,
    data: parsed.parameters.data,
    nonce: parsed.parameters.nonce,
    raw: parsed.parameters
  };
}
async function saveRequest(formattedObj) {
  let rows = await knex('Requests').insert(formattedObj);

  return rows;
}

function cleanObj(obj) {
  const clean = obj.map(x => {
    delete x.id;
    delete x.last_updated;
    delete x.slp_address;
    return x;
  });

  return clean;
}

server.post('/api/auth', async (req, res) => {
  const { request, address, signature } = req.body;
  const cashIDObj = { request, address, signature };

  try {
    validateRequest(cashIDObj);
  } catch (error) {
    return res.status(500).send(error);
  }

  const parsed = parseRequest(request);

  const formattedObj = formatObj(cashIDObj, parsed);
  await saveRequest(formattedObj);

  // broadcast
  io.emit(`${action}${data}`, formattedObj);

  return res.status(200).send({ status: 'successs' });
});

server.post('/api/request', async (req, res) => {
  const { action, data, required, optional } = req.body;

  if (action === undefined) {
    return res.status(500).send('Missing CashID action parameter');
  }

  if (data === undefined) {
    return res.status(500).send('Missing CashID data parameter');
  }

  const metadata = { required, optional };

  const uri = generateURI(action, data, metadata);

  return res.status(200).send(uri);
});

server.post('/validate', (req, res) => {
  const { request, address, signature } = req.body;

  if (request === undefined) {
    return res.status(500).send('Missing CashID request URI');
  }

  if (address === undefined) {
    return res.status(500).send('Missing Bitcoin Cash Address');
  }

  if (signature === undefined) {
    return res.status(500).send('Missing Bitcoin Cash signature');
  }

  let cashIDObj = { request, address, signature };

  let valid = validateRequest(cashIDObj);
  res.send(valid);
});

server.get('/:action/:data', async (req, res) => {
  const { action, data } = req.params;

  if (action === undefined) {
    return res.status(500).send('Missing CashID action parameter');
  }

  if (data === undefined) {
    return res.status(500).send('Missing CashID data parameter');
  }

  const response = await getRequests(action, data);
  const cleaned = cleanObj(response);

  return res.status(200).send(cleaned);
});

server.get('/', async (req, res) => {
  const html = require('./public/cashidHtml');

  return res.status(200).send(html);
});

httpServer.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
