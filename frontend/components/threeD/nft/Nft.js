import { useEffect, useState } from 'react'
import { useBox } from "@react-three/cannon"
import { useAccount, useContract, useProvider, erc721ABI } from "wagmi";

const Nft =({i, listing})=>{
	const [hovered, setHovered] = useState(false)


	const [refPainting] = useBox(() => ({ mass:0, position:[i*10-10,6,-18]}))

	return(
			<>
					<mesh 
							onPointerOver={() => setHovered(true)}
							onPointerOut={() => setHovered(false)}
							ref={refPainting}>
							<planeBufferGeometry attach="geometry" args={[5, 4]} />
							{/* <meshBasicMaterial attach="material" map={imgTexture} toneMapped={false} /> */}
					</mesh>
			</>
	)
}

export default Nft