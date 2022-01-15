const { ethers } = require("ethers");
const dotenv = require('dotenv');

//ABIs
const IFactory = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const IPair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')  
const IRouter = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const IERC20 = require('@uniswap/v2-periphery/build/IERC20.json')

// LOAD Config
dotenv.config();
PRIVATE_KEY = process.env.PRIVATE_KEY;
CHAIN_URL = process.env.CHAIN_URL; // Extropy network
MY_ADDRESS = process.env.MY_ADDRESS; // Group3 Address 

// Token Addresses
const ExtropyCoin = '0x65e770f49625273e41f4b6790ce1105ac142f8a9';
const DAI = '0x40945338fd60044a2d56db8ba2ec46507590340c';
const wETH = '0x53380c9ebe8851a2c965dda342cae22e59144bfc';
// Uniswap address
const UniswapV2Router02 = '0xb39b143D38196F97c4F70Cf081dDB68A20425203';
const UniswapFactory = '0xeA697ea45e4a8AC74179E1C21cB5aD2AD7CCD4B3';

// Setup provider
var provider = new ethers.providers.JsonRpcProvider(CHAIN_URL);
provider.getBlockNumber().then((result) => {
  console.log("Current block number: " + result);
});

// Query the minimum returned swapping amountIn of fromToken for toToken
async function minReturnUni(fromToken, toToken, amountIn) {
    // connect to contracts & wallet
    const uniRouter = new ethers.Contract(UniswapV2Router02, IRouter.abi, provider);
    const uniFactory = new ethers.Contract(UniswapFactory, IFactory.abi, provider); 
    const wallet = new ethers.Wallet(PRIVATE_KEY);  
    console.log(`wallet public key ${wallet.publicKey}`);
    console.log(`uni factory ${await uniRouter.factory()}`);

    // get pair
    const pairAddr = await uniFactory.getPair(fromToken, toToken);
    const pair = new ethers.Contract(pairAddr, IPair.abi, provider);
    console.log(`uni pair ${pair}`);
    console.log(`uni pair token 0 ${await pair.token0()}, token 1 ${await pair.token1()}`) 

    // get reserves
    const values = await pair.getReserves();
    const reserve0 = values[0];
    const reserve1 = values[1];
    const timestamp = values[2];
    console.log(`reserve0 ${reserve0}, reserve1 ${reserve1}, timestamp ${timestamp}`)
    console.log(`fromToken ${fromToken}, token0 ${await pair.token0()}`)

    // finally query min returned
    var amountOut;
    if (ethers.utils.getAddress(fromToken) == await pair.token0()){
        const reserveIn = reserve0;
        const reserveOut = reserve1;
        amountOut = uniRouter.getAmountOut(amountIn, reserveIn, reserveOut)
    } else{
        const reserveIn = reserve1;
        const reserveOut = reserve0;
        amountOut = await uniRouter.getAmountOut(amountIn, reserveIn, reserveOut)
    }
    console.log(`amountOut ${await amountOut}`)
    return await amountOut
}

async function main(){
    amountIn = 10e10
    // Estimate return of trade DAI -> EXT
    const nExtropyCoins = await minReturnUni(DAI, ExtropyCoin, amountIn);
    // Estimate return of trade EXT -> DAI
    const nDAICoins = await minReturnUni(ExtropyCoin, DAI, nExtropyCoins);
    // Check we have similar amount of DAI that we started with
    console.log(`nDAICoins ${nDAICoins}, nExtropyCoins ${nExtropyCoins}`)
    // percentage = 
    console.log(`input/output = ${amountIn/nDAICoins}`)
} 

main()
