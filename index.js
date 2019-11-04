const express = require('express');

const CashID = require('cashid');
const cashid = new CashID('auth.cashid.org', '/');

const bodyParser = require('body-parser');

const conf = require('./config/config');
const env = process.env.NODE_ENV || 'development';
const knex = require('knex')(conf[`${env}`]);

const server = express();
const port = 4000;
server.use(bodyParser.json());
server.use(express.static('public'));

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

async function saveRequest(cashIDObj, parsed) {
  const { request, address, signature } = cashIDObj;

  let rows = await knex('Requests').insert({
    request,
    address,
    signature,
    action: parsed.parameters.action,
    data: parsed.parameters.data,
    raw: parsed.parameters
  });

  return rows;
}

function cleanObj(obj) {
  const clean = obj.map(x => {
    delete x.id;
    delete x.last_updated;
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

  await saveRequest(cashIDObj, parsed);
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

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
