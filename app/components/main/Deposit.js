import React from 'react';
import TokenIcon from '../elems/TokenIcon';
import LoadingIcon from '../elems/Loading';

export default function Deposit({ 
  totalStakedTokens, 
  onStake,
  amount,
  handleSubmit,
  register,
  onApprove,
  isApproved,
  loading,
  stakeLoading,
  handleMaxClick,
  balance,
  userDots
}) {

  const formattedStaked = parseFloat(totalStakedTokens).toLocaleString('en-US');
  const formattedDots = parseFloat(userDots).toLocaleString('en-US');

  return (
    <div className="deposit flex flex-col items-center justify-between mt-6">
      <div className="w-full flex flex-row items-center justify-between mb-[6px]">
        <p className="text-[15px] font-bold text-black">Total staked:</p>
        <p className="text-[17px] font-bold text-black">{formattedStaked} CHOMP</p>
      </div>
      <div className="w-full flex flex-row items-center justify-between mt-4 mb-[6px]">
        <p className="text-[15px] font-bold text-black">Earned Dots:</p>
        <p className="text-[17px] font-bold text-black">{formattedDots} Dots</p>
      </div>
      <form onSubmit={handleSubmit(onStake)} className="w-full mt-6">
        <div className='w-full h-[60px] flex items-center flex-row justify-between bg-white mt-4 px-[10px] border border-accent2 rounded-[10px]'>
          <TokenIcon />
          <div className="flex flex-row items-center">
            <input type="text" {...register('amount')} className="text-[17px] p-2 w-[150px] md:w-[250px] ml-4 border-0 mr-2 rounded text-right focus:outline-none" />
            <div 
              onClick={handleMaxClick}
              className="text-[14px] leading-[30px] font-bold text-accent2 border border-accent2 hover:text-accent hover:border-accent rounded px-[10px] cursor-pointer"
            >
              MAX
            </div>
          </div>
        </div>
        <div className="w-full text-right text-[14px] text-black mt-1">balance: {balance}</div>
        <button 
          type="submit" 
          onClick={handleSubmit(onApprove)}
          className={`w-full h-[60px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 text-white mt-[18px] rounded-[10px] uppercase ${!amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 || loading || isApproved ? 'bg-btnDisabled text-btnGray': 'bg-primary hover:bg-blue-700'}`}
          disabled={loading || isApproved ? true : !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 ? true : false}
        >
          {loading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
          {!loading ? 'Approve' : 'Pending...'}
        </button>
        <button 
          type="submit" 
          onClick={handleSubmit(onStake)}
          className={`w-full h-[60px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 text-white  mt-[13px] rounded-[10px] uppercase ${!amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 || !isApproved || stakeLoading ? 'bg-btnDisabled text-btnGray': 'bg-primary hover:bg-blue-700'}`}
          disabled={!isApproved || loading ? true : !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 ? true : false}
        >
          {stakeLoading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
          {!stakeLoading ? 'Stake' : 'Pending...'}
        </button>
      </form>
      <div className="w-full mt-4">
      </div>
    </div>
  );
}
