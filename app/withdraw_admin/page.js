'use client'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
import Nav from '../components/main/Nav';
import ChompLegacyABI from '../../abis/ChompLegacyABI.json';
import LoadingIcon from '../components/elems/Loading';
import { useAccount } from 'wagmi';

const chompLegacyAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const admin1 = process.env.NEXT_PUBLIC_ADMIN1;
const admin2 = process.env.NEXT_PUBLIC_ADMIN2;
const adminWallets = [admin1, admin2];

export default function CreateNft() {
  const { watch, setValue, register } = useForm({
    defaultValues: {
      amount: 0,
      recipient: ''
    }
  });
  const { address } = useAccount();

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const amount = watch('amount');
  const recipient = watch('recipient');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [adminWallet, setAdminWallet] = useState(false)

  function isAdminWallet(walletAddress) {
    return adminWallets.includes(walletAddress);
  }

  useEffect(() => {
    if (!address || address === undefined) return;

    async function checkAccess() {
      const isAdmin = isAdminWallet(address);
      // console.log('==== isAdmin in checkAccess', isAdmin);
      setAdminWallet(isAdmin);
    }

    checkAccess();
  }, [address]);


  useEffect(() => {
    // console.log("==== USEEFFECT works:");

    const loadBlockchainData = async () => {
      // Create a Web3 instance using MetaMask's provider
      if (typeof window !== "undefined") {
        const web3 = new Web3(window.ethereum);

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

  if (!address) {
    return (
      <div className="max-w-[1300px] mx-auto pb-20 pt-6">
        <Nav account={account} setAccount={setAccount} />
        <div className='text-white p-4'>Loading or please connect your wallet...</div>
      </div>
    )
  }

  if (!adminWallet) {
    return (
      <div className="max-w-[1300px] mx-auto pb-20 pt-6">
        <Nav account={account} setAccount={setAccount} />
        <div className='text-white p-4'>Access Denied. This page is only for admins.</div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!account || account === undefined) {
      alert("Wallet connection is required to withdraw ETH! Please connect your wallet.");
      return; 
    } else if (!web3 || !contract) { return };

    if (!isAdminWallet(address)) {
      return alert(`Access Denied. This page is only for admins.`);
    }

    setLoading(true);

    try {
      const eth = web3.utils.toWei(amount.toString(), 'ether');
     
      const res = await contract.methods.withdrawEther(recipient, eth).send({ from: address });
      // console.log('==== res in handleSubmit', res)

      if (res?.transactionHash) {
        setHash(res.transactionHash)
        alert(`Minting was successful! Transaction Hash: ${res.transactionHash}`)
      }
  
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('==== Error in sent ETH:', err);
    }
  };

  const inputStyles = "text-[17px] p-2 mx-2 border-0 rounded text-center focus:outline-none";

  return (
    <main className='max-w-[1300px] mx-auto pb-20 pt-6'>
      <Nav account={account} setAccount={setAccount} />

      <div className="mt-12">
        <h2 className="max-w-[500px] text-white font-bold text-xl mx-auto mb-2">Step 1: Connect wallet</h2>
      </div>

      {adminWallet && (
        <div className="mt-12">
          <h2 className="max-w-[500px] text-white font-bold text-xl mx-auto mb-2">Step 2: Send transaction</h2>
          <div className='max-w-[500px] bg-black rounded-[14px] border border-accent mx-auto'>
            <div className='flex flex-col justify-center pt-2'>
              <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" for={amount}>Amount</label>
              <input type="text" value={amount} {...register('amount')} placeholder="Enter amount of ETH to send" className={inputStyles} />
              <label className="text-xs text-white pl-2 ml-4 mb-1 mt-2" for={recipient}>Wallet</label>
              <input type="text" value={recipient} {...register('recipient')}  placeholder="0x..." className={inputStyles} />
              <button 
                type="submit"
                className={`h-[60px] text-[17px] flex flex-row items-center justify-center font-bold py-2 text-white mx-2 mb-2 mt-[13px] rounded-[14px] uppercase ${!loading ? 'bg-primary hover:opacity-80': 'bg-black text-btnGray'}`}
                disabled={!loading ? false : true}
                onClick={handleSubmit}
              >
                {loading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
      
      {hash.length > 0 && (
        <div className="max-w-[500px] mt-6 mb-6 mx-auto">
          <p className="text-xl text-white">Check Transaction: </p>
          <a href={`https://${process.env.NEXT_PUBLIC_PROD === 'true' ? '' : 'sepolia.'}basescan.org/tx/${hash}`} className="text-[18px] text-primary hover:opacity-80" target="_blank" rel="noopener noreferrer">{hash}</a>

        </div>
      )}
    </main>
  )
}
