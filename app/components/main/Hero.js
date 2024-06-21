'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
// import { ethers } from 'ethers';
import ChompLegacyABI from '../../../abis/ChompLegacyABI.json';
import LegaciesABI from '../../../abis/LegaciesABI.json';
import MockChompCoinABI from '../../../abis/MockChompCoinABI.json';
// import ConnectWallet from './ConnectWallet';
import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { QueryClientProvider } from '@coinbase/wallet-sdk';
// import { WagmiProvider } from '@coinbase/wallet-sdk';
// import WagmiProvider from '../providers/WalletProvider';
// import OnchainKitProvider from '../providers/OnchainKit';
import { ConnectAccount } from '@coinbase/onchainkit/wallet'; 
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StakingMenu from './StakingMenu';
import Minting from './Minting';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Nav from './Nav';

const queryClient = new QueryClient();

const chompLegacyAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const chompCoinAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const legaciesAddress = process.env.NEXT_PUBLIC_LEGACIES_ADDRESS;

export default function Hero({  }) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      amount: 0
    }
  });
  const amount = watch('amount');
  const amountWithdraw = watch('amountWithdraw');

  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [legaciesContract, setLegaciesContract] = useState(null);


  async function getProvider() {
    // console.log("========= window.ethereum in getProvider", window.ethereum);
    if (window.ethereum) {
      return new Web3(window.ethereum);
    } else {
      // Mobile
      console.log("MetaMask not detected");

      setIsMobileWithoutMetamask(true)
    }
  }

  const [totalStaked, setTotalStaked] = useState(null); 
  const [activeTab, setActiveTab] = useState(2);
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
  const [mintLoading, setMintLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [nftLoading, setNftLoading] = useState(false);


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

  async function fetchNFTData(contract) {
    try {
      const lastId = await contract.methods.lastID().call();
      const lastIdNumber = Number(lastId)
      console.log('==== lastIdNumber in fetchNFTData', lastIdNumber)

      let nfts = [];
      setNftLoading(true);

      let sampleData = [
        'https://smmagent.s3.amazonaws.com/chomp/chomp1.json',
        'https://smmagent.s3.amazonaws.com/chomp/chomp2.json',
        'https://smmagent.s3.amazonaws.com/chomp/chomp3.json',
      ]

      for (let tokenId = 1; tokenId <= lastIdNumber; tokenId++) {
        try {
          // console.log('==== tokenId in loop', tokenId)
          const uri = await contract.methods.uri(tokenId).call();
          // console.log('==== uri in loop', uri)

          const totalSupply = await contract.methods.totalSupply(tokenId).call();
          const maxIssuance = await contract.methods.maxIssuance(tokenId).call();

          const test = sampleData[tokenId-1] // TESTS

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

        } catch (error) {
          // setNftLoading(false);
          console.error(`Failed to fetch or process data for token ID ${tokenId}:`, error);
        }
      }
      setNftLoading(false);
      // console.log('==== nfts in fetchNFTData', nfts)

      return nfts;
    } catch (error) {
      setNftLoading(false);
      console.error("Failed to fetch NFT data:", error);
      return null;
    }
}

  useEffect(() => {
    // fetchAccount();
  
    const loadBlockchainData = async () => {
      await getProvider(); // This ensures the provider is ready
      const web3 = new Web3(window.ethereum);
      // console.log("======= WEB3 in USEEFFECT:", web3);
      setWeb3(web3);

      const contractInstance = new web3.eth.Contract(ChompLegacyABI, chompLegacyAddress);
      setContract(contractInstance);

      const tokenContractInstance = new web3.eth.Contract(MockChompCoinABI, chompCoinAddress);
      setTokenContract(tokenContractInstance);

      const legaciesContractInstance = new web3.eth.Contract(LegaciesABI, legaciesAddress);
      setLegaciesContract(legaciesContractInstance);
    
      const staked = await fetchTotalStaked(contractInstance, web3);

      const accounts = await web3.eth.getAccounts();
      console.log("======= accounts in USEEFFECT:", accounts);

      if (accounts.length > 0) {
        // fetchAllUserTokens(accounts[0], contractInstance, web3, tokenContractInstance);
        fetchDots(contractInstance, web3, accounts[0])
        fetchUserChompBalance(accounts[0], tokenContractInstance, web3)
        fetchUserStakedTokens(accounts[0], contractInstance, web3)
        setAccount(accounts[0]);
      } 

      // const nftData = await fetchNFTData(contractInstance, legaciesContractInstance, web3);
      const nftData = await fetchNFTData(legaciesContractInstance);
      console.log('==== nftData', nftData)
      setNfts(nftData);
    }
    loadBlockchainData();
  }, []);


  const wagmiConfig = createConfig({
    chains: [baseSepolia],
    connectors: [
      coinbaseWallet({
        appChainIds: [baseSepolia.id],
        appName: 'onchainkit',
      }),
    ],
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });


  const connectWallet = async () => {
    // console.log('====== connectWallet starting...');
    if (window.ethereum && window.ethereum.isMetaMask) {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('====== accounts in connectWallet', accounts);

        if (accounts.length === 0) {
          console.log('MetaMask is locked or the user has not connected any accounts');
          alert('Please connect to MetaMask.');
        } else {
          setAccount(accounts[0]);
          fetchDots(contract, web3, accounts[0])
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

      return approvalResult.status;
    } catch (error) {
      console.error('Approval error:', error);
      alert("Approval failed. See the console for more information.");
      setLoading(false);
      return false;
    }
  }

  const onApprove = async () => {
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
    if (amount <= 0) {
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

      // fetchUserRainBalance(effectiveAccount, tokenContract, web3)
      await fetchTotalStaked()

      // Reset the amount input field
      reset({ amount: '' });
      setStakeLoading(false);
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

    try {
        setWithdrawLoading(true);

        const amount = web3.utils.toWei(amountWithdraw.toString(), 'ether')
        const response = await contract.methods.withdraw(amount).send({ from: account });
        console.log('===== response in onWithdraw', response)

        // Alert success message
        alert("Withdraw successful! Your tokens have been returned to your wallet.");

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


  const onMint = async (tokenId, quantity) => {
    if (!account || !contract) {
      alert("Please connect your wallet and ensure the contract is loaded.");
      return setMintLoading(false);
    }

    try {
        setMintLoading(true);
        
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

        setMintLoading(false)
        return console.log('NFT minted successfully!');
    } catch (error) {
        console.error("Error on mint:", error);
        alert("Failed to mint NFTs. See console for more details.");
        setMintLoading(false)
    }
  };

  // console.log('===== account', account);
  // console.log('===== amount', amount);
 
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <OnchainKitProvider apiKey="7d-MQxGJf0QXWGSx-GqLQKZDUQP8G74Z">
          <div className="max-w-[1200px] mx-auto px-4">
            <Nav connectWallet={connectWallet} account={account} />
            
            <div className='w-full flex bg-white mt-[45px] lg:h-screen'>
              <div className="w-full">
                <div className="flex flex-col mb-[20px]">
                  <h1 className="text-[35px] mb-2 font-bold">Chomp Legacy</h1>
                  <h2 className="text-[30px] mb-2 font-semibold">Stake CHOMP + earn Dots</h2>
                  <p className="text-[20px] mb-0">0.01 Dots for 1 staked CHOMP per minute (for tests)</p>
                  <p className="text-[20px] mb-0">100k staked CHOMP tokens = 1k Dots per minute (for tests)</p>
                </div>

                <div className="">
                </div>

                {/* <ConnectWallet /> */}

                <div className="stacking max-w-[500px] bg-secondary rounded-[14px] border border-accent mx-auto">
                  <div className="stacking__body p-4 md:p-6">
                    <StakingMenu activeTab={activeTab} setActiveTab={setActiveTab} />
                    <hr className="w-full h-[1px] mx-auto mt-6 mb-6 bg-accent border-0 rounded"></hr>
                    <>
                      {activeTab === 1 && (
                        <Minting 
                          nfts={nfts}
                          onMint={onMint} 
                          mintLoading={mintLoading} 
                          txHash={txHash} 
                          txStatus={txStatus} 
                          nftLoading={nftLoading}
                        />
                      )}
                      {activeTab === 2 && (
                        <Deposit 
                          totalStakedTokens={totalStaked}
                          isUnlocked={isUnlocked}
                          userStakedTokens={0}
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
                        />
                      )}
                      {activeTab === 3 && (
                        <Withdraw
                          userStakedTokens={userStakedTokens} 
                          onWithdraw={onWithdraw}
                          amount={amount}
                          withdrawLoading={withdrawLoading}
                          isUnlocked={isUnlocked}
                          isLockTimeExpired={true}
                          isUnlockInitiated={true}
                          unlockMessage={"unlockMessage"}
                          handleSubmit={handleSubmit}
                          handleMaxClick={handleWithdrawMaxClick}
                          register={register}
                          amountWithdraw={amountWithdraw}
                        />
                      )}
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OnchainKitProvider>
      </WagmiProvider> 
    </QueryClientProvider>
  );
}
