import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FallingLeavesEffect = ({ 
  count = 100,
  area = 1,
  fallSpeed = 0.1,
  swayAmount = 0.5,
  position = [-20, 0, -15]
}) => {
  const meshRefsRef = useRef([]);
  const leafDataRef = useRef([]);

  // 葉っぱの形状を作成（カエデの葉風）
  const createLeafGeometry = () => {
    const shape = new THREE.Shape();
    
    // モミジ風の葉っぱの形
    shape.moveTo(0, 0.5);
    shape.quadraticCurveTo(-0.2, 0.3, -0.3, 0.1);
    shape.quadraticCurveTo(-0.4, 0, -0.2, -0.1);
    shape.quadraticCurveTo(-0.1, -0.2, 0, -0.3);
    shape.quadraticCurveTo(0.1, -0.2, 0.2, -0.1);
    shape.quadraticCurveTo(0.4, 0, 0.3, 0.1);
    shape.quadraticCurveTo(0.2, 0.3, 0, 0.5);

    return new THREE.ShapeGeometry(shape);
  };

  // 葉っぱのデータと位置を初期化
  const { geometry, leafData } = useMemo(() => {
    const geo = createLeafGeometry();
    const data = [];
    
    for (let i = 0; i < count; i++) {
      const startX = (Math.random() - 0.5) * area + 10;
      const startY =  Math.random() * 10; // 上空からスタート
      const startZ = (Math.random() - 0.5) * area - 10;
      
      data.push({
        // 初期位置
        startX: startX,
        startY: startY,
        startZ: startZ,
        
        // 現在位置（初期位置と同じに設定）
        x: startX,
        y: startY, 
        z: startZ,
        
        // 動きのパラメータ
        fallSpeed: fallSpeed * (0.7 + Math.random() * 0.6),
        swaySpeed: 0.3 + Math.random() * 0.8,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        
        // 見た目のパラメータ
        size: 0.1 + Math.random() * 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotationAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5, 
          Math.random() - 0.5
        ).normalize(),
        
        // 色のバリエーション（秋の葉の色）
        colorIndex: Math.floor(Math.random() * 16),
        time: Math.random() * 100 // アニメーションの位相をずらす
      });
    }
    
    leafDataRef.current = data;
    return { geometry: geo, leafData: data };
  }, [count, area, fallSpeed]);

  // 葉っぱの色配列（豊富な秋の色）
  const leafColors = useMemo(() => [
    new THREE.Color('#FFD700'), // ゴールド（明るい黄色）
    new THREE.Color('#FFA500'), // オレンジ
    new THREE.Color('#FF8C00'), // ダークオレンジ  
    new THREE.Color('#B22222'), // ファイアブリック（暗い赤）
    new THREE.Color('#8B4513'), // サドルブラウン（茶色）
    new THREE.Color('#A0522D'), // シエナ（赤茶）
    new THREE.Color('#654321'), // ダークブラウン（濃い茶色）
    new THREE.Color('#5D4037'), // ブラウン（さらに暗い茶色）
    new THREE.Color('#FFFF99'), // ライトイエロー（薄い黄色）
    new THREE.Color('#DAA520'), // ゴールデンロッド
    new THREE.Color('#B8860B'), // ダークゴールデンロッド
    new THREE.Color('#CD853F'), // ペルー（ベージュ系）
    new THREE.Color('#D2691E'), // チョコレート
    new THREE.Color('#8B0000')  // ダークレッド（非常に暗い赤）
  ], []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // 全ての葉っぱの位置を更新
    leafDataRef.current.forEach((leaf, index) => {
      // 時間の進行
      leaf.time += 0.016; // ~60fps
      
      // 落下運動
      leaf.y -= leaf.fallSpeed;
      
      // 左右の揺れ（風の効果）
      leaf.x = leaf.startX + Math.sin(leaf.time * leaf.swaySpeed) * swayAmount;
      leaf.z = leaf.startZ + Math.cos(leaf.time * leaf.swaySpeed * 0.7) * swayAmount * 0.5;
      
      // 回転
      leaf.rotation += leaf.rotationSpeed;
      
      // 葉っぱが地面に落ちたらリセット
      if (leaf.y < -20) {
        leaf.y = 10; // 上空に戻す
        leaf.startX = (Math.random() - 0.5) * area;
        leaf.startZ = (Math.random() - 0.5) * area;
        leaf.x = leaf.startX; // 現在位置もリセット
        leaf.z = leaf.startZ; // 現在位置もリセット
        leaf.time = Math.random() * 20; // ランダムな時間でスタート
        leaf.rotation = Math.random() * Math.PI * 2; // 回転もリセット
      }
    });
    
    // 各色のインスタンスメッシュを更新
    meshRefsRef.current.forEach((meshRef, colorIndex) => {
      if (meshRef) {
        const colorLeaves = leafDataRef.current.filter(leaf => leaf.colorIndex === colorIndex);
        
        colorLeaves.forEach((leaf, leafIndex) => {
          const matrix = new THREE.Matrix4();
          matrix.compose(
            new THREE.Vector3(leaf.x, leaf.y, leaf.z),
            new THREE.Quaternion().setFromAxisAngle(leaf.rotationAxis, leaf.rotation),
            new THREE.Vector3(leaf.size, leaf.size, 1)
          );
          meshRef.setMatrixAt(leafIndex, matrix);
        });
        
        meshRef.instanceMatrix.needsUpdate = true;
      }
    });
  });

  return (
    <group position={position}>
      {/* 各色の葉っぱを個別に作成 */}
      {leafColors.map((color, colorIndex) => (
        <instancedMesh 
          key={colorIndex}
          ref={(ref) => {
            meshRefsRef.current[colorIndex] = ref;
            if (ref && leafDataRef.current) {
              // 初期位置設定
              const colorLeaves = leafDataRef.current.filter(leaf => leaf.colorIndex === colorIndex);
              
              colorLeaves.forEach((leaf, leafIndex) => {
                const matrix = new THREE.Matrix4();
                matrix.compose(
                  new THREE.Vector3(leaf.x, leaf.y, leaf.z),
                  new THREE.Quaternion().setFromAxisAngle(leaf.rotationAxis, leaf.rotation || 0),
                  new THREE.Vector3(leaf.size, leaf.size, 1)
                );
                ref.setMatrixAt(leafIndex, matrix);
              });
              ref.instanceMatrix.needsUpdate = true;
            }
          }}
          args={[geometry, null, Math.ceil(count / leafColors.length) + 2]}
        >
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </instancedMesh>
      ))}
      
      {/* 背景の秋の光 */}
      <group>
        {Array.from({ length: 15 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * area * 0.8,
              Math.random() * 12,
              (Math.random() - 0.5) * area * 0.8
            ]}
          >
            <sphereGeometry args={[0.015 + Math.random() * 0.04, 8, 8]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(0.06 + Math.random() * 0.15, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.4)}
              transparent
              opacity={0.4 + Math.random() * 0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default FallingLeavesEffect;