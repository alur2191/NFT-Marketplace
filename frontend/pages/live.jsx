import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'
import { Physics, usePlane } from "@react-three/cannon"
import { RepeatWrapping } from 'three'
import { User } from '../components/threeD/user/User';
import Building from '../components/threeD/building/Building'
import { createClient as createUrqlClient } from "urql";
import { SUBGRAPH_URL } from "../constants";
import { configureChains, useAccount, WagmiConfig, createClient } from "wagmi";
import Nft from "../components/threeD/nft/Nft"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { useSelector } from 'react-redux'
import { selectUserState } from '../store/userSlice'
import Username from '../components/threeD/user/Username'

function Plane() {
  const [ref] = usePlane(()=>({
    rotation: [-Math.PI / 2,0,0],
    position:[0,0,0]
  }));

	// const texture = useLoader(TextureLoader, img)
	const texture = useTexture('./image/floor.jpg')

  if (texture) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(15, 15);
    texture.anisotropy = 16;
  }
  return(
    <mesh position={[0,0,0]} rotation={[-Math.PI/ 2,0,0]}>
      <planeBufferGeometry attach="geometry" args={[500,500]}/>
      <meshLambertMaterial attach="material" map={texture} />
    </mesh>
  )
}

const threeDChain = {
  id: 44787,
  name: "Celo Alfajores Testnet",
  network: "alfajores",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpcUrls: {
    default: "https://alfajores-forno.celo-testnet.org",
  },
  blockExplorers: {
    default: {
      name: "celoScan",
      url: "https://alfajores.celoscan.io",
    },
  },
  testnet: true,
};



const { chains, provider } = configureChains(
  [threeDChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== threeDChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "ThreeD NFT Marketplace",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});


function threeD() {
	 // State variables to contain active listings and signify a loading state
	const [listings, setListings] = useState();
	const [loading, setLoading] = useState(false);
	const { isConnected } = useAccount();

	const userState = useSelector(selectUserState);

	// Function to fetch listings from the subgraph
	async function fetchListings() {
		setLoading(true);
		// The GraphQL query to run
		const listingsQuery = `
			query ListingsQuery {
				listingEntities {
					id
					nftAddress
					tokenId
					price
					seller
					buyer
				}
			}
		`;

		// Create a urql client
		const urqlClient = createUrqlClient({
			url: SUBGRAPH_URL,
		});

		// Send the query to the subgraph GraphQL API, and get the response
		const response = await urqlClient.query(listingsQuery, {}).toPromise();
		const listingEntities = response.data.listingEntities;

		// Filter out active listings i.e. ones which haven't been sold yet
		const activeListings = listingEntities.filter((l) => l.buyer === null);
		console.log(activeListings)
		// Update state variables
		setListings(activeListings);
		setLoading(false);
	}

	useEffect(() => {
		// Fetch listings on page load once wallet connection exists
		if (isConnected) {
			fetchListings();
		}
	}, []);
  const cursorRef = useRef()

	if(loading ) {
		<span style={{fontSize:50}}>Loading...</span>
	} else if (!userState){
		return(
			<>
				<Username />
			</>
		)
	} else {
		return (
			<>
				<div ref={cursorRef} id="cursor"><span></span></div>
				<Canvas style={{height:'100vh', background:'#161616'}} raycaster={{
						computeOffsets: (_, { size: width, height }) => {
							return ({
								offsetX: width / 2,
								offsetY: height / 2
							})
						}
					}}>
					<Stars />
					<ambientLight intensity={0.5}/>
					<spotLight
						position={[10,15,10]}
						angle={0.3}
					/>
					<Physics gravity={[0, -30, 0]} >
						<Building cursorRef={cursorRef} listings={listings}/>
						{isConnected ?
							<WagmiConfig client={wagmiClient}>
								{listings&&listings.map((listing,i)=>{
									return (
										<Nft  key={i} listing={listing} posZ={(i+1)*10-10} />
									)
								})}
							</WagmiConfig> 
							: null
						}
						<User position={[15, 2, 10]} username={userState}/>
						<Plane />
					</Physics>
				</Canvas>
			</>
		)
	}
}

export default threeD;