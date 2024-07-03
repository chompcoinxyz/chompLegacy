import ChompLegacyABIProd from './ChompLegacyABI.json';
import LegaciesABIProd from './LegaciesABI.json';
import ChompCoinABIProd from './ChompCoinABI.json';

import ChompLegacyABIDev from './ChompLegacyABIDev.json';
import LegaciesABIDev from './LegaciesABIDev.json';
import ChompCoinABIDev from './ChompCoinABIDev.json';

const isProd = process.env.NEXT_PUBLIC_PROD === "true";

export const ChompLegacyABI = isProd ? ChompLegacyABIProd : ChompLegacyABIDev;
export const LegaciesABI = isProd ? LegaciesABIProd : LegaciesABIDev;
export const ChompCoinABI = isProd ? ChompCoinABIProd : ChompCoinABIDev;