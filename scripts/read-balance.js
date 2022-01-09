const { ethers } = require("ethers");
const IERC20 = require("../abis/IERC20.json")
var url = "http://18.130.233.246:9454";

// Setup provider
var provider = new ethers.providers.JsonRpcProvider(url);
provider.getBlockNumber().then((result) => {
  console.log("Current block number: " + result);
});

// Group3 Address 
const MyAddress = '0x2e56320bc51cdbb343bea3ec9dba16b34bc718e9';
// Token Addresses
const ExtropyCoin = '0x65e770f49625273e41f4b6790ce1105ac142f8a9';
const DAI = '0x40945338fd60044a2d56db8ba2ec46507590340c';
const wETH = '0x53380c9ebe8851a2c965dda342cae22e59144bfc';
// Uniswap address
const UniswapV2Router02 = '0xb39b143d38196f97c4f70cf081ddb68a20425203';
// Sushi addresses
const SushiToken = '0x67c292e1e33e91c2e620f7b67c6f98ab78d9dc2a';
const MasterChef = '0x71ce53e2371b76372bf1c2d03ecc576d1cb91962';
const SushiBar = '0xae0c9b71522944a8910189cd88b3d056be257a1d';
const SushiMaker = '0xcdbcfa2243ad006cc62ba079d393cf28e0e3baf5';

async function getExtropyBalance(){
    const contract = new ethers.Contract(ExtropyCoin, IERC20, provider);
    const balance = await contract.balanceOf(MyAddress);
    const decimals = await contract.decimals(); 
    nTokens = balance.toBigInt()/(BigInt(10)**BigInt(decimals))
    console.log("Group3 extropy token balance: ", nTokens);
}

getExtropyBalance()
