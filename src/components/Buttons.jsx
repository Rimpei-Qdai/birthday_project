import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import React from 'react'

const Buttons = ({ text, dest, position, onCameraMove }) => {
    const { camera } = useThree()
    
    const handlePage = () => {
        console.log("Button clicked, dest:", dest)
        if (dest === "photos") {
            console.log("Photos button clicked, moving camera to x:10")
            gsap.to(camera.position, {
                x:10,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        } else if (dest === "messages") {
            console.log("Messages button clicked, moving camera to x:-10")
            gsap.to(camera.position, {
                x:-10,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        } else if (dest === "jun") {
            console.log("Messages button clicked, moving camera to x:-10")
            gsap.to(camera.position, {
                x:10,
                z:-10,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        }else if (dest === "july") {
            console.log("Messages button clicked, moving camera to x:-10")
            gsap.to(camera.position, {
                x:0,
                z:-10,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        }else if (dest === "august") {
            console.log("Messages button clicked, moving camera to x:-10")
            gsap.to(camera.position, {
                x:-10,
                z:-10,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        }else if (dest === "september") {
            console.log("Messages button clicked, moving camera to x:-10")
            gsap.to(camera.position, {
                x:10,
                z:-20,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        }
    }
    return (
        <mesh onClick={handlePage} position={position}>
            <Text
                fontWeight={600}
                fontSize={0.8}
            >
                {text}
            </Text>
            <mesh position={[0, 0, -0.2]} scale={[4, 1, 1]}>
                <planeGeometry />
                <meshBasicMaterial color={'red'} />
            </mesh>
        </mesh>
    )
}

export default Buttons