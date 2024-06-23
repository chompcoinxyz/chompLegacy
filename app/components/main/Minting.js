import React from 'react';
import NftCard from '../elems/NftCard'
import LoadingIcon from '../elems/Loading';

export default function Minting({ 
  nfts,
  onMint,
  mintLoading,
  txHash,
  nftLoading,
}) {
  
  return (
    <div className="w-full bg-bgMain flex flex-col items-center justify-center">
      <div className="w-full mt-8">
       <div className="w-full flex flex-col justify-center items-center">
        {nftLoading ? (
          <LoadingIcon className="h-12 w-12 animate-spin" color="text-primary" />
        ) : (
          <>
            {txHash?.length > 0 && (
              <div>
                  {txHash && <p>Transaction Hash: <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:text-blue-500'>{txHash}</a></p>}
              </div>
            )}
            <div className="w-full flex flex-wrap justify-center items-start">
              {nfts?.length > 0 && nfts.map((nft) => (
                <div key={nft.tokenId} className="w-1/3 p-4">
                  <NftCard 
                    nft={nft} 
                    onMint={onMint} 
                    mintLoading={mintLoading} 
                  />
                </div>
              ))}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
