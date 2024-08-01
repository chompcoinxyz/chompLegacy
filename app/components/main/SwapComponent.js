// import { useCallback } from 'react';
// import { Address, Name } from '@coinbase/onchainkit/identity';
import { 
  Swap, 
  SwapAmountInput, 
  SwapToggleButton, 
  SwapButton, 
  SwapMessage,
} from '@coinbase/onchainkit/swap'; 
// import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useSendTransaction } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
const chain = process.env.NEXT_PUBLIC_PROD !== 'false' ? base : baseSepolia;
 
export default function SwapComponent({ address }) {
  // const { address } = useAccount();
  // const { sendTransaction } = useSendTransaction();

  const ETHToken = {    
    address: "",
    chainId: chain.id,
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH", 
  };

  const ChompCoin = { 
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    chainId: chain.id,
    decimals: 18,
    name: "ChompCoin",
    symbol: "CHOMP",
  };

  const swappableTokens = [ /*...*/ ];

  // console.log('===== address in swap', address)

  return (
    address ? (
      <Swap address={address}>
        <SwapAmountInput
          label="Sell"
          // swappableTokens={swappableTokens} 
          token={ETHToken} 
          type="from"
        /> 
        <SwapToggleButton /> 
        <SwapAmountInput
          label="Buy"
          // swappableTokens={swappableTokens} 
          token={ChompCoin} 
          type="to"
        /> 
        <SwapButton /> 
        <SwapMessage /> 
      </Swap> 
    ) : (
      <div className="">Please connect the wallet</div>
    )
  );
}