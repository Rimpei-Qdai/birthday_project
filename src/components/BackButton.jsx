import { Text } from "@react-three/drei"
import { useState } from "react"

const BackButton = ({ position = [0, 0, 0], onBack, destinationType = "main" }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onBack) {
      onBack(destinationType)
    }
  }

  return (
    <group position={position}>
      {/* 戻るボタンの背景 */}
      <mesh
        onClick={handleClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshBasicMaterial 
          color={isHovered ? "#ff6b6b" : "#ff8787"} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* 戻るボタンのテキスト */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        ← 戻る
      </Text>
    </group>
  )
}

export default BackButton