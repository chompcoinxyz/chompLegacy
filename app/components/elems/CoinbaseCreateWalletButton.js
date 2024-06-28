import React, { useCallback, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import CoinbaseWalletLogo from './CoinbaseWalletLogo';
import Web3 from 'web3';

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

const sdk = new CoinbaseWalletSDK({
  appName: 'CHOMP Legacy',
  appLogoUrl: `${process.env.NEXT_PUBLIC_URL}/img/logo.svg`,
  appChainIds: [chain],
});

const provider = sdk.makeWeb3Provider();

// console.log('==== sdk', sdk)
// console.log('==== provider', provider)

export default function CoinbaseCreateWalletButton({ setAccount, setWeb3, updateProvider }) {
  const { connectors, connect, data } = useConnect();
  const { address, status, accountStatus } = useAccount()
  const connector = connectors[0];
  const { disconnect } = useDisconnect();

  console.log('==== connector in CoinbaseCreateWalletButton', connector)
  console.log('==== address in CoinbaseCreateWalletButton', address)
  console.log('==== accountStatus in CoinbaseCreateWalletButton', accountStatus)
  console.log('==== accountStatus?.status in CoinbaseCreateWalletButton', accountStatus?.status)
  // console.log('==== status in CoinbaseCreateWalletButton', status)

  const createWallet = useCallback(() => {
    console.log('=== createWallet...')

    const coinbaseWalletConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    );

    console.log('=== coinbaseWalletConnector', coinbaseWalletConnector)
    console.log('=== data in hook', data) 

    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });

      // const provider = await coinbaseWalletConnector.getProvider();
      // // const web3Instance = new Web3(coinbaseWalletConnector.getProvider());
      // console.log('==== web3Instance', web3Instance)
      // setWeb3(web3Instance);

      updateProvider(coinbaseWalletConnector)
    }

  }, [connectors, connect]);

  useEffect(() => {
    if (!address) return;
    // console.log('===== address in useEffect', address)
    setAccount(address);

    // const web3 = new Web3(provider);
    // setWeb3(web3);
  }, [address]);

  const handleDisconnectWallet = useCallback(() => {
    disconnect({ connector });
    setAccount(null)
  }, [disconnect]);

  console.log('=== data in coinbase smart wallet', data)

  return (
    <>
    {!status || status !== 'connected' ? (
      <button 
        style={buttonStyles} 
        onClick={createWallet} 
        className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
      >
        <span className="mr-1"><CoinbaseWalletLogo /></span>
        Create Wallet
      </button>
    ) : (
      <>
        {status === 'connected' && (
          <button 
            style={buttonStyles} 
            onClick={handleDisconnectWallet} 
            className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
          >
            <span className="mr-1"><CoinbaseWalletLogo /></span>
            Log Out
          </button>
        )}
      </>
    )}
      
    </>
  );
}


// const chain = process.env.PROD ? 8453 : 84532;

// const sdk = new CoinbaseWalletSDK({
//   appName: 'CHOMP Legacy',
//   appLogoUrl: `${process.env.NEXT_PUBLIC_URL}/img/logo.svg`,
//   appChainIds: [chain],
// });

// const provider = sdk.makeWeb3Provider();

// console.log('==== sdk', sdk)
// console.log('==== provider', provider)

// export default function CoinbaseCreateWalletButton({ setAccount, setWeb3 }) {
//   console.log('==== setWeb3 in CoinbaseCreateWalletButton', setWeb3)


//   const createWallet = useCallback(async () => {
//     try {
//       const [address] = await provider.request({
//         method: 'eth_requestAccounts',
//       });
//       console.log('==== address in BTN', address)
//       setAccount(address);

//       console.log("======= provider in USEEFFECT 22:", provider);

//       const web3 = new Web3(provider);
//       console.log("======= WEB3 in USEEFFECT 22:", web3);
      
//       setWeb3(web3);
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
