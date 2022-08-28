import io, { Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useSphere } from "@react-three/cannon";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

interface PoisitionProps {
  posX:number; 
	posY:number;
	posZ:number;
	username:string;
}

export default function SocketConnection({posX, posY, posZ, username}: PoisitionProps) {
  const [positions, setPositions] = useState<{[key:string]: any}>({});
  useEffect(() => {
    socketInitializer();
		if(socket && posX &&posZ){
				socket.emit("createdPosition", { posX, posY, posZ, username });
				setPositions(
					{ ...positions, [username]:{posX, posY, posZ} },
				)
		}
  }, [posX, posY, posZ]);
	const [ref, api] = useSphere(() => ({
		mass: 1,
		type: "Dynamic",
		position:[0,0,0]
	}));
  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();
    socket.on("newIncomingPosition", (incomingUserPosition) => {
      setPositions({...positions, 
					[incomingUserPosition.username]:
					{
						posX: incomingUserPosition.posX,
						posY: incomingUserPosition.posY,
						posZ: incomingUserPosition.posZ
					}
				},
      );
    });
  };
	console.log(positions);
  return (

		<>
			{Object.keys(positions).map((item, i)=>(
				// // console.log("aasfkdam>",positions[item].posX,positions[item].posY,positions[item].posZ)
				<>
					<mesh ref={ref} position={[positions[item].posX, positions[item].posY, positions[item].posZ]}>
						<sphereBufferGeometry args={[1, 16, 16]} />
					</mesh>
				</>
				
			))
			}
		</>
  );
}