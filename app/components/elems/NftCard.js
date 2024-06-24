import React from 'react';
import Image from 'next/image';
import EthIcon from '../elems/EthIcon';
import DotsIcon from '../elems/DotsIcon';

export default function NftCard({ nft, mintLoading, onMint, isUserNfts }) {

  const formattedDots = parseFloat(nft.dotsPrice).toLocaleString('en-US');

  return (
    <div key={nft.tokenId} className="w-full flex bg-black shadow rounded-[19px] p-[20px] border border-white flex-col items-center">
      <div className="h-[443px] w-full overflow-hidden rounded-[10px]">
        <Image 
          src={nft.image}
          alt="NFT" 
          width="356" height="443"
          className="w-full h-full object-cover"
        />
      </div>

      {!isUserNfts ? (
        <>
          <div className="w-full flex flex-row items-start justify-between my-[19px]">
            <div className="w-1/2 flex flex-col justify-start">
              <p className="text-[17px] font-bold text-white text-left mb-[7px]">{nft.name}</p>
              <p className="text-[14px] text-white text-left">{nft.maxIssuance} supply</p>
            </div>
            <div className="w-1/2 flex flex-col justify-end">
              <div className="flex flex-row items-center justify-end mb-[7px]">
                <p className="text-[17px] ml-1 mr-2 font-medium text-primary text-right flex flex-row items-center"><span className='mr-2'><DotsIcon/></span> {formattedDots} DOTS</p>
                <EthIcon/>
                <p className="text-[17px] font-medium text-white text-right">{nft.ethPrice}</p>
              </div>
              <p className="text-[14px] text-white text-right">{nft.maxIssuance - nft.totalSupply} left to mint</p>
            </div>
          </div>
          
          <button 
            onClick={() => onMint(nft.tokenId, 1)} 
            disabled={nft.maxIssuance === nft.totalSupply ? true : false} 
            className={`w-full h-[45px] text-[17px] mb-[8px] flex flex-row items-center justify-center font-bold px-6 text-white rounded-[10px] uppercase ${!mintLoading || nft.maxIssuance === nft.totalSupply ? 'bg-gradient-to-r from-[#F88040] to-[#FD603D] hover:opacity-80' : 'bg-btnDisabled text-white'}`}
          >
            {!mintLoading && nft.maxIssuance > nft.totalSupply ? 'Mint' : nft.maxIssuance === nft.totalSupply ? 'Sold Out' : 'Pending...'}
          </button> 
        </>
      ) : (
        <div className="w-full flex flex-row items-start justify-center mt-[19px] mb-[8px]">
          <p className="text-[17px] font-bold text-white text-left">{nft.name}</p>
        </div>
      )}
    </div>
  );
}
