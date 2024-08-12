'use client'

import { 
  Swap, 
  SwapAmountInput, 
  // SwapToggleButton, 
  SwapButton, 
  SwapMessage,
} from '@coinbase/onchainkit/swap'; 
import { base, baseSepolia } from 'wagmi/chains';
const chain = process.env.NEXT_PUBLIC_PROD !== 'false' ? base : baseSepolia;
 
export default function SwapComponent({ address }) {

  const ETHToken = {    
    address: "",
    chainId: chain.id,
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH", 
    image: '/img/eth_icon.png',
  };

  const ChompCoin = { 
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    chainId: chain.id,
    decimals: 18,
    name: "ChompCoin",
    symbol: "CHOMP",
    image: '/img/chomp_icon.png',
  };

  const USDCToken = { 
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS,
    chainId: chain.id,
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    image: '/img/usdc.png',
   };

  const swappableTokens = [ETHToken, USDCToken, ChompCoin];
  console.log('chain.id', chain?.id)
  return (
    address ? (
      <Swap address={address} className="w-[300px] md:w-[500px]">
        <SwapAmountInput
          label="Sell"
          swappableTokens={swappableTokens} 
          token={ETHToken} 
          type="from"
        /> 
        {/* <SwapToggleButton />  */}
        <SwapAmountInput
          label="Buy"
          token={ChompCoin} 
          type="to"
        /> 
        <SwapButton /> 
        <SwapMessage /> 
      </Swap> 
    ) : (
      <div className="w-[250px] mt-2">Please connect the wallet</div>
    )
  );
}