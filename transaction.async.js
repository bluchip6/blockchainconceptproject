var Tx = require('ethereumjs-tx').Transaction

const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/a539b9d0308a43a4a4ea83cf66325f10')


const account1 = '0x5Ec11AD6b8F0BBf5086E6eeA6295942A1F5d7119' // Your account address 1
const account2 = '0x9b14eeE99808BaB2a4C6492D37B4D771F75b7631' // Your account address 2

const privateKey1 = Buffer.from('6164e1403182b84b49de1a3d36dd9bf226fe32bc47448a02710cfb3b2d2ba556', 'hex')
const privateKey2 = Buffer.from('...', 'hex')


const sendTransaction = async(raw) => {
    return await web3.eth.sendSignedTransaction(raw)
}

const getTransactionCount = async(account) => {
    return await web3.eth.getTransactionCount(account)
}

const transferFunds = async(account1, account2, amount) => {

    let txCount = await getTransactionCount(account1)

    console.log("txCount returned: " + txCount)

    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
        to: account2,
        value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
    }

    const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })

    tx.sign(privateKey1)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    console.log("about to send transaction")
    let minedTransaction = await sendTransaction(raw)
    console.log(minedTransaction)
    console.log("txHash: " + minedTransaction.transactionHash)
}

const transfer = async() => {
    await transferFunds(account1, account2, "0.001")
}

transfer()