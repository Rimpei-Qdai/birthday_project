import { useState } from 'react'
import ImagePlane from './ImagePlane'
import { Text } from '@react-three/drei'

export default function ImageStack({ 
  images, 
  position = [0, 0, 0],
  scale = [1, 1, 1],
  stackOffset = 0.2,
  rotationOffset = 2
}) {
  const [cardOrder, setCardOrder] = useState(images)

  const nextCard = () => {
    setCardOrder((prevOrder) => {
      const newOrder = [...prevOrder]
      const firstCard = newOrder.shift() // 最初のカードを取り出す
      newOrder.push(firstCard) // 最後に追加
      return newOrder
    })
  }

  return (
    <group position={position} scale={scale}>
      {cardOrder.map((imageSrc, index) => {
        // インデックスに基づいて位置を計算（0が一番前、1が次...）
        const zOffset = -index * stackOffset * 3 // Z軸オフセットを大きく
        const xOffset = index * stackOffset * 0.8 // X軸オフセットも少し大きく
        const yOffset = -index * stackOffset * 0.5 // Y軸オフセットも少し大きく
        const rotation = (index * rotationOffset * Math.PI) / 180

        return (
          <ImagePlane
            key={imageSrc}
            src={imageSrc}
            position={[xOffset, yOffset, zOffset]}
            rotation={[0, 0, rotation]}
            border={true}
            borderColor="white"
            borderWidth={0.3}
          />
        )
      })}
      
      {/* Next Cardボタン */}
      <Text
        position={[0, -8, 0.1]}
        fontSize={1}
        color="white"
        onClick={nextCard}
      >
        Next Card
      </Text>
    
    </group>
  )
}
