import { OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import '../public/styles/experience.css?1005'
import Buttons from './components/Buttons'
import ImagePlane from './components/ImagePlane'
import ImageStack from './components/ImageStack'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// カメラコントローラーコンポーネント
const CameraController = ({ targetPosition, targetLookAt }) => {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    // カメラの目線をスムーズに変更
    currentLookAt.current.lerp(targetLookAt, 0.03)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

const Experience = () => {
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0))
  const [showModal, setShowModal] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState('')
  
  const handleCameraMove = (dest) => {
    if (dest === "photos") {
      setCameraTarget(new THREE.Vector3(10, 0, 0))
    } else if (dest === "messages") {
      setCameraTarget(new THREE.Vector3(-10, 0, 0))
    }else if (dest === "jun") {
      console.log("jun!!")
      setCameraTarget(new THREE.Vector3(10, 0, -15))
    }else if (dest === "july") {
      setCameraTarget(new THREE.Vector3(0 ,0 ,-15))
    }else if (dest === "august") {
      setCameraTarget(new THREE.Vector3(-10 ,0 ,-15))
    }else if (dest === "september") {
      setCameraTarget(new THREE.Vector3(10 ,0 ,-25))
    }
  }

  // モーダル表示関数
  const handleImageClick = (image, message) => {
    console.log('Experience.jsx - Modal開くよ:', image, message)
    setSelectedImage(image)
    setSelectedMessage(message)
    setShowModal(true)
    // 少し遅延してフェードイン開始
    setTimeout(() => setIsModalVisible(true), 10)
  }

  // モーダル閉じる関数
  const closeModal = () => {
    setIsModalVisible(false)
    // フェードアウト完了後にモーダルを非表示
    setTimeout(() => {
      setShowModal(false)
      setSelectedImage(null)
      setSelectedMessage('')
    }, 300) // transition duration と合わせる
  }

  // Escape キーでモーダルを閉じる
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal()
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEscapeKey)
      // ボディのスクロールを無効化
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  return (
    <>
      <Canvas 
          className='webgl'
      >
        <color args={ [0x74C2E8] }  attach="background" />
        <CameraController targetLookAt={cameraTarget} />
        {/* <OrbitControls /> */}
        
        <Text
        position={[ 0, 3, 0 ]}
        fontWeight={600}
        fontSize={0.8}
        >
            Happy
        </Text>
        <Text
        position={[0, 1.9, 0]}
        fontWeight={600}
        fontSize={0.8}
        >
            Birthday!
        </Text>

        <Buttons text={'PHOTOS'} dest={'photos'} position={[0, 0, 0]} onCameraMove={handleCameraMove} />
        <Buttons text={'MESSAGE'} dest={'messages'} position={[0, -1.2, 0]} onCameraMove={handleCameraMove} />

        <Text position={[-10 ,0 ,0]}>
            Test
        </Text>
        
        {/* June エリア - カードスタック */}
        <ImageStack 
          images={[
            "/imgs/7/DSC_0772.JPG",
            "/imgs/7/DSC_0773.JPG", 
            "/imgs/7/DSC_0774.JPG",
            "/imgs/7/DSC_0775.JPG",
            "/imgs/7/DSC_0776.JPG"
          ]}
          messages={[
            "6月の素敵な思い出です！みんなで楽しい時間を過ごしました。",
            "この日は本当に特別でした。たくさん笑って、たくさん話しました。", 
            "美味しい食事と素晴らしい仲間たち。忘れられない一日になりました。",
            "みんなの笑顔が輝いていた瞬間です。心から幸せを感じました。",
            "この写真を見るたびに、その時の楽しさが蘇ってきます。"
          ]}
          position={[10, 2, -20]}
          scale={[0.25, 0.25, 0.5]}
          stackOffset={0.3}
          rotationOffset={3}
          onImageClick={handleImageClick}
        />
        
        <Text position={[0 ,0 ,-15]}>
            july
        </Text>
        <Text position={[-10 ,0 ,-15]}>
            august
        </Text>
        <Text position={[10 ,0 ,-25]}>
            september
        </Text>
        {/* フォルダページ */}
        <mesh position={[10, 0, 0]}>
            <Buttons text={'Jun.'} dest={'jun'} position={[0, 2.4, 0]} onCameraMove={handleCameraMove} />
            <Buttons text={'Jul.'} dest={'july'} position={[0, 1.2, 0]} onCameraMove={handleCameraMove} />
            <Buttons text={'Aug.'} dest={'august'} position={[0, 0, 0]} onCameraMove={handleCameraMove} />
            <Buttons text={'Sep.'} dest={'september'} position={[0, -1.2, 0]} onCameraMove={handleCameraMove} />
        </mesh>
      </Canvas>
      
      {/* モーダル - Canvas の外側に配置 */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: `rgba(0, 0, 0, ${isModalVisible ? 0.8 : 0})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            pointerEvents: 'auto',
            transition: 'background-color 0.3s ease-in-out'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '80vw',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              opacity: isModalVisible ? 1 : 0,
              transform: `scale(${isModalVisible ? 1 : 0.8}) translateY(${isModalVisible ? 0 : '20px'})`,
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Selected" 
              style={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                marginBottom: '20px',
                borderRadius: '8px',
                opacity: isModalVisible ? 1 : 0,
                transform: `translateY(${isModalVisible ? 0 : '10px'})`,
                transition: 'opacity 0.4s ease-in-out 0.1s, transform 0.4s ease-in-out 0.1s'
              }}
            />
            <p style={{
              fontSize: '18px',
              textAlign: 'center',
              margin: '10px 0',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
              opacity: isModalVisible ? 1 : 0,
              transform: `translateY(${isModalVisible ? 0 : '10px'})`,
              transition: 'opacity 0.4s ease-in-out 0.2s, transform 0.4s ease-in-out 0.2s'
            }}>
              {selectedMessage}
            </p>
            <button 
              onClick={closeModal}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '15px',
                opacity: isModalVisible ? 1 : 0,
                transform: `translateY(${isModalVisible ? 0 : '10px'})`,
                transition: 'background-color 0.3s, opacity 0.4s ease-in-out 0.3s, transform 0.4s ease-in-out 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Experience