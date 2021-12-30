const { task } = require('hardhat/config')

const erc20ABI = require('../abi/ERC20.json')
const swanPaymentABI = require('../abi/SwanPayment.json')

const one = '1000000000000000000'
const ten = '10000000000000000000'
const oneHundred = '100000000000000000000'
const oneThousand = '1000000000000000000000'

const overrides = {
  gasLimit: 9999999,
}

task('lockTokens', 'make payment for file by locking tokens')
  .addParam('cid', 'cid of the file')
  .setAction(async ({ cid }) => {
    const usdcAddress = network.config.usdcAddress
    const recipientAddress = network.config.mcp.fs3Recipient
    const gatewayContractAddress = network.config.swanPaymentAddress

    const [payer] = await ethers.getSigners()

    const USDCInstance = new ethers.Contract(usdcAddress, erc20ABI)
    await USDCInstance.connect(payer).approve(
      gatewayContractAddress,
      oneThousand,
    )

    const paymentInstance = new ethers.Contract(
      gatewayContractAddress,
      swanPaymentABI,
    )

    const tx = await paymentInstance.connect(payer).lockTokenPayment(
      {
        id: cid,
        minPayment: one,
        amount: ten,
        lockTime: 86400 * 6, // 6 days
        recipient: recipientAddress, //todo:
      },
      overrides,
    )

    await tx.wait()

    console.log(tx.hash)

    //generate metadata
  })
