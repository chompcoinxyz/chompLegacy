// 'use client'

// import React from 'react'
// import { config, projectId } from '../config/index'
// // import { config as web3ModalConfig, projectId } from '../config/index';
// import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiProvider } from 'wagmi';
// import Cookies from 'js-cookie';

// // Setup queryClient
// const queryClient = new QueryClient()

// if (!projectId) throw new Error('Project ID is not defined')

// // Create modal
// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
//   enableOnramp: true // Optional - false as default
// })

// // function Web3ModalProvider({ children, initialState }) {
// //   return (
// //     <WagmiProvider config={config} initialState={initialState}>
// //       <QueryClientProvider client={queryClient}>
// //         {children}
// //       </QueryClientProvider>
// //     </WagmiProvider>
// //   );
// // }
// function Web3ModalProvider({ children }) {
//   return <>{children}</>;
// }


// export default Web3ModalProvider;