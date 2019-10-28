const express = require('express');

const CashID = require('cashid');
const cashid = new CashID('domain', 'auth');

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

server.post('/test', async (req, res) => {
  console.log('test endpoint', req.body);

  // let uri = cashid.createRequest(action, data, metadata);
  // return uri;

  res.send(req.body);
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
