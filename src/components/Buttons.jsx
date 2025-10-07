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
                fontWeight={700}
                fontSize={0.7}
                color="#00ffff"
            >
                {text}
            </Text>
            <mesh position={[0, 0, -0.2]} scale={[4, 1, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    color='#1a1a3a' 
                    opacity={0.8}
                    transparent={true}
                />
            </mesh>
            
            {/* 宇宙風ボーダーエフェクト */}
            <mesh position={[0, 0, -0.15]} scale={[4.1, 1.1, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    color='#00ffff' 
                    opacity={0.6}
                    transparent={true}
                />
            </mesh>
        </mesh>
    )
}

export default Buttons