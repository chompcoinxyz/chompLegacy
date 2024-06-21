import React from 'react';
import Image from 'next/image';

export default function NftCard({ nft, mintLoading, onMint }) {
    return (
      <div key={nft.tokenId} className="w-[300px] flex bg-white shadow rounded-xl pt-4 flex-col items-center mb-6 px-[50pxx]">
        <Image 
          src={nft.image}
          alt="NFT" 
          width="150" height="300"
        />
        <p className="text font-bold text-stone-700 text-center pt-4">Name: {nft.name}</p>
        <p className="text font-bold text-stone-700 text-center">{nft.maxIssuance} supply</p>
        <p className="text font-bold text-stone-700 text-center">{nft.maxIssuance - nft.totalSupply} left to mint</p>
        <p className="text font-bold text-stone-700 text-center">Dots: {nft.dotsPrice}</p>
        <p className="text font-bold text-stone-700 text-center">ETH: {nft.ethPrice}</p>
        <button 
          onClick={() => onMint(nft.tokenId, 1)} 
          disabled={nft.maxIssuance === nft.totalSupply ? true : false} 
          className={`w-full h-[60px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 text-white  mt-[18px] rounded-[10px] uppercase ${!mintLoading || nft.maxIssuance === nft.totalSupply ? 'bg-primary hover:bg-blue-700' : 'bg-btnDisabled text-btnGray'}`}
        >
          {!mintLoading && nft.maxIssuance > nft.totalSupply ? 'Mint' : nft.maxIssuance === nft.totalSupply ? 'Sold Out' : 'Pending...'}
        </button> 
      </div>
    );
}
