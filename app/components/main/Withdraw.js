import React from 'react';
import LoadingIcon from '../elems/Loading';
import TokenIcon from '../elems/TokenIcon';
const chompAddress = process.env.NEXT_PUBLIC_TOKEN_RAIN_ADDRESS;

export default function Withdraw({ 
  userStakedTokens, 
  onWithdraw, 
  withdrawLoading,
  handleSubmit,
  handleMaxClick,
  register,
  amountWithdraw,
}) {
  const formattedStaked = parseFloat(userStakedTokens).toLocaleString('en-US');

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex flex-col mt-[25px] mb-[20px]">
        <p className="text-[15px] text-center font-bold text-darkMain">Your Staked Tokens</p>
        <p className="text-[23px] text-center font-bold text-withdrawGray">{formattedStaked} CHOMP</p>
      </div>
      <div className="w-full flex flex-col justify-between">
        <form onSubmit={handleSubmit(onWithdraw)} className="w-full mt-6">
          <div className='w-full h-[60px] flex items-center flex-row justify-between bg-white mt-4 px-[10px] border border-accent2 rounded-[10px]'>
            <TokenIcon token={chompAddress} />
            <div className="flex flex-row items-center">
              <input type="text" {...register('amountWithdraw')} className="text-[17px] p-2 w-[150px] md:w-[250px] ml-4 border-0 mr-2 rounded text-right focus:outline-none" />
              <div 
                onClick={handleMaxClick}
                className="text-[14px] leading-[30px] font-bold text-accent2 border border-accent2 hover:text-accent hover:border-accent rounded px-[10px] cursor-pointer"
              >
                MAX
              </div>
            </div>
          </div>
          <div className="w-full text-right text-[14px] text-black mt-1">staked tokens: {formattedStaked}</div>
          <button 
            type="submit" 
            onClick={onWithdraw}
            className={`w-full h-[60px] text-[17px] flex flex-row items-center justify-center font-bold px-6 py-2 text-white  mt-[13px] rounded-[10px] uppercase ${!withdrawLoading && userStakedTokens > 0 && amountWithdraw > 0 ? 'bg-primary hover:bg-blue-700': 'bg-btnDisabled text-btnGray'}`}
            disabled={!withdrawLoading && userStakedTokens > 0 && amountWithdraw > 0 ? false : true}
          >
            {withdrawLoading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" />}
            {!withdrawLoading ? 'Withdraw' : 'Pending...'}
          </button>
        </form>
      </div>
    </div>
  );
}
