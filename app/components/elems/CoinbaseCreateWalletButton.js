import React, { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import CoinbaseWalletLogo from './CoinbaseWalletLogo';

const buttonStyles = {
  border: '1px solid white',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: 18,
  borderRadius: 11,
};

const chain = process.env.PROD ? 8453 : 84532;

// const sdk = new CoinbaseWalletSDK({
//   appName: 'CHOMP Legacy',
//   appLogoUrl: `${process.env.NEXT_PUBLIC_URL}/img/logo.svg`,
//   appChainIds: [chain],
// });

// const provider = sdk.makeWeb3Provider();

// console.log('==== sdk', sdk)
// console.log('==== provider', provider)

export default function CoinbaseCreateWalletButton() {
  const { connectors, connect, data } = useConnect();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    );

    console.log('=== coinbaseWalletConnector', coinbaseWalletConnector)

    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  console.log('=== data in coinbase smart wallet', data)

  return (
    <button 
      style={buttonStyles} 
      onClick={createWallet} 
      className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
    >
      <span className="mr-1"><CoinbaseWalletLogo /></span>
      Create Wallet
    </button>
  );
}

// export default function CoinbaseCreateWalletButton({ setAccount }) {
//   const createWallet = useCallback(async () => {
//     try {
//       const [address] = await provider.request({
//         method: 'eth_requestAccounts',
//       });
//       console.log('==== address in BTN', address)
//       setAccount(address);
//     } catch (error) {
//       // handleError(error);
//       console.log('Error in createWallet', error)
//     }
//   }, [setAccount]);

//   return (
//     <button 
//       style={buttonStyles} 
//       onClick={createWallet} 
//       className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
//     >
//       <span className="mr-1"><CoinbaseWalletLogo /></span>
//       Create Wallet
//     </button>
//   );
// }
