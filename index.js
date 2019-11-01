const express = require('express');

const CashID = require('cashid');
const cashid = new CashID('auth.cashid.org', '/');

const bodyParser = require('body-parser');

const server = express();
const port = 4000;
server.use(bodyParser.json());

function generateURI(action, data, metadata) {
  let uri = cashid.createRequest(action, data, metadata);
  return uri;
}

function validateRequest(obj) {
  return cashid.validateRequest(obj);
}
server.use(express.static('public'));

server.post('/api/auth', async (req, res) => {
  const { action, data, required, optional } = req.body;
  console.log('posted data', req.body);

  if (action === undefined) {
    res.status(500).send('Missing CashID action parameter');
  }

  if (data === undefined) {
    res.status(500).send('Missing CashID data parameter');
  }

  const metadata = { required, optional };

  const uri = cashid.createRequest(action, data, metadata);

  return res.status(200).send(uri);
});

server.post('/validate', (req, res) => {
  const { request, address, signature } = req.body;

  if (request === undefined) {
    res.status(500).send('Missing CashID request URI');
  }

  if (address === undefined) {
    res.status(500).send('Missing Bitcoin Cash Address');
  }

  if (signature === undefined) {
    res.status(500).send('Missing Bitcoin Cash signature');
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
