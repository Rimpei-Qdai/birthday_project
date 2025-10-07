import { useState, useRef } from 'react'
import ImagePlane from './ImagePlane'
import { Text } from '@react-three/drei'
import gsap from 'gsap'

export default function ImageStack({ 
  images, 
  position = [0, 0, 0],
  scale = [1, 1, 1],
  stackOffset = 0.5,
  messages = [], // 各画像に対応するメッセージ配列
  onImageClick = () => {}, // 親コンポーネントに画像クリックを通知
  isActive = true // ボタンの有効/無効状態
}) {
  const [cardOrder, setCardOrder] = useState(images)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRefs = useRef({})

  const showImageModal = () => {
    console.log("View Image button clicked!") // デバッグ用
    if (!isActive || isAnimating) return // 非アクティブ時は無効
    
    const frontCard = cardOrder[0]
    const imageIndex = images.indexOf(frontCard)
    const message = messages[imageIndex] || 'No message available'
    
    console.log("Front card:", frontCard) // デバッグ用
    console.log("Message:", message) // デバッグ用
    
    // 親コンポーネントにデータを渡す
    onImageClick(frontCard, message)
  }

  const nextCard = () => {
    if (!isActive || isAnimating) return // 非アクティブ時またはアニメーション中は無効化

    const frontCard = cardOrder[0]
    const frontCardRef = cardRefs.current[frontCard]
    
    if (!frontCardRef) return

    setIsAnimating(true)

    // 最終的な後ろの位置を計算
    const finalX = (cardOrder.length - 1) * stackOffset * 3
    const finalY = (cardOrder.length - 1) * stackOffset * 2
    const finalZ = -(cardOrder.length - 1) * stackOffset * 3

    // 一番前のカードをアニメーションさせる
    const timeline = gsap.timeline()
    
    // ステップ1: まず上に浮上（束から離れる）
    timeline.to(frontCardRef.position, {
      y: frontCardRef.position.y + 25, 
      x: frontCardRef.position.x + 25, // 横に移動
      duration: 0.4,
      ease: "power2.out"
    })

    // ステップ2: 浮上しながら横に移動
    .to(frontCardRef.position, {
      z: finalZ - 3,
      duration: 0.2,
      ease: "power2.out"
    })

    // ステップ3: 後ろに回り込む（高い位置から降下）
    .to(frontCardRef.position, {
      x: finalX,
      y: finalY,
      z: finalZ,
      duration: 0.3,
      ease: "power2.inOut"
    })

    // ステップ4: 残りのカードを新しい位置にスムーズに移動
    .call(() => {
      const remainingCards = cardOrder.slice(1) // 2番目以降のカード
      
      remainingCards.forEach((imageSrc, index) => {
        const cardRef = cardRefs.current[imageSrc]
        if (cardRef) {
          const newX = index * stackOffset * 3
          const newY = index * stackOffset * 2
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
        const zOffset = -index * stackOffset * 3 // Z軸の奥行き
        const xOffset = index * stackOffset * 3 // 右方向にずらす（大幅増加）
        const yOffset = index * stackOffset * 2 // 上方向にずらす（大幅増加）
        
        // デバッグ用：最初の数枚のオフセット値を表示
        if (index < 3) {
          console.log(`Card ${index}: x=${xOffset}, y=${yOffset}, z=${zOffset}, stackOffset=${stackOffset}`)
        }

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
      
      {/* View Image ボタン */}
      <Text
        position={[0, -20, 0.1]}
        fontSize={2.5}
        color={isAnimating ? "#666666" : "#00ffff"}
        onClick={isActive ? showImageModal : undefined}
        onPointerOver={isActive ? undefined : undefined}
        fontWeight={700}
      >
        VIEW IMAGE
      </Text>

      {/* Next Cardボタン */}
      <Text
        position={[0, -25, 0.1]}
        fontSize={2.5}
        color={isAnimating ? "#666666" : "#ff6666"}
        onClick={isActive ? nextCard : undefined}
        onPointerOver={isActive ? undefined : undefined}
        fontWeight={700}
      >
        {isAnimating ? "FLIPPING..." : "NEXT CARD"}
      </Text>


    </group>
  )
}
