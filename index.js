const web3 = require('web3');
const express = require('express');
var bodyParser  = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var path = require('path');
var request = require('request');
const fs = require('fs');
const { Gateway, Wallets } = require('fabric-network');


let myContract = 0;
async function connect() {
    try {
        const ccpPath = path.resolve(__dirname, 'mychannel_tensorplace_profile.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('admin');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        myContract = network.getContract('tensorplace');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

connect();

app.post('/create', function (req, res) {
    console.log(req.body)
    async function runBlockChain(req,res) {
        let action = req.body.action
        if (action === 'createSeller') {
            console.log('createSeller', req.body.id, req.body.name,req.body.email, req.body.reputation, req.body.balance)
            await myContract.submitTransaction('createSeller', req.body.id, req.body.name,req.body.email, req.body.reputation, req.body.balance);
        } else if (action === 'createBuyer') {
            await myContract.submitTransaction('createBuyer', req.body.id, req.body.name,req.body.email, req.body.balance);
        } else if (action === 'createProduct') {
            await myContract.submitTransaction('createProduct', req.body.id, req.body.sellerId, req.body.name, req.body.description, req.body.url, req.body.price, req.body.ratings);
        } else if (action === 'createTransaction') {
            await myContract.submitTransaction('createTransaction', req.body.id, req.body.productId, req.body.buyerId);
        } else if (action === 'createToken') {
            await myContract.submitTransaction('createToken', req.body.id, req.body.amount);
        } else if (action === 'createReview') {
            console.log('createReview', req.body.id, req.body.buyerId, req.body.productId, req.body.review, req.body.extraQuestion, req.body.ratingDoc, req.body.ratingReadability, req.body.ratingDevResponse)
            await myContract.submitTransaction('createReview', req.body.id, req.body.buyerId, req.body.productId, req.body.review, req.body.extraQuestion, req.body.ratingDoc, req.body.ratingReadability, req.body.ratingDevResponse);
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({status: 200}));
    }
    runBlockChain(req,res)
});

app.get('/query', function (req, res) {
    console.log(req.query)
    async function runBlockChain(req,res) {
        let id= req.query.id
        let action = req.query.action
        const result = await myContract.evaluateTransaction('query', id);
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.end(result.toString());
    }
    runBlockChain(req,res)
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))