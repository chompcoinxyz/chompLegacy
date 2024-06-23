import React from 'react';
import TokenIcon from '../elems/TokenIcon';
import LoadingIcon from '../elems/Loading';
import DotsIcon from '../elems/DotsIcon';

export default function Deposit({ 
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
  userDots,
  setActiveTab,
  activeTab,
  onWithdraw,
  withdrawLoading,
  handleWithdrawMaxClick,
  amountWithdraw,
  userStakedTokens,
}) {

  const formattedStaked = userStakedTokens > 0 ? parseFloat(userStakedTokens).toLocaleString('en-US') : 0;
  const formattedDots = userDots > 0 ? parseFloat(userDots).toLocaleString('en-US') : 0;
  const formattedBalance = parseFloat(balance).toLocaleString('en-US');

  let onSubmit = activeTab === 1 ? onStake : onWithdraw;

  console.log('=== userStakedTokens', userStakedTokens)
  console.log('=== withdrawLoading', withdrawLoading)
  console.log('=== isApproved', isApproved)

  return (
    <div className="stake md:w-[550px] bg-dark flex flex-col items-center justify-between opacity-99 mt-6 px-8 py-9 rounded-[14px]">
      <p 
        className="w-full text-[13px] font-medium text-primary text-right uppercase mb-4 cursor-pointer hover:opacity-80"
        onClick={() => setActiveTab(activeTab === 1 ? 2 : 1)}
      >
        {activeTab === 1 ? "Unstake" : "Stake"}
      </p>
      {/* <form onSubmit={handleSubmit(onStake)} className="w-full"> */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className='h-[60px] flex items-center flex-row justify-between'>
         <p className="text-white font-medium text-[19px]">{activeTab === 1 ? "Stake" : "Unstake"}</p>
          <div className="flex flex-row items-center">
            <div className="flex items-center flex-row justify-between bg-white mx-4 px-[10px] border border-accent2 rounded-[10px]">
              {/* <input type="text" {...register('amount')} className="text-[19px] p-2 w-[150px] md:w-[180px] ml border-0 mr-2 rounded text-left focus:outline-none" placeholder='0' /> */}
              {activeTab === 1 ? 
              <input type="text" {...register('amount')} className="text-[19px] p-2 w-[150px] md:w-[180px] ml border-0 mr-2 rounded text-left focus:outline-none" placeholder='0' /> : 
              <input type="text" {...register('amountWithdraw')} className="text-[19px] p-2 w-[150px] md:w-[180px] ml border-0 mr-2 rounded text-left focus:outline-none" placeholder='0' />}
              <div 
                onClick={activeTab === 1 ? handleMaxClick : handleWithdrawMaxClick}
                className="text-[14px] leading-[30px] font-bold text-accent2 border border-accent2 hover:text-accent hover:border-accent rounded px-[10px] cursor-pointer"
              >
                MAX
              </div>
            </div>
          </div>
          <TokenIcon />
        </div>

        <div className="w-full flex flex-row items-center justify-between mb-[20px] mt-7">
          <p className="w-1/2 text-[13px] font-medium text-white uppercase">Staked: {formattedStaked} CHOMP </p>
          <div className="w-1/2 text-right">
            <p className="text-[13px] font-medium text-white text-right uppercase flex items-center flex-row justify-end">balance: {formattedDots} dots 
            <span className="ml-2"><DotsIcon/></span>
            </p>
          </div>
        </div>
        {/* <div className="w-full flex flex-row items-center justify-between mt-4 mb-[6px]">
          <p className="text-[15px] font-bold text-white">Earned Dots:</p>
          <p className="text-[17px] font-bold text-white">{formattedDots} Dots</p>
        </div> */}
        {activeTab === 1 ? (
          <>
            <button 
              type="submit" 
              onClick={handleSubmit(onApprove)}
              className={`w-full h-[45px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 rounded-[10px] uppercase ${loading || isApproved ? 'bg-transparent text-primary': 'bg-primary text-white hover:opacity-80'}`}
              disabled={loading || isApproved ? true : !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 ? true : false}
            >
              {loading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
              {!loading ? 'Approve' : 'Pending...'}
            </button>
            <button 
              type="submit" 
              onClick={handleSubmit(onStake)}
              className={`w-full h-[45px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 mt-[5px] rounded-[10px] uppercase ${!amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 || !isApproved || stakeLoading ? 'bg-transparent text-primary': 'bg-primary text-white hover:opacity-80'}`}
              disabled={!isApproved || loading ? true : !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 ? true : false}
            >
              {stakeLoading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
              {!stakeLoading ? 'Stake' : 'Pending...'}
            </button>
          </>
        ) : (
          <>
            <button 
              type="submit" 
              onClick={onWithdraw}
              className={`w-full h-[45px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 mt-[5px] rounded-[10px] uppercase ${!withdrawLoading && userStakedTokens > 0 ? 'bg-primary text-white hover:opacity-80' : 'bg-transparent text-primary'}`}
              disabled={!withdrawLoading && userStakedTokens > 0 || !amountWithdraw || amountWithdraw.length === 0 || isNaN(amountWithdraw) || parseFloat(amountWithdraw) <= 0 ? false : true}
            >
              {withdrawLoading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
              {!withdrawLoading ? 'Unstake' : 'Pending...'}
            </button>
            <div className="h-[50px]"></div>
          </>
        )}
        
      </form>
    </div>
  );
}
