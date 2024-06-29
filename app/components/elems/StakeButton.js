import React from 'react';
import LoadingIcon from './Loading';

export default function StakeButton({ onClick, disabled, isDisabledStyles, loading, text}) {
    return (
      <div className={`${isDisabledStyles ? '' : 'border__button' } w-full text-[17px]`}>
        <button 
          type="submit" 
          onClick={onClick}
          className={`w-full h-[50px] text-[17px] shadow-xl flex flex-row items-center justify-center font-bold text-white uppercase ${isDisabledStyles ? '!bg-transparent text-primary py-[10px]' : 'border__button__content'}`}
          disabled={disabled}
        >
          <span className={`${isDisabledStyles ? 'text-primary' : 'border__button__text' } flex flex-row items-center`}>
            {loading && <LoadingIcon className="mr-2 h-8 w-8 animate-spin" color="text-primary" />}
            {text}
          </span>
        </button>
      </div>
    );
}
