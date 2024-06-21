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
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full mt-8">
       <div className="w-full flex flex-col justify-center items-center">
        {nftLoading ? (
          <LoadingIcon className="h-12 w-12 animate-spin" color="text-blue-600" />
        ) : (
          <>
            {txHash?.length > 0 && (
              <div>
                  {txHash && <p>Transaction Hash: <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:text-blue-500'>{txHash}</a></p>}
                  {/* {txHash && <p>Transaction Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:text-blue-500'>{txHash}</a></p>} */}
              </div>
            )}
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="flex flex-row flex-wrap">
                <NftCard 
                  nft={nft} 
                  onMint={onMint} 
                  mintLoading={mintLoading} 
                />
              </div>
            ))}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
