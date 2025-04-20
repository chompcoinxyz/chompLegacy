'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
import { ChompLegacyABI, LegaciesABI, ChompCoinABI } from '../../../abis/getABI';
import { 
  useWaitForTransactionReceipt, 
  useAccount, 
  useWriteContract, 
  useConnect,
} from 'wagmi';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import Minting from './Minting';
import Deposit from './Deposit';
import Nav from './Nav';
import Swap from './SwapComponent';
import SwapModal from './SwapModal';
import LegacyTabs from '../elems/LegacyTabs';
import StakeButton from '../elems/StakeButton';
import ConnectWalletMobile from '../elems/ConnectWalletMobile';
import Footer from '../elems/Footer';
import Alert from '../elems/Alert';
import NotFoundErrorBoundary from '../errors/NotFoundErrorBoundary';
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const chompLegacyAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const chompCoinAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const legaciesAddress = process.env.NEXT_PUBLIC_LEGACIES_ADDRESS;
const rpc = process.env.NEXT_PUBLIC_RPC_URL;
const basescan = `https://${process.env.NEXT_PUBLIC_PROD === 'true' ? '' : 'sepolia.'}basescan.org`

export default function Hero() {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      amount: 0
    }
  });
  const amount = watch('amount');
  const amountWithdraw = watch('amountWithdraw');

  const { connectors, connect } = useConnect();
  const { address, connector } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { data: callID, writeContracts, isSuccess: isSuccessTransaction } = useWriteContracts();
  const { data: availableCapabilities } = useCapabilities({
    account: address,
  });
  
  const accountData = useAccount();

  const isPaymaster = useMemo(() => {
    if (!availableCapabilities || !accountData.chainId) return false;
    const capabilitiesForChain = availableCapabilities[accountData.chainId];
    if (
      capabilitiesForChain &&
      capabilitiesForChain["paymasterService"] &&
      capabilitiesForChain["paymasterService"].supported
    ) {
      return true;
    }
    return false;
  }, [availableCapabilities, accountData.chainId]);

  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [legaciesContract, setLegaciesContract] = useState(null);
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
  const [nftLoading, setNftLoading] = useState(false);
  const [nftUserLoading, setNftUSerLoading] = useState(false);
  const [mintIndex, setMintIndex] = useState(99);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMgs] = useState(false);
  const [swapModal, setSwapModal] = useState(false);

  const [zoraData, setZoraData] = useState(false);
  const networkInfo = {
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

  async function fetchUserStakedTokens(account, contract, web3) {
    if (!contract) return;

    try {
        const userStakedWei = await contract.methods.balanceOf(account).call();
        let userStakedTokens = web3.utils.fromWei(userStakedWei, 'ether');
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

      const nfts = [];
      const userNFTs = [];

      nfts?.length === 0 ? setNftLoading(true) : setNftUSerLoading(true);

      for (let tokenId = 1; tokenId <= lastIdNumber; tokenId++) {
        try {
          const uri = await contract.methods.uri(tokenId).call();

          const totalSupply = await contract.methods.totalSupply(tokenId).call();
          const maxIssuance = await contract.methods.maxIssuance(tokenId).call();

          const response = await fetch(uri);
  
          const metadata = await response.json();

          // console.log('uri', uri)
          // console.log('metadata', metadata)

          nfts.unshift({
            tokenId,
            uri,
            totalSupply: Number(totalSupply),
            maxIssuance: Number(maxIssuance),
            ...metadata
          });

          // User's NFTs
          if (wallet) {
            const balance = await contract.methods.balanceOf(wallet, tokenId).call();

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

      setNfts(nfts);
      setUserNfts(userNFTs);

      // Fetch data from Zora
      if (zdk) {
        const args = { 
          where: {collectionAddresses: [process.env.NEXT_PUBLIC_LEGACIES_ADDRESS,]},
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
        // console.log('=== zoraData in useEffect', zoraResponse);
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

  // console.log('nfts', nfts)

  const chompLegacyContractConfig = {
    address: chompLegacyAddress,
    abi: ChompLegacyABI,
  };
  const legaciesContractConfig = {
    address: legaciesAddress,
    abi: LegaciesABI,
  };
  const chompCoinConfig = {
    address: chompCoinAddress,
    abi: ChompCoinABI,
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(rpc);
      setWeb3(web3);

      const contractInstance = new web3.eth.Contract(ChompLegacyABI, chompLegacyAddress);
      setContract(contractInstance);

      const tokenContractInstance = new web3.eth.Contract(ChompCoinABI, chompCoinAddress);
      setTokenContract(tokenContractInstance);

      const legaciesContractInstance = new web3.eth.Contract(LegaciesABI, legaciesAddress);
      setLegaciesContract(legaciesContractInstance);
    
      // console.log("address:", address);

      if (address?.length > 0) {
        fetchAllUserTokens(address, contractInstance, web3, tokenContractInstance);
        setAccount(address);
      } 

      if (!nfts || nfts?.length === 0) {
        const nftData = await fetchNFTData(legaciesContractInstance, address);
      }
    }
    loadBlockchainData();
  }, [address]);

  useEffect(() => {
    if (!account || !contract || !web3 || !tokenContract) return
    // console.log('==== useEffect 1, isSuccess', isSuccess)
    // console.log('==== useEffect 1, isSuccessTransaction', isSuccessTransaction)
    if (isSuccess || isSuccessTransaction) {
      setTimeout(() => {
        fetchAllUserTokens(account, contract, web3, tokenContract);
        fetchUserChompBalance(account, tokenContract, web3);

        if (stakeLoading) {
          setStakeLoading(false);
          setIsApproved(false);

          if (connector?.name !== 'Coinbase Wallet') {
            setAlertMgs('Stake was successful!')
            setAlertVisible(true);
          }
        }

        if (mintLoading) {
          setNftUSerLoading(true);
          fetchNFTData(legaciesContract, address);
          setActiveLegacyTab(2);
          setMintLoading(false);
          // alert(`Minting was successful! Transaction Hash: ${callID}`);

          if (connector?.name !== 'Coinbase Wallet') {
            setAlertMgs("Minting was successful. You can find your NFT in the 'My Legacy' tab.");
            setAlertVisible(true);
          }
        }
      }, 4000);
    }
  }, [isSuccess, isSuccessTransaction]);

  useEffect(() => {
    // console.log('==== useEffect 2, loading && isConfirming', loading && isConfirming)
    // console.log('==== useEffect 2, withdrawLoading && isConfirming', withdrawLoading && isConfirming)
    if (loading && isConfirming) { 
      setLoading(false);
      setIsApproved(true);
    } else if (withdrawLoading && isConfirming) {
      setTimeout(() => {
        fetchAllUserTokens(account, contract, web3, tokenContract);
        fetchUserChompBalance(account, tokenContract, web3);

        setWithdrawLoading(false);
        reset({ amountWithdraw: '' });
      }, 2000);

    }
  }, [isConfirming, loading, stakeLoading, withdrawLoading, mintLoading]);
    
  const updateProvider = async (connector) => {
    const provider = await connector.getProvider();

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

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    );

    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });

      updateProvider(coinbaseWalletConnector)
    }

  }, [connectors, connect]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask) {
      setIsConnecting(true);

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

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

      let userDots = web3.utils.fromWei(totalUserDotsWei, 'ether');
      
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
  
    const allowance = await tokenContract.methods.allowance(account, chompLegacyAddress).call();

    if (BigInt(allowance) >= BigInt(amountInWei)) {
      console.log('Token already approved');
      setLoading(false);
      setIsApproved(true);
      alert("Token already approved")
      return true; 
    }
  
    try {
      // Gasless or not (Paymaster or not)
      if (isPaymaster) {
        writeContracts({
          contracts: [
            {
              ...chompCoinConfig,
              functionName: 'approve',
              args: [chompLegacyAddress, amountInWei],
              placeholderData: "Approving Chomp staking"
            },
          ],
          capabilities: {
            paymasterService: {
              url: rpc,
            },
          },
        })
      } else {
        // Not Paymaster 
        writeContract({
          ...chompCoinConfig,
          functionName: 'approve',
          args: [chompLegacyAddress, amountInWei],
          placeholderData: "Approving Chomp staking",
          capabilities: {
            paymasterService: {
              url: rpc,
            },
          },
        })
      }
      
      return true;
    } catch (error) {
      console.error('Approval error:', error);
      // alert("Approval failed. See the console for more information.");
      setLoading(false);
      return false;
    }
  }

  const onApprove = async () => {
    // Ensure account is connected, wait for connectWallet if account is not set
    const effectiveAccount = account || await connectWallet();
  
    if (!effectiveAccount) {
      alert("Wallet connection is required to stake tokens! Please connect wallet.");
      return; // Stop execution if no account is available after trying to connect
    }
  
    const amount = watch("amount");
    if (amount <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }
  
    try {
      const amountInWei = web3.utils.toWei(amount, 'ether');

      setLoading(true);
      // Approve transaction
      const isApprovedRes = await ensureTokenApproval(effectiveAccount, amountInWei);
      if (!isApprovedRes) {
        console.log('Token approval failed or was denied by the user');
        setLoading(false);
        setIsApproved(false);
        return;
      }
      
      if (isPaymaster) {
        setIsApproved(isApprovedRes);
        setLoading(false);
      }
  
    } catch (error) {
      console.error("Approving error:", error);
      alert("Approve failed. See the console for more information.");
      setLoading(false);
    }
  };

  const onStake = async () => {
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
    if (amount <= 0 || !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }

    try {
      setStakeLoading(true);

      const amountInWei = web3.utils.toWei(amount, 'ether');
    
      // Gasless or not (Paymaster or not)
      if (isPaymaster) {
        writeContracts({
          contracts: [
            {
              ...chompLegacyContractConfig,
              functionName: 'stake',
              args: [amountInWei],
              placeholderData: "Stake Chomp coins"
            },
          ],
          capabilities: {
            paymasterService: {
              url: rpc,
            },
          },
        })

        setStakeLoading(false);
        setIsApproved(false);
      } else {
        // No Paymaster
        writeContract({
          ...chompLegacyContractConfig,
          functionName: 'stake',
          args: [amountInWei],
          placeholderData: "Stake Chomp coins",
          capabilities: {
            paymasterService: {
              url: rpc,
            },
          },
        })
      }

      // Reset the amount input field
      reset({ amount: '' });
      // setStakeLoading(false);
      // setIsApproved(false);
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

        // Gasless or not (Paymaster or not)
        if (isPaymaster) {
          writeContracts({
            contracts: [
              {
                ...chompLegacyContractConfig,
                functionName: 'withdraw',
                args: [amount],
                placeholderData: "Unstake Chomp coins",
              },
            ],
            capabilities: {
              paymasterService: {
                url: rpc,
              },
            },
          })

          // Smart wallet doesn't return isConfirming or isSuccess statues
          // So, we update state in 7s
          setTimeout(() => {
            fetchAllUserTokens(account, contract, web3, tokenContract);
            fetchUserChompBalance(account, tokenContract, web3);
    
            setWithdrawLoading(false);
            reset({ amountWithdraw: '' });
          }, 7000);
        } else {
          // No Paymaster
          writeContract({
            ...chompLegacyContractConfig,
            functionName: 'withdraw',
            args: [amount],
            placeholderData: "Unstake Chomp coins",
            capabilities: {
              paymasterService: {
                url: rpc,
              },
            },
          })
        }
       
        // setWithdrawLoading(false);
        // reset({ amountWithdraw: '' });
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
        
        const ethPrice = await contract.methods.ethPrices(tokenId).call();
        const requiredEth = BigInt(ethPrice) * BigInt(quantity);

        // console.log('=== minting start')
        if (isPaymaster) {
          writeContracts({
            contracts: [
              {
                ...chompLegacyContractConfig,
                functionName: 'redeem',
                args: [tokenId, quantity],
                from: account,
                value: requiredEth.toString(),
                placeholderData: "Mint Chomp coins"
              },
            ],
            capabilities: {
              paymasterService: {
                url: rpc,
              },
            },
          })

          setMintLoading(false)
          setMintIndex(99)
        } else {
          // Not Paymaster 
          writeContract({
            ...chompLegacyContractConfig,
            functionName: 'redeem',
            args: [tokenId, quantity],
            from: account,
            value: requiredEth.toString(),
            placeholderData: "Mint Chomp coins",
            capabilities: {
              paymasterService: {
                url: rpc,
              },
            },
          })
        }
        // console.log('=== minting finish')

        // setMintLoading(false)
        // setMintIndex(99)
        // return console.log('NFT minted successfully!');
        return;
    } catch (error) {
        console.error("Error on mint:", error);
        alert("Failed to mint NFTs. See console for more details.");
        setMintLoading(false);
    }
  };
 
  return (
    <NotFoundErrorBoundary>
      <div className="max-w-[1300px] mx-auto px-4 relative">
        <div className="pt-[25px] z-10">
          <div className="border__main">
            <div className="border__main__content">
              <Nav connectWallet={connectWallet} account={account} setAccount={setAccount} updateProvider={updateProvider} setSwapModal={setSwapModal} />
              <h1 className="font-amiger text-[35px] md:text-[55px] pt-[5px] uppercase text-white text-center title__shadow opacity-99">stake chomp, gather dots, mint legacy.</h1>
              <div className="w-full flex justify-center mt-[10px] mb-[20px] sm:mb-[40px]">
                {!account ? (
                  <>
                    <div className="w-[300px] hidden sm:block">
                      <StakeButton 
                        onClick={() => createWallet()}
                        disabled={isConnecting}
                        loading={loading}
                        text="Create Wallet"
                        isDisabledStyles={''}
                      />
                    </div>
                    <div className="w-[300px] block sm:hidden">
                      <ConnectWalletMobile/>
                    </div>
                  </>
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
            <LegacyTabs activeTab={activeLegacyTab} setActiveTab={setActiveLegacyTab} />
            
            {activeLegacyTab === 1 && (
              <Minting 
                nfts={nfts}
                onMint={onMint} 
                mintLoading={mintLoading} 
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
                nftLoading={nftUserLoading}
                isUserNfts={true}
                account={account}
                mintIndex={mintIndex}
              />
            )}
        
          </div>
        </div>
      </div>
      <div className="mt-8 mb-10"><Footer /></div>
      {alertVisible && 
        <Alert
          message={alertMsg} 
          onClose={() => setAlertVisible(false)} 
          url={`${basescan}/tx/${hash}`}
        />
        }
        {swapModal && (
          <SwapModal
            setSwapModal={setSwapModal}
            address={address}
          />
        )}
    </NotFoundErrorBoundary>
  );
}
