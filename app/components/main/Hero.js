'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
import ChompLegacyABI from '../../../abis/ChompLegacyABI.json';
import LegaciesABI from '../../../abis/LegaciesABI.json';
import MockChompCoinABI from '../../../abis/MockChompCoinABI.json';
import ConnectWallet from './ConnectWallet';
import { ConnectAccount } from '@coinbase/onchainkit/wallet'; 
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider, createConfig, http, cookieToInitialState, useConnect, useClient, useAccount, useProvider, useReadContract, useReadContracts } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
// import { baseSepolia } from 'viem/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Minting from './Minting';
import Deposit from './Deposit';
import Nav from './Nav';
import LegacyTabs from '../elems/LegacyTabs';
import StakeButton from '../elems/StakeButton';
import NotFoundErrorBoundary from '../errors/NotFoundErrorBoundary';
import wagmiConfig from '../../../config/wagmi';
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
const sdk = new CoinbaseWalletSDK({
  appName: 'CHOMP Legacy',
  appLogoUrl: `${process.env.NEXT_PUBLIC_URL}/img/logo.svg`,
  appChainIds: [84532],
});

const cbProvider = sdk.makeWeb3Provider();

const queryClient = new QueryClient();

const chompLegacyAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const chompCoinAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const legaciesAddress = process.env.NEXT_PUBLIC_LEGACIES_ADDRESS;

const bg = '../../../public/img/bg_ellipse.svg'

export default function Hero() {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      amount: 0
    }
  });
  const amount = watch('amount');
  const amountWithdraw = watch('amountWithdraw');

  // const router = useRouter();
  const { address } = useAccount()
  const client = useClient()
  const { connectors, connect, data } = useConnect();
  const connector = connectors[0];
  console.log("========= address", address);
  console.log("========= client", client);
  console.log("========= connectors", connectors);

  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [legaciesContract, setLegaciesContract] = useState(null);

  async function getProvider() {
    // console.log("========= window.ethereum in getProvider", window.ethereum);
    if (typeof window !== 'undefined' && window.ethereum) {
      return new Web3(window.ethereum);
    } else {
      // Mobile
      console.log("MetaMask not detected");

      setIsMobileWithoutMetamask(true)
    }
  }

  const [totalStaked, setTotalStaked] = useState(null); 
  const [activeTab, setActiveTab] = useState(1);
  const [activeLegacyTab, setActiveLegacyTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [userChompBalanceTokens, setUserChompBalanceTokens] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userDots, setUserDots] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [userStakedTokens, setUserStakedTokens] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [userNfts, setUserNfts] = useState([]);
  const [mintLoading, setMintLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [nftLoading, setNftLoading] = useState(false);
  const [nftUserLoading, setNftUSerLoading] = useState(false);
  const [mintIndex, setMintIndex] = useState(99);

  const [zoraData, setZoraData] = useState(false);
  const networkInfo = {
    // network: ZDKNetwork.Ethereum,
    // chain: ZDKChain.Mainnet,
    network: ZDKNetwork.Base,
    chain: ZDKChain.BaseMainnet,
  }
  const API_ENDPOINT = "https://api.zora.co/graphql";
  const args = { 
      endPoint:API_ENDPOINT, 
      networks:[networkInfo], 
      apiKey: process.env.NEXT_PUBLIC_ZORA_KEY 
    } 
  const zdk = new ZDK(args);


  const fetchTotalStaked = async (contractInstance, web3) => {
    if (!contractInstance || !web3) return;
    // console.log("==== contractInstance in fetchTotalStaked:", contractInstance);

    try {
      const totalStakedWei = await contractInstance.methods.totalStaked().call();
      let totalStakedTokens = web3.utils.fromWei(totalStakedWei, 'ether');
      // console.log("==== totalStakedTokens in fetchTotalStaked:", totalStakedTokens);
      if (totalStakedTokens === '0.') totalStakedTokens = 0;
      setTotalStaked(totalStakedTokens);

      return totalStakedTokens;
    } catch (error) {
      console.error('Failed to fetch total staked tokens:', error);
    }
  };

  async function fetchUserStakedTokens(account, contract, web3) {
    if (!contract) return;
    // console.log("fetchUserStakedTokens starting for", account);

    try {
        const userStakedWei = await contract.methods.balanceOf(account).call();
        let userStakedTokens = web3.utils.fromWei(userStakedWei, 'ether');
        // console.log("User staked tokens:", userStakedTokens);
        if (userStakedTokens === '0.') userStakedTokens = 0;
        setUserStakedTokens(userStakedTokens);
    } catch (error) {
        console.error("Error fetching user staked tokens:", error);
    }
  }

  async function fetchNFTData(contract, wallet) {
    try {
      const lastId = await contract.methods.lastID().call();
      const lastIdNumber = Number(lastId);
      // console.log('==== lastIdNumber in fetchNFTData', lastIdNumber)
      // console.log('====== wallet in fetchNFTData', wallet)

      const nfts = [];
      const userNFTs = [];

      nfts?.length === 0 ? setNftLoading(true) : setNftUSerLoading(true);

      for (let tokenId = 1; tokenId <= lastIdNumber; tokenId++) {
        try {
          // console.log('==== tokenId in loop', tokenId)
          const uri = await contract.methods.uri(tokenId).call();
          // console.log('==== uri in loop', uri)

          const totalSupply = await contract.methods.totalSupply(tokenId).call();
          const maxIssuance = await contract.methods.maxIssuance(tokenId).call();

          // const test = sampleData[tokenId-1] // TESTS

          const response = await fetch(uri);
          // const response = await fetch(test);
  
          const metadata = await response.json();
          // console.log('==== metadata in loop', metadata)
  
          nfts.push({
            tokenId,
            uri,
            totalSupply: Number(totalSupply),
            maxIssuance: Number(maxIssuance),
            ...metadata
          });

          // User's NFTs
          if (wallet) {
            const balance = await contract.methods.balanceOf(wallet, tokenId).call();
            // console.log('====== balance in loop', balance)
            if (balance > 0) {
              userNFTs.push({
                  tokenId,
                  balance: Number(balance),
                  uri,
                  ...metadata
              });
            }
          }

        } catch (error) {
          console.error(`Failed to fetch or process data for token ID ${tokenId}:`, error);
        }
      }
      setNftLoading(false);
      setNftUSerLoading(false);
      // console.log('==== userNFTs in fetchNFTData', userNFTs)

      setNfts(nfts);
      setUserNfts(userNFTs);

      // Fetch data from Zora
      if (zdk) {
        const args = { 
          where: {collectionAddresses: [
            "0x6E3B47A8697Bc62be030827f4927A50Eb3a93d2A",
            "0x014B6a629D6d8deb6F2CDE20e2D5a99d4A601feC",
            "0x82262bFba3E25816b4C720F1070A71C7c16A8fc4",
            // process.env.NEXT_PUBLIC_LEGACIES_ADDRESS,
              ]
            },
            includeFullDetails: false
          };
        const zoraResponse = await zdk.collections(args);
        // Floor price
        // const args = { 
        //   where: {collectionAddresses: [
        //     "0x82262bFba3E25816b4C720F1070A71C7c16A8fc4",
        //     // process.env.NEXT_PUBLIC_LEGACIES_ADDRESS,
        //       ]
        //     },
        //   };
        // const zoraResponse = await zdk.floorPrice(args);
        console.log('=== zoraData in useEffect', zoraResponse);
        setZoraData(zoraResponse)
      }

      return nfts;
    } catch (error) {
      setNftLoading(false);
      setNftUSerLoading(false);
      console.error("Failed to fetch NFT data:", error);
      return null;
    }
  }

  // const wagmiContractConfig = {
  //   address: legaciesAddress,
  //   abi: LegaciesABI,
  // };
  // const { data: lastID } = useReadContract({
  //   ...wagmiContractConfig,
  //   functionName: 'lastID',
  //   args:[]
  //   // args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  // })

  // const { data: totalSupply } = useReadContract({
  //   ...wagmiContractConfig,
  //   functionName: 'totalSupply',
  //   args:[4]
  //   // args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  // })

  // const { data: maxIssuance } = useReadContract({
  //   ...wagmiContractConfig,
  //   functionName: 'maxIssuance',
  //   args:[4]
  //   // args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  // })
  // const { data: uri } = useReadContract({
  //   ...wagmiContractConfig,
  //   functionName: 'uri',
  //   args:[4]
  //   // args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  // })
  // // const [totalStaked, ownerOf, totalSupply] = data || [] 
  // // const [totalStaked] = data || [] 

  // console.log('======= lastID fetchWagmiData', lastID)
  // console.log('======= lastID fetchWagmiData', Number(lastID))
  // console.log('======= totalSupply fetchWagmiData', totalSupply)
  // console.log('======= totalSupply fetchWagmiData', Number(totalSupply))
  // console.log('======= maxIssuance fetchWagmiData', maxIssuance)
  // console.log('======= uri fetchWagmiData', uri)

  console.log('==== web3', web3)
  console.log('==== web3.currentProvider', web3?.currentProvider)
  useEffect(() => {
    const loadBlockchainData = async () => {
      // const provider = await getProvider(); // This ensures the provider is ready
      // if (!provider) return; // Early exit if no provider
      // console.log('==== provider in useffect', provider)

      // console.log("========= connector in useeffect", connector);
      //  const provider = await connector.getProvider();
      // console.log("========= provider", provider);
      
      // const web3 = new Web3(provider);
      const web3 = new Web3(window.ethereum);
      // const web3 = new Web3(cbProvider);
      // const web3 = new Web3(rpc);
      setWeb3(web3);
      console.log("======= address in USEEFFECT:", address);
      console.log("======= WEB3 in USEEFFECT:", web3);

      const contractInstance = new web3.eth.Contract(ChompLegacyABI, chompLegacyAddress);
      setContract(contractInstance);

      const tokenContractInstance = new web3.eth.Contract(MockChompCoinABI, chompCoinAddress);
      setTokenContract(tokenContractInstance);

      const legaciesContractInstance = new web3.eth.Contract(LegaciesABI, legaciesAddress);
      setLegaciesContract(legaciesContractInstance);
    
      const staked = await fetchTotalStaked(contractInstance, web3);

      const accounts = await web3.eth.getAccounts();
      // const accounts = [address];
      console.log("======= accounts in USEEFFECT:", accounts);

      if (accounts.length > 0) {
        fetchAllUserTokens(accounts[0], contractInstance, web3, tokenContractInstance);
        setAccount(accounts[0]);
      } 

      let wallet = accounts?.length > 0 ? accounts[0] : null;
      const nftData = await fetchNFTData(legaciesContractInstance, wallet);
    }
    loadBlockchainData();
  }, []);



  const updateProvider = async (connector) => {
    // window.ethereum.disconnect();
    const provider = await connector.getProvider();
    console.log(' ==== connector in updateProvider', connector)
    const web3Instance = new Web3(provider);
    setWeb3(web3Instance);
  };

  const fetchAllUserTokens = async (wallet, contractInstance, web3, tokenContractInstance) => {
    if (!contractInstance || !web3) return;

    try {
      fetchDots(contractInstance, web3, wallet)
      fetchUserChompBalance(wallet, tokenContractInstance, web3)
      fetchUserStakedTokens(wallet, contractInstance, web3)
    } catch (error) {
      console.error('Failed to fetch user tokens:', error);
    }
  };

  const connectWallet = async () => {
    console.log('====== connectWallet starting...');
    if (window.ethereum && window.ethereum.isMetaMask) {
    // if (window.ethereum) {
      setIsConnecting(true);

      // // change provider
      // const provider = await getProvider(); 
      // console.log('==== provider in connectWallet', provider)
      
      // const web3 = new Web3(provider);
      // setWeb3(web3);

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('====== accounts in connectWallet', accounts);

        if (accounts.length === 0) {
          console.log('MetaMask is locked or the user has not connected any accounts');
          alert('Please connect to MetaMask.');
        } else {
          setAccount(accounts[0]);
          fetchAllUserTokens(accounts[0], contract, web3, tokenContract);
          fetchNFTData(legaciesContract, accounts[0]);
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
    return null;
  };


  const fetchDots = async (contractInstance, web3, account) => {
    if (!contractInstance || !web3) return;

    try {
      const totalUserDotsWei = await contractInstance.methods.earned(account).call();
      // console.log("==== totalStakedWei in fetchDots:", totalUserDotsWei);
      let userDots = web3.utils.fromWei(totalUserDotsWei, 'ether');
      // console.log("==== userDots in fetchDots:", userDots);
      if (userDots === '0.') userDots = 0;
      setUserDots(userDots);

      return userDots;
    } catch (error) {
      console.error('Failed to fetch user Dots:', error);
    }
  };

  const fetchUserChompBalance = async (account, contract, web3) => {
    if (!contract || !web3) return;

    try {
      // Calls the balanceOf function of the ERC-20 token contract
      const balance = await contract.methods.balanceOf(account).call();

      let userChomp = web3.utils.fromWei(balance, 'ether');
      if (userChomp === '0.') userChomp = 0;
      setUserChompBalanceTokens(userChomp);
      return;
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
      return '0';
    }
  };

  const handleMaxClick = () => {
    setValue('amount', userChompBalanceTokens, { shouldValidate: true });
  }
  const handleWithdrawMaxClick = () => {
    setValue('amountWithdraw', userStakedTokens, { shouldValidate: true });
  }
  
  async function ensureTokenApproval(account, amountInWei) {
  
    // const allowance = await tokenContract.allowance(account, chompLegacyAddress);
    const allowance = await tokenContract.methods.allowance(account, chompLegacyAddress).call();
    console.log('Current allowance:', allowance);
  
    if (BigInt(allowance) >= BigInt(amountInWei)) {
      console.log('Token already approved');
      setLoading(false);
      return true; 
    }
  
    try {
      const approvalResult = await tokenContract.methods.approve(chompLegacyAddress, amountInWei).send({ from: account });

      // const requestData = { method: 'approve' };
      // const response = await fetch('/api/sendTransaction', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      // const approvalResult = await response.json();
      // console.log('Transaction successful:', approvalResult);

      return approvalResult.status;
      return true;
    } catch (error) {
      console.error('Approval error:', error);
      alert("Approval failed. See the console for more information.");
      setLoading(false);
      return false;
    }
  }

  const onApprove = async () => {
    console.log("== onApprove: Provider being used:", web3.currentProvider);
    console.log('===== onApprove: account', account)
    // Ensure account is connected, wait for connectWallet if account is not set
    const effectiveAccount = account || await connectWallet();
  
    if (!effectiveAccount) {
      alert("Wallet connection is required to stake tokens! Please connect wallet.");
      return; // Stop execution if no account is available after trying to connect
    }
  
    if (!account) {
      await connectWallet();
    }
  
    const amount = watch("amount");
    if (amount <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }
  
    try {
      // const amountInWei = ethers.utils.parseEther(amount);
      const amountInWei = web3.utils.toWei(amount, 'ether');

      setLoading(true);
      // Approve transaction
      const isApprovedRes = await ensureTokenApproval(effectiveAccount, amountInWei);
      if (!isApprovedRes) {
        console.log('Token approval failed or was denied by the user');
        return setLoading(false);
      }
  
      setIsApproved(isApprovedRes);
  
      if (isApprovedRes) {
        alert("Approved. You can stake CHOMP tokens now.");
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Approving error:", error);
      alert("Approve failed. See the console for more information.");
      setLoading(false);
    }
  };

  const onStake = async (data) => {
    // Ensure account is connected, wait for connectWallet if account is not set
    const effectiveAccount = account || await connectWallet();
    // console.log('===== effectiveAccount in onStake', effectiveAccount);

    if (!effectiveAccount) {
      alert("Wallet connection is required to stake tokens! Please connect wallet.");
      return; // Stop execution if no account is available after trying to connect
    }

    if (!account) {
      await connectWallet();
    }

    const amount = watch("amount");
    if (amount <= 0 || !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }

    try {
      setStakeLoading(true);

      // const amountInWei = web3.utils.toWei(amount, 'ether');
      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      // Execute the stake transaction
      const transaction = await contract.methods.stake(amountInWei).send({ from: effectiveAccount });
      alert("Stake successful! Transaction hash: " + transaction.transactionHash);
      console.log('=== transaction in onStake', transaction)

      // Update total staked tokens and user staked tokens
      await fetchUserStakedTokens(effectiveAccount, contract, web3);

      await fetchTotalStaked();

      // Reset the amount input field
      reset({ amount: '' });
      setStakeLoading(false);
      setIsApproved(false);
    } catch (error) {
      console.error("Staking error:", error);
      alert("Staking failed. See the console for more information.");
      setStakeLoading(false);
    }
  };


  const onWithdraw = async () => {
    if (!account || !contract) {
        alert("Please connect your wallet and ensure the contract is loaded.");
        return setWithdrawLoading(false);
    }

    if (amountWithdraw <= 0 || !amountWithdraw || amountWithdraw.length === 0 || isNaN(amountWithdraw) || parseFloat(amountWithdraw) <= 0) {
      alert("Please enter a valid amount to unstake.");
      return;
    }

    try {
        setWithdrawLoading(true);

        const amount = web3.utils.toWei(amountWithdraw.toString(), 'ether')
        const response = await contract.methods.withdraw(amount).send({ from: account });
        console.log('===== response in onWithdraw', response)

        // Alert success message
        alert("Unstake successful! Your tokens have been returned to your wallet.");

        // Update UI - fetch latest total staked tokens and user-specific staked tokens
        await fetchTotalStaked();
        await fetchUserStakedTokens(account, contract, web3);
       
        setWithdrawLoading(false)
        fetchUserChompBalance(account, tokenContract, web3)

        reset({ amountWithdraw: '' });
    } catch (error) {
        console.error("Error withdrawing:", error);
        alert("Failed to withdraw tokens. See console for more details.");
        setWithdrawLoading(false)
    }
  };


  const onMint = async (tokenId, quantity, index) => {
    if (!account || !contract) {
      alert("Please connect your wallet and ensure the contract is loaded.");
      return setMintLoading(false);
    }

    try {
        setMintLoading(true);
        setMintIndex(index);
        console.log('=== index onMint for mintindex', index)
        
        const ethPrice = await contract.methods.ethPrices(tokenId).call();
        console.log('=== ethPrice onMint', ethPrice)
        const requiredEth = BigInt(ethPrice) * BigInt(quantity);
        console.log('=== requiredEth onMint', requiredEth)

        const transactionParameters = {
          from: account,
          value: requiredEth.toString() 
        };

        const txResponse = await contract.methods.redeem(tokenId, quantity).send(transactionParameters);
        console.log('=== txResponse onMint', txResponse)
        
        setTxHash(txResponse.transactionHash);

        if (txResponse && txResponse.status) {
          console.log('Minting was successful:', txResponse.transactionHash);

          setActiveLegacyTab(2);
          alert(`Minting was successful! Transaction Hash: ${txResponse.transactionHash}`);
        } 

        setMintLoading(false)
        setMintIndex(99)
        return console.log('NFT minted successfully!');
    } catch (error) {
        console.error("Error on mint:", error);
        alert("Failed to mint NFTs. See console for more details.");
        setMintLoading(false)
    }
  };

  console.log('===== account', account);
  console.log('===== userNfts', userNfts);
 
  return (
    <NotFoundErrorBoundary>
      {/* <WagmiProvider config={wagmiConfig}> */}
        {/* <QueryClientProvider client={queryClient}> */}
          {/* <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAIN_KEY} chain={baseSepolia}> */}
            <div className="max-w-[1300px] mx-auto px-4 relative">

              <div className="pt-[25px] z-10">
                
                {/* <div className="border border-white solid rounded-[20px] py-[25px] px-[50px]"> */}
                <div className="border__main">
                  <div className="border__main__content">
                    <Nav connectWallet={connectWallet} account={account} setAccount={setAccount} setWeb3={setWeb3} updateProvider={updateProvider} />
                    <h1 className="font-amiger text-[35px] md:text-[55px] pt-[20px] uppercase text-white text-center title__shadow opacity-99">stake chomp, gather dots, mint legacy.</h1>
                    <div className="w-full flex justify-center mt-[10px] mb-[20px] sm:mb-[40px]">
                      {!account ? (
                        <div className="w-[300px]">
                          <StakeButton 
                            onClick={connectWallet}
                            disabled={isConnecting}
                            loading={loading}
                            text="Connect Wallet"
                            isDisabledStyles={''}
                          />
                        </div>
                        
                      ) : (
                        <div className="">
                          <Deposit 
                            isUnlocked={isUnlocked}
                            isWalletConnected={isWalletConnected}
                            onStake={onStake}
                            amount={amount}
                            handleSubmit={handleSubmit}
                            register={register}
                            onApprove={onApprove}
                            isApproved={isApproved}
                            loading={loading}
                            stakeLoading={stakeLoading}
                            handleMaxClick={handleMaxClick}
                            balance={userChompBalanceTokens}
                            userDots={userDots}
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            onWithdraw={onWithdraw}
                            withdrawLoading={withdrawLoading}
                            handleWithdrawMaxClick={handleWithdrawMaxClick}
                            amountWithdraw={amountWithdraw}
                            userStakedTokens={userStakedTokens} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
                
              <div className='w-full flex mt-[55px] lg:h-screen pb-20'>
                <div className="w-full">

                  {/* <ConnectWallet setAccount={setAccount} /> */}

                  <LegacyTabs activeTab={activeLegacyTab} setActiveTab={setActiveLegacyTab} />
                  
                  {activeLegacyTab === 1 && (
                    <Minting 
                      nfts={nfts}
                      onMint={onMint} 
                      mintLoading={mintLoading} 
                      txHash={txHash} 
                      txStatus={txStatus} 
                      nftLoading={nftLoading}
                      account={account}
                      mintIndex={mintIndex}
                    />
                  )}

                  {activeLegacyTab === 2 && (
                    <Minting 
                      nfts={userNfts}
                      onMint={onMint} 
                      mintLoading={mintLoading} 
                      txHash={txHash} 
                      txStatus={txStatus} 
                      nftLoading={nftUserLoading}
                      isUserNfts={true}
                      account={account}
                      mintIndex={mintIndex}
                    />
                  )}
              
                </div>
              </div>
            </div>

          {/* </OnchainKitProvider> */}
        {/* </QueryClientProvider> */}
      {/* </WagmiProvider>  */}
    </NotFoundErrorBoundary>
  );
}
