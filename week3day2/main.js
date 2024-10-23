import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// 1. Get projectId from https://cloud.reown.com
const projectId = '3601453f08d1e9c56738e329335963c6'

// 2. Create your application's metadata object
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://46.4.29.30', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Create a AppKit instance
const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, arbitrum],
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

async function showAddress(){
  try{
    await modal.open();
    const wallet_address = modal.getAddress(); 
    if (!wallet_address) {
      return;
    }
    console.log("wallet_address:", wallet_address);
    document.getElementById('wallet-address').textContent = wallet_address;
  }catch(error){
    console.log('connect error:', error);
  }

}

const openConnectModalBtn = document.getElementById('open-connect-modal');
openConnectModalBtn.addEventListener('click', () => showAddress());

