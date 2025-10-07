import { useState, useRef } from 'react'
import ImagePlane from './ImagePlane'
import { Text } from '@react-three/drei'
import gsap from 'gsap'

export default function ImageStack({ 
  images, 
  position = [0, 0, 0],
  scale = [1, 1, 1],
  stackOffset = 0.2
}) {
  const [cardOrder, setCardOrder] = useState(images)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRefs = useRef({})

  const nextCard = () => {
    if (isAnimating) return // アニメーション中は無効化

    const frontCard = cardOrder[0]
    const frontCardRef = cardRefs.current[frontCard]
    
    if (!frontCardRef) return

    setIsAnimating(true)

    // 最終的な後ろの位置を計算
    const finalX = (cardOrder.length - 1) * stackOffset * 0.8
    const finalY = -(cardOrder.length - 1) * stackOffset * 0.5
    const finalZ = -(cardOrder.length - 1) * stackOffset * 3

    // 一番前のカードをアニメーションさせる
    const timeline = gsap.timeline()
    
    // ステップ1: まず上に浮上（束から離れる）
    timeline.to(frontCardRef.position, {
      y: frontCardRef.position.y + 6, // 高く浮上
      duration: 0.3,
      ease: "power2.out"
    })

    // ステップ2: 浮上しながら横に移動
    .to(frontCardRef.position, {
      x: frontCardRef.position.x + 12, // 横に移動
      y: frontCardRef.position.y + 8, // さらに高く
      duration: 0.4,
      ease: "power2.out"
    })

    // ステップ3: 後ろに回り込む（高い位置から降下）
    .to(frontCardRef.position, {
      x: finalX,
      y: finalY,
      z: finalZ,
      duration: 0.6,
      ease: "power2.inOut"
    })

    // ステップ4: 残りのカードを新しい位置にスムーズに移動
    .call(() => {
      const remainingCards = cardOrder.slice(1) // 2番目以降のカード
      
      remainingCards.forEach((imageSrc, index) => {
        const cardRef = cardRefs.current[imageSrc]
        if (cardRef) {
          const newX = index * stackOffset * 0.8
          const newY = -index * stackOffset * 0.5
          const newZ = -index * stackOffset * 3
          
          gsap.to(cardRef.position, {
            x: newX,
            y: newY,
            z: newZ,
            duration: 0.3,
            ease: "power2.out"
          })
        }
      })
    })

    // ステップ5: アニメーション完了後に状態更新
    .call(() => {
      setTimeout(() => {
        setCardOrder((prevOrder) => {
          const newOrder = [...prevOrder]
          const firstCard = newOrder.shift()
          newOrder.push(firstCard)
          return newOrder
        })
        setIsAnimating(false)
      }, 300)
    })
  }

  return (
    <group position={position} scale={scale}>
      {cardOrder.map((imageSrc, index) => {
        // インデックスに基づいて位置を計算（0が一番前、1が次...）
        const zOffset = -index * stackOffset * 3 // Z軸オフセットを大きく
        const xOffset = index * stackOffset * 0.8 // X軸オフセットも少し大きく
        const yOffset = -index * stackOffset * 0.5 // Y軸オフセットも少し大きく

        return (
          <group
            key={imageSrc}
            ref={(el) => {
              if (el) cardRefs.current[imageSrc] = el
            }}
            position={[xOffset, yOffset, zOffset]}
          >
            <ImagePlane
              src={imageSrc}
              border={true}
              borderColor="white"
              borderWidth={0.3}
            />
          </group>
        )
      })}
      
      {/* Next Cardボタン */}
      <Text
        position={[0, -8, 0.1]}
        fontSize={1}
        color={isAnimating ? "gray" : "white"}
        onClick={nextCard}
      >
        {isAnimating ? "Flipping..." : "Next Card"}
      </Text>
    </group>
  )
}
