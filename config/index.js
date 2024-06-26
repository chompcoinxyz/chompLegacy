// import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

// import { cookieStorage, createStorage } from 'wagmi';
// import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';

// export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

// if (!projectId) throw new Error('Project ID is not defined')

// const metadata = {
//   name: 'CHOMP Legacy',
//   description: 'CHOMP Legacy Staking and Minting',
//   url: 'https://chomplegacy.com',
//   // icons: ['https://chomp-five.vercel.app/img/logo.svg']
//   icons: []
// }

// // Create wagmiConfig
// const chains = [base, baseSepolia];

// export const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage
//   }),
// });
