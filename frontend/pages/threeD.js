import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'
import { Physics, usePlane } from "@react-three/cannon"
import { RepeatWrapping } from 'three'
import { User } from '../components/threeD/user/User';
import Building from '../components/threeD/building/Building'
import { createClient } from "urql";
import { SUBGRAPH_URL } from "../constants";
import { useAccount } from "wagmi";
import Nft from "../components/threeD/nft/Nft"

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

function threeD() {
	 // State variables to contain active listings and signify a loading state
	const [listings, setListings] = useState();
	const [loading, setLoading] = useState(false);
	const { isConnected } = useAccount();

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
		const urqlClient = createClient({
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
	if(loading && isConnected || !listings) {
		<span style={{fontSize:50}}>Loading...</span>
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
						{listings&&listings.map((listing,i)=>{
							return (
								<Nft  key={i} listing={listing} i={i} />
							)
						})}
						<User position={[15, 2, 10]} />
						<Plane />
					</Physics>
				</Canvas>
			</>
		)
	}
}

export default threeD;