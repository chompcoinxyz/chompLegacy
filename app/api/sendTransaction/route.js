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


// export default async function handler(req, res) {
  export async function POST(req) {
  console.log('===== req.method in sendTransaction', req.method)
  if (req.method === 'POST') {
    // const body = req.body;  // Directly accessible in Next.js API routes
    const body = req.body; 
    console.log('Received req.body:', req.body);

    const { functionName } = await req.json()
    console.log('Received functionName:', functionName);

    // Create a smart account
    const rpcUrl = process.env.RPC_URL;  
    console.log('==== sendTransaction: rpcUrl', rpcUrl)

    const publicClient = createPublicClient({ transport: http(rpcUrl) });
    console.log('==== sendTransaction: publicClient', publicClient)

    const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
      privateKey: process.env.PRIVATE_KEY,
      factoryAddress: process.env.FACTORY_ADDRESS,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });

    console.log('==== sendTransaction: simpleAccount', simpleAccount)
    console.log('==== sendTransaction: process.env.NEXT_PUBLIC_PROD', process.env.NEXT_PUBLIC_PROD)

    // Create the Paymaster
    // const chain = process.env.NEXT_PUBLIC_PROD === 'true' ? base : baseSepolia;
    const chain = baseSepolia;
    console.log('==== sendTransaction: chain', chain)

    const cloudPaymaster = createPimlicoPaymasterClient({
      chain,
      transport: http(rpcUrl),
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    console.log('==== sendTransaction: cloudPaymaster', cloudPaymaster)

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      // chain: baseSepolia,
      chain,
      bundlerTransport: http(rpcUrl),
      middleware: {
        sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
      },
    });
    console.log('==== sendTransaction: smartAccountClient', smartAccountClient)
    console.log('==== sendTransaction: chompLegacyABI?.length', chompLegacyABI?.length)

    let abi = functionName !== 'approve' ? chompLegacyABI : chompCoinABI;

    // Send the sponsored transaction
    const callData = encodeFunctionData({
      abi,
      // functionName: "mintTo",
      functionName: functionName,
      args: [smartAccountClient.account.address, 0],
    });
    console.log('==== sendTransaction: process.env.RPC_URL', process.env.RPC_URL)
    console.log('==== sendTransaction: process.env.NEXT_PUBLIC_PROD', process.env.NEXT_PUBLIC_PROD)
    console.log('==== sendTransaction: callData', callData)
    console.log('==== sendTransaction: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    console.log('==== sendTransaction: process.env.NEXT_PUBLIC_TOKEN_ADDRESS', process.env.NEXT_PUBLIC_TOKEN_ADDRESS)
    
    let to = functionName !== 'approve' ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
    console.log('==== sendTransaction: to', to)

    const txHash = await smartAccountClient.sendTransaction({
      account: smartAccountClient.account,
      // to: "0x66519FCAee1Ed65bc9e0aCc25cCD900668D3eD49",
      to,
      data: callData,
      // value: 0n,
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


// export async function POST(request) {
//   return new Response('Hello, Next.js!')
// }

