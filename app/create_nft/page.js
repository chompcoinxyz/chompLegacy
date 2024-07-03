'use client'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Nav from '../components/main/Nav';
import ChompLegacyABI from '../../abis/ChompLegacyABI.json';
import LoadingIcon from '../components/elems/Loading';
// import { WagmiProvider } from 'wagmi';
// import wagmiConfig from '../../config/wagmi';
import NotFoundErrorBoundary from '../components/errors/NotFoundErrorBoundary'
// import { QueryClient } from '@tanstack/react-query';

const chompLegacyAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
// const queryClient = new QueryClient();

export default function CreateNft() {
  const { watch } = useForm({
    defaultValues: {
      amount: 0
    }
  });
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const amount = watch('amount');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [maxIssuance, setMaxIssuance] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [dotsPrice, setDotsPrice] = useState('');
  const [releaseTime, setReleaseTime] = useState('');
  const [ethPrice, setEthPrice] = useState('');
  const [nftHash, setNftHash] = useState('');

  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    image: '',
    attributes: [],
  });

  const { name, description, image, attributes } = metadata;

  useEffect(() => {
    console.log("==== USEEFFECT works:");

    const loadBlockchainData = async () => {
      // Create a Web3 instance using MetaMask's provider
      if (typeof window !== "undefined") {
        const web3 = new Web3(window.ethereum);

        console.log("==== USEEFFECT setting Metamasks's profiver", web3);


        setWeb3(web3);
  
        const contractInstance = new web3.eth.Contract(ChompLegacyABI, chompLegacyAddress);
        setContract(contractInstance);
  
        // Fetch user's data
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };

    loadBlockchainData();
  }, []);


  const connectWallet = async () => {
    if (typeof window !== "undefined") {
      if (window.ethereum && window.ethereum.isMetaMask) {
        setIsConnecting(true);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
          if (accounts.length === 0) {
            console.log('MetaMask is locked or the user has not connected any accounts');
            alert('Please connect to MetaMask.');
          } else {
            // console.log('====== accounts[0] in connectWallet', accounts[0]);
            setAccount(accounts[0]);
            return accounts[0];
          }
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          alert('Failed to connect MetaMask. Please try again.');
        } finally {
          setIsConnecting(false);
        }
      } else {
        alert('Please install MetaMask!');
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!account || account === undefined) {
      alert("Wallet connection is required to creating NFTs! Please connect your wallet.");
      return; // Stop execution if no account is available after trying to connect
    } else if (!web3 || !contract) { return }

    setLoading(true);

    try {
      const eth = web3.utils.toWei(ethPrice.toString(), 'ether');
      const dots = web3.utils.toWei(dotsPrice.toString(), 'ether');
      const releaseDateTime = new Date(releaseTime);
      const releaseTimestamp = Math.floor(releaseDateTime.getTime() / 1000);
  
      const res = await contract.methods.createLegacy(
        maxIssuance,
        tokenURI,
        dots,
        releaseTimestamp,
        eth
      ).send({ from: account });
  
      console.log('==== res on create nft', res)

      if (res?.transactionHash) {
        setNftHash(res.transactionHash)
      }
  
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('==== Error in create NFT:', err)

    }
  };

  const onChangeMetadata = e =>
    setMetadata({ ...metadata, [e.target.name]: e.target.value });

  const handleMetadata = async (e) => {
    e.preventDefault();
    

    // call to ipfs

    // save response as tokenURI

    // show on UI to save tokenURI
  };

  const inputStyles = "text-[17px] p-2 ml-4 border-0 mr-2 rounded text-center focus:outline-none";

  console.log('==== web3', web3)
  return (
    <NotFoundErrorBoundary>
      {/* <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}> */}
        <main className='max-w-[1300px] mx-auto pb-20 pt-6'>
          <Nav connectWallet={connectWallet} account={account} setAccount={setAccount} setWeb3={setWeb3} isTest={true} />

          <div className="mt-12">
            <h2 className="max-w-[500px] text-white font-bold text-xl mx-auto mb-2">Step 0: Connect wallet</h2>

            <h2 className="max-w-[500px] text-white font-bold text-xl mx-auto mb-2">Step 1: Create NFT's metadata</h2>
            <div className='max-w-[500px] bg-black rounded-[14px] border border-accent mx-auto'>
              <div className='flex flex-col justify-center pt-2'>
                <label className="text-xs text-white pl-2 ml-4 mb-1" htmlFor={name}>Collection Name</label>
                <input type="text" value={name} onChange={onChangeMetadata} name="name" placeholder="Collection Name" className={inputStyles} />
                <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" htmlFor={description}>Description</label>
                <input type="text" value={description} onChange={onChangeMetadata} name="description" placeholder="Description" className={inputStyles} />
                <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" htmlFor={releaseTime}>NFT Image</label>
                <input type="text" value={image} onChange={onChangeMetadata} name="image" placeholder="NFT Image" className={inputStyles} />
                <button 
                  type="submit"
                  className={`w-full h-[60px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 text-white  mt-[13px] rounded-[14px] uppercase ${name?.length > 0 && description?.length > 0 && image?.length > 0 ? 'bg-primary hover:opacity-80': 'bg-black text-btnGray'}`}
                  disabled={name?.length > 0 && description?.length > 0 && image?.length > 0 ? false : true}
                  onClick={handleMetadata}
                >
                  Create NFT Metadata
                </button>
              </div>
            </div>
          </div>

          {tokenURI?.length > 0 && (
            <div className="max-w-[500px] mt-6 mb-6 mx-auto">
              <p className="text-[18px] text-white"><b>Important!</b> Use this metadata as Token URI:</p>
              <a href={tokenURI} className="text-[18px] text-primary hover:opacity-80" target="_blank" rel="noopener noreferrer">{tokenURI}</a>
            </div>
          )}

          <div className="mt-12">
            <h2 className="max-w-[500px] text-white font-bold text-xl mx-auto mb-2">Step 2: Create NFT collection</h2>
            <div className='max-w-[500px] bg-black rounded-[14px] border border-accent mx-auto'>
              <div className='flex flex-col justify-center pt-2'>
                <label className="text-xs text-white pl-2 ml-4 mb-1" for={maxIssuance}>Max Issuance</label>
                <input type="number" value={maxIssuance} onChange={e => setMaxIssuance(e.target.value)} placeholder="Max Issuance" className={inputStyles} />
                <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" for={tokenURI}>Token URI</label>
                <input type="text" value={tokenURI} onChange={e => setTokenURI(e.target.value)} placeholder="Token URI" className={inputStyles} />
                <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" for={image}>Release Time</label>
                <input type="datetime-local" value={releaseTime} onChange={e => setReleaseTime(e.target.value)} placeholder="Release Time" className={inputStyles} />
                <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" for={dotsPrice}>Price in Dots</label>
                <input type="number" value={dotsPrice} onChange={e => setDotsPrice(e.target.value)} placeholder="Price in Dots" className={inputStyles} />
                <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" for={ethPrice}>Price in ETH</label>
                <input type="text" value={ethPrice} onChange={e => setEthPrice(e.target.value)} placeholder="Price in ETH" className={inputStyles} />
                <button 
                  type="submit"
                  className={`w-full h-[60px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 text-white  mt-[13px] rounded-[14px] uppercase ${tokenURI?.length > 0 && !loading ? 'bg-primary hover:opacity-80': 'bg-black text-btnGray'}`}
                  disabled={tokenURI?.length > 0 && !loading ? false : true}
                  onClick={handleSubmit}
                >
                  {loading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
                  Create NFT Collection
                </button>
              </div>
            </div>
          </div>
          {nftHash.length > 0 && (
            <div className="max-w-[500px] mt-6 mb-6 mx-auto">
              <p className="text-xl text-white">NFT was created. Transaction Hash: </p>
              <a href={`https://${process.env.NEXT_PUBLIC_PROD === 'true' ? '' : 'sepolia.'}basescan.org/tx/${nftHash}`} className="text-[18px] text-primary hover:opacity-80" target="_blank" rel="noopener noreferrer">{nftHash}</a>

            </div>
          )}
        </main>
        {/* </QueryClientProvider>
      </WagmiProvider> */}
    </NotFoundErrorBoundary>
  )
}
