import { HardhatUserConfig, task, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const lazyImport = async (module: any) => {
    return await import(module);
};

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    networks: {
        goerli: {
            url: process.env.RPCURL_GOERLI,
            chainId: 5,
            accounts: [process.env.PRIVATE_KEY as string]
        },
        sepolia: {
            url: process.env.RPCURL_SEPOLIA,
            chainId: 11155111,
            accounts: [process.env.PRIVATE_KEY as string]
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};

task("available-networks", "Prints the available networks")
    .setAction(async () => {
        const { availableNetworks } = await lazyImport("./scripts/helpers");
        const networks = availableNetworks();

        console.log("Available networks:");

        networks.forEach((network: string) => {
            console.log(network);
        }
        );
    });

task("deploy", "Deploys contracts to a network")
    .addParam("privateKey", "Private key of the account to deploy from")
    .addParam("networkName", "The network to deploy to", "localhost")
    .setAction(async ({ privateKey, networkName }, { run }) => {
        const { main } = await lazyImport("./scripts/deploy-pk");
        const [contractAddress, owner] = await main(privateKey, networkName);

        await run("owner", { owner });
    });

subtask("owner", "Prints the owner of the contract")
    .addParam("owner", "The owner of the contract")
    .setAction(async ({ owner }) => {
        console.log("The owner of the contract is:", owner);
    });

export default config;
