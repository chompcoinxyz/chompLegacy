import React from 'react';
import NftCard from '../elems/NftCard'
import LoadingIcon from '../elems/Loading';

export default function Minting({ 
  nfts,
  onMint,
  mintLoading,
  nftLoading,
  isUserNfts,
  account,
  mintIndex
}) {
  return (
    <div className="w-full bg-bgMain flex flex-col items-center justify-center">
      <div className="w-full mt-8">
       <div className="w-full flex flex-col justify-center items-center">
        {nftLoading ? (
          <LoadingIcon className="h-12 w-12 animate-spin" color="text-primary" />
        ) : (
          <>
            <div className={`w-full flex flex-wrap ${!isUserNfts ? 'justify-start' : 'justify-center'} items-start`}>
              {nfts?.length > 0 && nfts.map((nft, index) => (
                <div key={nft.tokenId} className="w-full sm:w-1/3 p-4">
                  <NftCard 
                    nft={nft} 
                    onMint={onMint} 
                    mintLoading={mintLoading} 
                    isUserNfts={isUserNfts}
                    mintIndex={mintIndex}
                    index={index}
                  />
                </div>
              ))}
              {isUserNfts && nfts?.length === 0 && (
                <p className="text-[19px] font-medium text-textGray pt-9">{account ? 'You don’t have any Legacy yet' : 'Please connect your wallet'}</p>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
