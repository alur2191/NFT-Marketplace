import { useEffect, useState } from 'react'
import { useBox } from "@react-three/cannon"
import { useAccount, useContract, useProvider, erc721ABI } from "wagmi";
import { useTexture } from '@react-three/drei';

const Nft =({posZ, listing})=>{
	const [hovered, setHovered] = useState(false)
	const [refPainting] = useBox(() => ({ mass:0, position: [posZ-10,6,-18]}))
	
	// State variables to hold information about the NFT
  const [imageURI, setImageURI] = useState("");
  const [name, setName] = useState("");

  // Loading state
  const [loading, setLoading] = useState(true);

  // Get the provider, connected address, and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
  const { address } = useAccount();
  const ERC721Contract = useContract({
    addressOrName: listing.nftAddress,
    contractInterface: erc721ABI,
    signerOrProvider: provider,
  });

  // Check if the NFT seller is the connected user
  const isOwner = address?.toLowerCase() === listing.seller.toLowerCase();

  // Fetch NFT details by resolving the token URI
  async function fetchNFTDetails() {
    try {
      // Get token URI from contract
      let tokenURI = await ERC721Contract.tokenURI(0);
      // If it's an IPFS URI, replace it with an HTTP Gateway link
      tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

      // Resolve the Token URI
      const metadata = await fetch(tokenURI);
      const metadataJSON = await metadata.json();

      // Extract image URI from the metadata
      let image = metadataJSON.imageUrl;
      // If it's an IPFS URI, replace it with an HTTP Gateway link
      image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

      // Update state variables
      setName(metadataJSON.name);
			console.log(image);
      setImageURI(image);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
	
	// const imgTexture = useTexture(imageURI || './image/wall.jpg')
  // Fetch the NFT details when component is loaded
  useEffect(() => {
    fetchNFTDetails();
  }, []);
	
	console.log(imageURI.replace('https://ipfsgateway.makersplace.com/ipfs/', 'https://gateway.moralisipfs.com/ipfs/'))

	const imgTexture = useTexture(imageURI.replace('https://ipfsgateway.makersplace.com/ipfs/', 'https://gateway.moralisipfs.com/ipfs/') || '/image/floor.jpg')
	if(!imageURI && !posZ){
		return(
			<mesh></mesh>
		)
	}else{
		return(
				<>
						<mesh 
								onPointerOver={() => setHovered(true)}
								onPointerOut={() => setHovered(false)}
								ref={refPainting}>
								<planeBufferGeometry attach="geometry" args={[5, 4]} />
								<meshBasicMaterial attach="material" map={imgTexture} toneMapped={false} />
						</mesh>
				</>
		)
	}
}

export default Nft