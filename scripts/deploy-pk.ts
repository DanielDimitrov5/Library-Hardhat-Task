import { ethers } from "hardhat";
import { availableNetworks } from "./helpers";

export async function main(_privateKey: string, _network: string) {

    const networks = availableNetworks();

    let provider;

    if (_network.toLowerCase() === networks[0]) provider = new ethers.providers.JsonRpcProvider(process.env.RPCURL_GOERLI);

    if (_network.toLowerCase() === networks[1]) provider = new ethers.providers.JsonRpcProvider(process.env.RPCURL_SEPOLIA);

    if(_network.toLowerCase() === networks[2]) provider = ethers.provider;

    const wallet = new ethers.Wallet(_privateKey, provider);

    const Library = await ethers.getContractFactory("Library", wallet);
    const library = await Library.deploy();
  
    await library.deployed();  

    console.log(`Library contract is deployed to ${library.address}`);

    const owner = await library.owner();

    return [library.address, owner];
}