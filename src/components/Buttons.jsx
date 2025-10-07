import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import React from 'react'

const Buttons = ({ text, dest, position, onCameraMove, isActive = true }) => {
    const { camera } = useThree()
    
    const handlePage = () => {
        if (!isActive) return // ボタンが非アクティブな場合は何もしない
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
                x:-20,
                z:-10,
                duration: 2,
                ease: "power2.out"
            })
            onCameraMove(dest)
        }
    }
    return (
        <mesh 
            onClick={isActive ? handlePage : undefined} 
            position={position}
            onPointerOver={isActive ? () => {} : undefined}
            onPointerOut={isActive ? () => {} : undefined}
        >
            <Text
                fontWeight={600}
                fontSize={0.8}
                color={isActive ? "white" : "#888888"}
            >
                {text}
            </Text>
            <mesh position={[0, 0, -0.2]} scale={[4, 1, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    color={isActive ? 'red' : '#666666'} 
                    opacity={isActive ? 1 : 0.3}
                    transparent={true}
                />
            </mesh>
        </mesh>
    )
}

export default Buttons