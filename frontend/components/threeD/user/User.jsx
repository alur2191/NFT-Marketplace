import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { ViewControls } from './ViewControls'
import { Vector3 } from "three";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import SocketConnection from "./SocketConnection";

const SPEED = 10;

export const User = (props) => {
		const [position, setPosition] = useState({});
    const { camera } = useThree();
    const { moveForward, moveBackward, moveLeft, moveRight, jump, run } = useKeyboardControls();
    const [ref, api] = useSphere(() => ({
        mass: 1,
        type: "Dynamic"
    }));
    const velocity = useRef([0, 0, 0]);

    useEffect(() => {
        api.velocity.subscribe((v) => (velocity.current = v));
        api.position.subscribe((p) => {
        	camera.position.copy({ x: p[0], y: p[1]+5, z: p[2] });
					// setPosition({posX:p[0], posY: p[1], posZ:p[2]})
        });
    }, []);

		console.log("user component");
    useFrame(() => {
        const direction = new Vector3();
        
        const frontVector = new Vector3(
        0,
        0,
        (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
        );
        const sideVector = new Vector3(
        (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
        0,
        0
        );

        direction
					.subVectors(frontVector, sideVector)
					.normalize()
					.multiplyScalar(run?100:SPEED)
					.applyEuler(camera.rotation);
				
        api.velocity.set(direction.x, velocity.current[1], direction.z);
				
        if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) {
        api.velocity.set(velocity.current[0], 8, velocity.current[2]);
        }
    });
		console.log("cam",camera.position)
    return (
    <>
        <ViewControls />
				<SocketConnection posX={camera.position.x} posY={camera.position.y-4} posZ={camera.position.z} username={props.username} />
        {/* <mesh ref={ref}>
            <sphereBufferGeometry args={[1, 16, 16]} />
						<meshBasicMaterial color="black" attach="material" />
        </mesh> */}
    </>
    );
};
