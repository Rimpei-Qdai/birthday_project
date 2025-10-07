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
          color={isHovered && isActive ? "#ff6b6b" : "#ff8787"} 
          transparent 
          opacity={isActive ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* 戻るボタンのテキスト */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color={isActive ? "white" : "#cccccc"}
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