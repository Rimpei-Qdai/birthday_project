import { Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import '../public/styles/experience.css?1005'
import Buttons from './components/Buttons'
import { useRef, useState } from 'react'
import * as THREE from 'three'

// カメラコントローラーコンポーネント
const CameraController = ({ targetPosition, targetLookAt }) => {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    // カメラの目線をスムーズに変更
    currentLookAt.current.lerp(targetLookAt, 0.03)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

const Experience = () => {
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0))
  
  const handleCameraMove = (dest) => {
    if (dest === "photos") {
      setCameraTarget(new THREE.Vector3(10, 0, 0))
    } else if (dest === "messages") {
      setCameraTarget(new THREE.Vector3(-10, 0, 0))
    }
  }

  return (
    <Canvas 
        className='webgl'
    >
        <color args={ [0x74C2E8] }  attach="background" />
        <CameraController targetLookAt={cameraTarget} />
        
        <Text
        position={[ 0, 3, 0 ]}
        fontWeight={600}
        fontSize={0.8}
        >
            Happy
        </Text>
        <Text
        position={[0, 1.9, 0]}
        fontWeight={600}
        fontSize={0.8}
        >
            Birthday!
        </Text>

        <Buttons text={'PHOTOS'} dest={'photos'} position={[0, 0, 0]} onCameraMove={handleCameraMove} />
        <Buttons text={'MESSAGE'} dest={'messages'} position={[0, -1.2, 0]} onCameraMove={handleCameraMove} />

        <Text position={[-10 ,0 ,0]}>
            Test
        </Text>

        <Text position={[10 ,0 ,0]}>
            Test
        </Text>

    </Canvas>
  )
}

export default Experience