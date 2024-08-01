import { http, createPublicClient, encodeFunctionData } from 'viem';
import { base, baseSepolia } from "viem/chains";
import {
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V06,
} from "permissionless";
// import { privateKeyToSimpleSmartAccount } from "permissionless/accounts";
// import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import chompLegacyABI from '../../../abis/ChompLegacyABI.json';
import chompCoinABI from '../../../abis/ChompCoinABI.json';


  export async function POST(req) {
  console.log('===== req.method in sendTransaction', req.method)
  if (req.method === 'POST') {
    const { functionName } = await req.json()
    // console.log('Received functionName:', functionName);

    // Create a smart account
    const rpcUrl = process.env.RPC_URL;  
    const publicClient = createPublicClient({ transport: http(rpcUrl) });

    const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
      privateKey: process.env.PRIVATE_KEY,
      factoryAddress: process.env.FACTORY_ADDRESS,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });

    // Create the Paymaster
    const chain = baseSepolia;
    // console.log('==== sendTransaction: chain', chain)

    const cloudPaymaster = createPimlicoPaymasterClient({
      chain,
      transport: http(rpcUrl),
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    // console.log('==== sendTransaction: cloudPaymaster', cloudPaymaster)

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain,
      bundlerTransport: http(rpcUrl),
      middleware: {
        sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
      },
    });
    // console.log('==== sendTransaction: smartAccountClient', smartAccountClient)

    let abi = functionName !== 'approve' ? chompLegacyABI : chompCoinABI;

    // Send the sponsored transaction
    const callData = encodeFunctionData({
      abi,
      functionName: functionName,
      args: [smartAccountClient.account.address, 0],
    });
    
    let to = functionName !== 'approve' ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

    const txHash = await smartAccountClient.sendTransaction({
      account: smartAccountClient.account,
      to,
      data: callData,
      value: BigInt(0)
    });
    console.log("✅ Transaction successfully sponsored!");
    console.log(`🔍 View on Etherscan: https://${process.env.NEXT_PUBLIC_PROD === 'true' ? '' : 'sepolia.' }basescan.org/tx/${txHash}`);

    return Response.json({ txHash })
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


