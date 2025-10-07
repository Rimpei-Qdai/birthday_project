import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { createRectUV } from "../utils/threes/uv.js";

export default function ImagePlane({
  src,
  clipArea = [0, 0, 1, 1],
  border = false,
  borderColor = "white",
  borderWidth = 0.1,
  ...meshProps
}) {
  // useLoader の texture は共有される
  const texture = useLoader(TextureLoader, src);
  const [x, y, width, height] = clipArea;
  const planeWidth = texture.image.width * width * 0.01; // スケールを調整
  const planeHeight = texture.image.height * height * 0.01; // スケールを調整

  const geometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1);
    const attribute = createRectUV(x, width, y, height);
    // geometry に UV を設定
    geometry.setAttribute("uv", new THREE.BufferAttribute(attribute, 2));

    return geometry;
  }, [planeWidth, planeHeight, x, width, y, height]);

  // 枠線用のジオメトリ
  const borderGeometry = useMemo(() => {
    if (!border) return null;
    
    const borderGeom = new THREE.PlaneGeometry(
      planeWidth + borderWidth * 2, 
      planeHeight + borderWidth * 2, 
      1, 
      1
    );
    return borderGeom;
  }, [planeWidth, planeHeight, borderWidth, border]);

  return (
    <group {...meshProps}>
      {/* 枠線（背景） */}
      {border && (
        <mesh geometry={borderGeometry} position={[0, 0, -0.001]}>
          <meshBasicMaterial attach="material" color={borderColor} />
        </mesh>
      )}
      
      {/* メイン画像 */}
      <mesh geometry={geometry}>
        <meshBasicMaterial attach="material" map={texture} transparent />
      </mesh>
    </group>
  );
}