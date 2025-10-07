import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SummerParticles({ count = 15, area = 30 }) {
  const groupRef = useRef()
  const [svgTextures, setSvgTextures] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  // SVGファイルのパス
  const svgPaths = [
    '/imgs/svgs/かき氷のフリーアイコン.svg',
    '/imgs/svgs/カットしたスイカのアイコン.svg',
    '/imgs/svgs/スイカの無料アイコン.svg',
    '/imgs/svgs/天気記号8.svg',
    '/imgs/svgs/熱帯魚のアイコン素材 2.svg'
  ]

  // SVGテクスチャを作成
  useEffect(() => {
    console.log('Starting SVG texture loading...')
    const loadSVGTextures = async () => {
      const texturePromises = svgPaths.map(async (path, i) => {
        try {
          console.log(`Loading SVG ${i}: ${path}`)
          // SVGを読み込み
          const response = await fetch(path)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          const svgText = await response.text()
          console.log(`SVG ${i} fetched, length: ${svgText.length}`)
          
          // SVGをBlobに変換
          const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(svgBlob)
          
          // canvasでSVGをテクスチャに変換
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 128
          canvas.height = 128
          
          const img = new Image()
          
          const texture = await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              console.warn(`SVG ${i} load timeout`)
              URL.revokeObjectURL(url)
              reject(new Error('Load timeout'))
            }, 3000)
            
            img.onload = () => {
              clearTimeout(timeoutId)
              console.log(`SVG ${i} loaded successfully`)
              try {
                // 背景をクリア（透明）
                ctx.clearRect(0, 0, 128, 128)
                
                // SVGを描画
                ctx.drawImage(img, 0, 0, 128, 128)
                
                // 白色でマスク（色変更のため）
                ctx.globalCompositeOperation = 'source-in'
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, 128, 128)
                
                // テクスチャ作成
                const texture = new THREE.CanvasTexture(canvas)
                texture.needsUpdate = true
                
                URL.revokeObjectURL(url)
                resolve(texture)
              } catch (drawError) {
                console.error(`Drawing error for SVG ${i}:`, drawError)
                URL.revokeObjectURL(url)
                reject(drawError)
              }
            }
            
            img.onerror = (error) => {
              clearTimeout(timeoutId)
              console.error(`Image load error for SVG ${i}:`, error)
              URL.revokeObjectURL(url)
              reject(error)
            }
            
            img.src = url
          })
          
          return texture
          
        } catch (error) {
          console.log(`SVG ${i} failed, creating fallback:`, error)
          // フォールバック用シンプル形状
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 128
          canvas.height = 128
          
          ctx.clearRect(0, 0, 128, 128)
          ctx.fillStyle = 'white'
          
          // シンプルな星形を描画
          ctx.beginPath()
          const centerX = 64, centerY = 64, radius = 40
          for (let j = 0; j < 5; j++) {
            const angle = (j * Math.PI * 2) / 5 - Math.PI / 2
            const x = centerX + Math.cos(angle) * radius
            const y = centerY + Math.sin(angle) * radius
            if (j === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
            
            const innerAngle = angle + Math.PI / 5
            const innerX = centerX + Math.cos(innerAngle) * (radius * 0.4)
            const innerY = centerY + Math.sin(innerAngle) * (radius * 0.4)
            ctx.lineTo(innerX, innerY)
          }
          ctx.closePath()
          ctx.fill()
          
          const texture = new THREE.CanvasTexture(canvas)
          texture.needsUpdate = true
          return texture
        }
      })
      
      try {
        const results = await Promise.allSettled(texturePromises)
        const textures = []
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            textures.push(result.value)
          } else {
            console.error(`SVG ${index} failed completely:`, result.reason)
            // Create emergency fallback
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = 128
            canvas.height = 128
            
            ctx.clearRect(0, 0, 128, 128)
            ctx.fillStyle = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index % 5]
            
            // Draw simple circle
            ctx.beginPath()
            ctx.arc(64, 64, 30, 0, Math.PI * 2)
            ctx.fill()
            
            textures.push(new THREE.CanvasTexture(canvas))
          }
        })
        
        console.log(`Loaded ${textures.length} textures out of ${svgPaths.length}`)
        
        if (textures.length > 0) {
          setSvgTextures(textures)
          setIsLoaded(true)
          console.log('SVG textures ready!')
        } else {
          console.error('No textures loaded successfully')
        }
      } catch (error) {
        console.error('Error loading SVG textures:', error)
      }
    }
    
    loadSVGTextures()
  }, [])

  // パーティクルの初期設定
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      // 7月ページの中心位置 [0, 2, -20] 周辺に配置
      const centerX = 0
      const centerY = 2
      const centerZ = -20
      
      temp.push({
        x: centerX + (Math.random() - 0.5) * 25, // ±12.5の範囲
        y: centerY + (Math.random() - 0.5) * 20, // ±10の範囲
        z: centerZ + (Math.random() - 0.5) * 15, // ±7.5の範囲
        rotationSpeed: Math.random() * 0.03 + 0.01,
        floatSpeed: Math.random() * 0.008 + 0.003,
        scale: Math.random() * 0.6 + 0.4,
        svgIndex: Math.floor(Math.random() * svgPaths.length),
        color: new THREE.Color().setHSL(
          Math.random() * 0.4 + 0.1, // 黄色〜緑系
          0.9, // 高彩度
          0.8  // 明るめ
        ),
        phase: Math.random() * Math.PI * 2
      })
    }
    return temp
  }, [count, area, svgPaths.length])

  useFrame((state) => {
    if (!groupRef.current) return

    // 全体の回転
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08

    // 各パーティクルのアニメーション
    groupRef.current.children.forEach((child, i) => {
      if (particles[i]) {
        const particle = particles[i]
        
        // 浮遊アニメーション
        child.position.y = particle.y + Math.sin(state.clock.elapsedTime * particle.floatSpeed + particle.phase) * 2
        
        // 回転アニメーション
        child.rotation.z += particle.rotationSpeed
        
        // スケールの変化（輝き効果）
        const glowScale = 1 + Math.sin(state.clock.elapsedTime * 4 + i) * 0.15
        child.scale.setScalar(particle.scale * glowScale)
      }
    })
  })

  // テクスチャが読み込まれるまで何も表示しない
  if (!isLoaded || svgTextures.length === 0) {
    console.log('Textures not ready:', { isLoaded, texturesLength: svgTextures.length })
    return null
  }

  console.log('Rendering SummerParticles with', svgTextures.length, 'textures and', particles.length, 'particles')

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh
          key={i}
          position={[particle.x, particle.y, particle.z]}
        >
          {/* SVGテクスチャを適用したプレーン */}
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial
            map={svgTextures[particle.svgIndex]}
            transparent
            opacity={0.9}
            color={particle.color}
            side={THREE.DoubleSide}
            alphaTest={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}
