import { Text } from "@react-three/drei"
import { useState } from "react"

const BackButton = ({ position = [0, 0, 0], onBack, destinationType = "main", isActive = true }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (!isActive || !onBack) return // ボタンが非アクティブな場合は何もしない
    onBack(destinationType)
  }

  return (
    <group position={position}>
      {/* 戻るボタンの背景 */}
      <mesh
        onClick={isActive ? handleClick : undefined}
        onPointerEnter={isActive ? () => setIsHovered(true) : undefined}
        onPointerLeave={isActive ? () => setIsHovered(false) : undefined}
        visible={true}
      >
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshBasicMaterial 
          color={isHovered ? "#ff4444" : "#3a1a1a"} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* 宇宙風ボーダーエフェクト */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.6, 0.5, 0.05]} />
        <meshBasicMaterial 
          color="#ff6666" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* 戻るボタンのテキスト */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.18}
        color="#ff6666"
        anchorX="center"
        anchorY="middle"
        fontWeight="700"
      >
        ← BACK
      </Text>
    </group>
  )
}

export default BackButton