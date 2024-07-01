import React from 'react';
import TokenIcon from '../elems/TokenIcon';
import DotsIcon from '../elems/DotsIcon';
import StakeButton from '../elems/StakeButton';

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
  let onSubmit = activeTab === 1 ? onStake : onWithdraw;

  return (
    <div className="stake shadow__gradient w-full md:w-[550px] bg-dark flex flex-col items-center justify-between opacity-99 sm:mt-6 px-8 pt-[22px] pb-[28px] rounded-[14px]">
      <p 
        className="w-full text-[15px] font-medium text-primary text-right uppercase mb-4 cursor-pointer hover:opacity-80"
        onClick={() => setActiveTab(activeTab === 1 ? 2 : 1)}
      >
        {activeTab === 1 ? "Unstake" : "Stake"}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className='sm:h-[60px] flex flex-col sm:flex-row justify-between items-start sm:items-center mx-4 sm:mx-0'>
          <p className="w-full sm:w-[71px] text-white font-medium text-[19px] flex flex-row items-center justify-between mb-4 sm:mb-0">
            {activeTab === 1 ? "Stake" : "Unstake"}
            <span className="ml-auto sm:hidden"><TokenIcon /></span>
          </p>
          <div className="flex flex-row items-center">
            <div className="flex items-center flex-row justify-between bg-white sm:mx-4 px-[10px] border border-accent2 rounded-[10px]">
              {activeTab === 1 ? 
              <input type="text" {...register('amount')} className="text-[19px] p-2 w-[150px] md:w-[180px] border-0 mr-2 rounded text-left focus:outline-none" placeholder='0' /> : 
              <input type="text" {...register('amountWithdraw')} className="text-[19px] p-2 w-[150px] md:w-[180px] ml border-0 mr-2 rounded text-left focus:outline-none" placeholder='0' />}
              <div 
                onClick={activeTab === 1 ? handleMaxClick : handleWithdrawMaxClick}
                className="text-[14px] leading-[30px] font-bold text-accent2 border border-accent2 hover:text-accent hover:border-accent rounded px-[10px] cursor-pointer"
              >
                MAX
              </div>
            </div>
          </div>
          <div className="hidden sm:block"><TokenIcon /></div>
        </div>

        <div className="w-full flex flex-row items-center justify-between mb-[20px] mt-7">
          <p className="w-1/2 text-[13px] font-medium text-white uppercase">Staked: {formattedStaked} CHOMP </p>
          <div className="w-1/2 text-right">
            <p className="text-[13px] font-medium text-white text-right uppercase flex flex-col sm:flex-row justify-end  items-end sm:items-center">
              balance: {formattedDots}
              <span className="flex flex-row items-center ml-1">dots <span className="ml-2"><DotsIcon/></span></span>
            </p>
          </div>
        </div>
        {/* <div className="w-full flex flex-row items-center justify-between mt-4 mb-[6px]">
          <p className="text-[15px] font-bold text-white">Earned Dots:</p>
          <p className="text-[17px] font-bold text-white">{formattedDots} Dots</p>
        </div> */}
        {activeTab === 1 ? (
          <>
            <StakeButton 
              onClick={handleSubmit(onApprove)}
              disabled={loading || isApproved ? true : !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 ? true : false}
              loading={loading}
              text={!loading ? 'Approve' : 'Pending...'}
              isDisabledStyles={loading || isApproved}
            />
            <StakeButton 
              onClick={handleSubmit(onStake)}
              disabled={!isApproved || loading ? true : !amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 ? true : false}
              loading={stakeLoading}
              text={!stakeLoading ? 'Stake' : 'Pending...'}
              isDisabledStyles={!amount || amount.length === 0 || isNaN(amount) || parseFloat(amount) <= 0 || !isApproved || stakeLoading}
            />
          </>
        ) : (
          <>
            <StakeButton 
              onClick={onWithdraw}
              disabled={!withdrawLoading && userStakedTokens > 0 || !amountWithdraw || amountWithdraw.length === 0 || isNaN(amountWithdraw) || parseFloat(amountWithdraw) <= 0 ? false : true}
              loading={withdrawLoading}
              text={!withdrawLoading ? 'Unstake' : 'Pending...'}
              isDisabledStyles={withdrawLoading || userStakedTokens <= 0}
            />
            <div className="h-[50px]"></div>
          </>
        )}
        
      </form>
    </div>
  );
}
