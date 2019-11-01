const express = require('express');

const CashID = require('cashid');
const cashid = new CashID('auth.cashid.org', '/');

const bodyParser = require('body-parser');

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

server.post('/api/auth', async (req, res) => {
  const { request, address, signature } = req.body;
  const cashIDObj = { request, address, signature };

  try {
    validateRequest(cashIDObj);
  } catch (error) {
    return res.status(500).send(error);
  }

  const test = parseRequest(request);
  console.log('test', test);
  // create db entry with timestamp
  // combine with req body

  return res.status(200).send(test);
});

server.post('/api/request', async (req, res) => {
  const { action, data, required, optional } = req.body;
  console.log('posted data', req.body);

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
  console.log('cashIDObj', cashIDObj);

  let valid = validateRequest(cashIDObj);
  res.send(valid);
});

server.get('/', async (req, res) => {
  const html = require('./public/cashidHtml');

  return res.status(200).send(html);
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
