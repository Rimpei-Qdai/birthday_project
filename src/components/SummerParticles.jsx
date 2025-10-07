import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SummerParticles({ count = 20, area = 35 }) {
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
      // 7月ページの写真位置 [0, 0, -15] を中心に配置
      const centerX = 0
      const centerY = 0
      const centerZ = -15
      
      temp.push({
        x: centerX + (Math.random() - 0.5) * 5, // ±10の範囲
        y: centerY + (Math.random() - 0.5) * 10, // ±7.5の範囲
        z: centerZ + (Math.random() - 0.5) * 8,  // ±4の範囲（写真の近く）
        rotationSpeed: Math.random() * 0.02 + 0.005,
        floatSpeed: Math.random() * 0.6 + 0.4,
        scale: Math.random() * 0.6,
        svgIndex: Math.floor(Math.random() * svgPaths.length),
        color: (() => {
          const svgIndex = Math.floor(Math.random() * svgPaths.length)
          const colors = [
            new THREE.Color('#87CEEB'), // かき氷 - スカイブルー
            new THREE.Color('#FF6B6B'), // カットスイカ - 赤
            new THREE.Color('#4ECDC4'), // スイカ - ターコイズ
            new THREE.Color('#FFD93D'), // 太陽 - 黄色
            new THREE.Color('#FF8C42')  // 熱帯魚 - オレンジ
          ]
          return colors[svgIndex]
        })(),
        phase: Math.random() * Math.PI * 2,
        orbitalPhase: Math.random() * Math.PI * 2
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
        const time = state.clock.elapsedTime
        
        // 7月写真の位置 [0, 0, -15] を中心とした円形軌道
        const centerX = 5, centerY = 0, centerZ = 5
        const radius = 6 + Math.sin(time * 0.5 + particle.phase) * 2 // 半径が変化する楕円
        const angle = time * 0.3 + particle.orbitalPhase + i * 0.5
        
        // 円形軌道での移動
        child.position.x = centerX + Math.cos(angle) * radius
        child.position.z = centerZ + Math.sin(angle) * radius * 0.7 // Z軸では少し潰した楕円
        
        // Y軸は穏やかな浮遊動作
        child.position.y = centerY + particle.y * 0.3 + Math.sin(time * particle.floatSpeed + particle.phase) * 1.5
        
        // パーティクル自体の回転
        child.rotation.z += particle.rotationSpeed
        
        // 固定サイズ
        child.scale.setScalar(particle.scale)
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
    <group position={[0, 0, -15]} ref={groupRef}>
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
