import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function RainEffect({ count = 1000, area = 1, speed = 0.1 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 雨粒の初期位置と速度を生成
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * area -10,
        y: Math.random() * 10,
        z: (Math.random() - 0.5) * area - 10,
        speed: Math.random() * speed + speed * 0.5
      })
    }
    return temp
  }, [count, area, speed])

  useFrame((state) => {
    if (!meshRef.current) return

    particles.forEach((particle, i) => {
      // 雨粒を下に移動
      particle.y -= particle.speed
      
      // 地面に到達したら上に戻す
      if (particle.y < -10) {
        particle.y =  10
        particle.x = (Math.random() - 0.5) * area
        particle.z = (Math.random() - 0.5) * area
      }

      // 各雨粒の位置を設定
      dummy.position.set(particle.x, particle.y, particle.z)
      // 回転は設定しない（デフォルトで縦向き）
      dummy.rotation.set(0, 0, 0)
      // 縦長の雨粒にするためにY軸のスケールを大きくする
      dummy.scale.set(
        0.3 + Math.sin(state.clock.elapsedTime + i) * 0.1,  // X軸: 細く
        2.5 + Math.sin(state.clock.elapsedTime + i * 0.5) * 0.3,  // Y軸: 長く
        0.3 + Math.sin(state.clock.elapsedTime + i) * 0.1   // Z軸: 細く
      )
      dummy.updateMatrix()
      
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* 雨粒の形状 - 縦長のカプセル型 */}
      <capsuleGeometry args={[0.008, 0.15, 4, 8]} />
      {/* 透けた白色の材質 */}
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}