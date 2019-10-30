const html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="CashID is a decentralized authentication system working on Bitcoin Cash.">
        <meta name="author" content="CashID">

        <meta property="og:image" content="https://badger.bitcoin.com" />
        <meta name="twitter:image" content="https://badger.bitcoin.com">
        <meta name="twitter:image:src" content="https://badger.bitcoin.com">

        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="">
        <meta property="og:description" content="CashID is a decentralized authentication system working on Bitcoin Cash.">
        <title>CashID Dev Server</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/style.css">

    </head>

    <body>

        <div class="profile">
            <section id="wrapper">
                <header id="header">

                    <h1>CashID</h1>
                    <h2>An authentication system working on <span class="highlight"> Bitcoin Cash.</span></h2>
                    <br />
                    <h5>This development server is for accessibility and not meant to be used in production.</h5>
                </header>
            </section>
        </div>

        <section id="wrapper" class="home">
            <div class="about">
                <ol class="list-view">
                    <li>
                        <div class="list-detail">
                            <div class="_title-block">
                                <h3>How to use</h3>
                            </div>

                            <p class="_summary"> Send a <strong> POST </strong> request to https://auth.cashid.org with a body that looks like the following
                            <pre>
                            {
                                action: 'example string',
                                data: 'example string',
                                required: {
                                    identity: ['name', 'family'],
                                    position: ['country'],
                                    contact: ['email']
                                },optional: {
                                    identity: ['age', 'gender'],
                                    position: ['city']
                                }
                            }
                            </pre>
                            </p>

                            <p> or use a <strong> cURL </strong> </p>

                            <pre>curl --request POST \ --url https://auth.cashid.org/ \ --header 'content-type: application/json' \ --data '{ "action": "examplestring", "data": "examplestring", "required": { "identity": [ "name", "family" ], "position": [ "country" ], "contact": [ "email" ] }, "optional": { "identity": [ "age", "gender" ], "position": [ "city" ] } }'
                            </pre>

                            <p>
                            The server will respond with a cashid request that looks like

                            <pre>cashid:auth.cashid.org/?a=examplestring&d=examplestring&r=i12p1c1&o=i45p3&x=620050752%
                            </pre>

                            </p>
                        </div>
                    </li>

                    <li>


                        <div class="list-detail">
                            <div class="_title-block">
                                <h3>Using the CashID request</h3>
                            </div>
                            <p class="_summary"> This request must be opened by a compatible wallet (Badger wallet), where it will be signed.

                            <pre> const cashIDRequest = 'cashid:auth.cashid.org/?a=examplestring&d=examplestring&r=i12p1c1&o=i45p3&x=620050752%';

                            web4bch.bch.sign(web4bch.bch.defaultAccount, cashIDRequest, ( err, res ) => { // do stuff }
                            </pre>
                            </p>
                        </div>
                    </li>

                    <li>
                        <div class="list-detail">
                            <div class="_title-block">
                                <h3>Handling the Response</h3>
                            </div>
                            <p class="_summary">  The wallet will send a POST request to this development server and it will be viewable based on the <i>action</i> and <i>data</i> strings used to create the request. For example, If you used  action = 'foo' and data = 'bar', you can view the response data from  auth.cashid.org/foo/bar </p>
                        </div>
                    </li>


                    <li>
                        <div class="list-detail">
                            <div class="_title-block">
                                <h3>More Info</h3>
                            </div>
                            <p class="_summary"> For Developers, looking to integrate CashID, check out the
                                <a target="_blank" href="https://gitlab.com/cashid/protocol-specification">CashID Protocol Specification</a>.
                            </p>
                            <p class="_summary"> For a Javascript library , check out the <a target="_blank" href="https://github.com/paOol/CashID">CashID</a> npm package.
                            </p>
                        </div>
                    </li>
                </ol>
            </div>

        </section>

    </body>

    </html>
  `;

module.exports = html;
