// General.
export const USE_INJECTED_WEB3 = true; // for use with eg. metamask
export const TARGET_LIVE_NETWORK = 'ganache'; // rinkeby, mainnet, ganache
export const USE_CACHE = false;
export const SHOW_VERSION = false;
export const CHECK_NETWORK_TICK = 5000;
export const CHECK_ACCOUNT_TICK = 500;
export const ETH_SYMBOL = ' Ξ ';
export const HISTORY_CHECK_BATCH = 1000;
export const FETCH_PREDICTIONS_BATCH = 15;

// Market contract urls.
export const MARKET_ADDRESS = {
  mainnet: '',
  rinkeby: '0xe6f22b5c549bdce613d3ecf27911b1f0007974de',
  ganache: '0x43f4c087133388c9caa1e9fc20a54f66d96e771c'
};

// Block explorer urls.
export const EXPLORER_URL = {
  ganache: 'http://127.0.0.1:8545',
  rinkeby: 'https://rinkeby.etherscan.io/',
  mainnet: 'https://etherscan.io/'
};

// Router paths.
const baseURL = '';
export const PATH_CREATE = baseURL + '/create';
export const PATH_PREDICTION = baseURL + '/prediction/:address';
export const PATH_ROOT = baseURL + '/';
export const PATH_LIST = baseURL + '/list/:page';
export const PATH_ABOUT = baseURL + '/about';
export const SITE_URL = 'http://localhost:3000';

// Local storage.
export const STORAGE_PREVIEW_KEY = 'tk_preview_' + TARGET_LIVE_NETWORK + '_';
export const STORAGE_PREDICTION_KEY = 'tk_prediction_' + TARGET_LIVE_NETWORK + '_';
export const STORAGE_MARKET_KEY = 'tk_market_' + TARGET_LIVE_NETWORK + '_';