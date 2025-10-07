import { OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import '../public/styles/experience.css?1005'
import Buttons from './components/Buttons'
import ImagePlane from './components/ImagePlane'
import ImageStack from './components/ImageStack'
import BackButton from './components/BackButton'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// カメラコントローラーコンポーネント
const CameraController = ({ targetPosition, targetLookAt }) => {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentPosition = useRef(new THREE.Vector3(0, 0, 7))

  useFrame((state, delta) => {
    // カメラの位置をスムーズに変更
    if (targetPosition) {
      currentPosition.current.lerp(targetPosition, 0.03)
      camera.position.copy(currentPosition.current)
    }
    
    // カメラの目線をスムーズに変更
    currentLookAt.current.lerp(targetLookAt, 0.03)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

const Experience = () => {
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0))
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 0, 7))
  const [currentScreen, setCurrentScreen] = useState('main') // main, photos, messages, jun, july, august, september
  const [showModal, setShowModal] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState('')

  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingVisible, setIsLoadingVisible] = useState(true)
  const [preloadedImages, setPreloadedImages] = useState(new Set())
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  const handleCameraMove = (dest) => {
    if (dest === "photos") {
      setCameraPosition(new THREE.Vector3(10, 0, 7))
      setCameraTarget(new THREE.Vector3(10, 0, 0))
      setCurrentScreen('photos')
    } else if (dest === "messages") {
      setCameraPosition(new THREE.Vector3(-10, 0, 7))
      setCameraTarget(new THREE.Vector3(-10, 0, 0))
      setCurrentScreen('messages')
    }else if (dest === "jun") {
      console.log("jun!!")
      setCameraPosition(new THREE.Vector3(10, 0, -8))
      setCameraTarget(new THREE.Vector3(10, 0, -15))
      setCurrentScreen('jun')
    }else if (dest === "july") {
      setCameraPosition(new THREE.Vector3(0, 0, -8))
      setCameraTarget(new THREE.Vector3(0 ,0 ,-15))
      setCurrentScreen('july')
    }else if (dest === "august") {
      setCameraPosition(new THREE.Vector3(-10, 0, -8))
      setCameraTarget(new THREE.Vector3(-10 ,0 ,-15))
      setCurrentScreen('august')
    }else if (dest === "september") {
      setCameraPosition(new THREE.Vector3(-20, 0, -8))
      setCameraTarget(new THREE.Vector3(-20 ,0 ,-15))
      setCurrentScreen('september')
    } else if (dest === "main") {
      setCameraPosition(new THREE.Vector3(0, 0, 7))
      setCameraTarget(new THREE.Vector3(0, 0, 0))
      setCurrentScreen('main')
    }
  }

  const handleBack = (destinationType) => {
    if (destinationType === "photos") {
      // 各月の写真束から月選択画面（photos）に戻る
      setCameraPosition(new THREE.Vector3(10, 0, 7))
      setCameraTarget(new THREE.Vector3(10, 0, 0))
      setCurrentScreen('photos')
    } else {
      // その他の画面からメイン画面に戻る
      setCameraPosition(new THREE.Vector3(0, 0, 7))
      setCameraTarget(new THREE.Vector3(0, 0, 0))
      setCurrentScreen('main')
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

  // モバイルデバイス検出
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileDevice || isSmallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 全ての画像パスを収集
  const allImages = [
    // June
    "/imgs/7/DSC_0772.JPG", "/imgs/7/DSC_0773.JPG", "/imgs/7/DSC_0774.JPG", "/imgs/7/DSC_0775.JPG", "/imgs/7/DSC_0776.JPG",
    // July  
    "/imgs/8/DSC_0110.JPG", "/imgs/8/DSC_0114.JPG", "/imgs/8/DSC_0118.JPG", "/imgs/8/DSC_0127.JPG", "/imgs/8/DSC_0128.JPG",
    // August
    "/imgs/8/DSC_0132.JPG", "/imgs/8/DSC_0134.JPG", "/imgs/8/DSC_0135.JPG", "/imgs/8/DSC_0137.JPG", "/imgs/8/DSC_0139.JPG",
    // September
    "/imgs/9/DSC_0255.JPG", "/imgs/9/DSC_0257.JPG", "/imgs/9/DSC_0258.JPG", "/imgs/9/DSC_0259.JPG", "/imgs/9/DSC_0261.JPG"
  ]

  // 画像プリロード関数
  const preloadImages = async (imageUrls) => {
    let loadedCount = 0
    const totalCount = imageUrls.length
    
    const promises = imageUrls.map((url, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalCount) * 100))
          setPreloadedImages(prev => new Set([...prev, url]))
          console.log(`読み込み完了: ${url} (${loadedCount}/${totalCount})`)
          resolve(url)
        }
        img.onerror = () => {
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalCount) * 100))
          console.warn(`Failed to load image: ${url}`)
          resolve(url) // エラーでも続行
        }
        img.src = url
      })
    })
    
    await Promise.all(promises)
  }

  // 全画像プリロード
  useEffect(() => {
    const loadAllImages = async () => {
      setIsLoading(true)
      
      console.log('全ての画像を読み込み開始...')
      
      // 全ての画像を事前ロード
      await preloadImages(allImages)
      
      console.log('全ての画像の読み込み完了!')
      
      // フェードアウトアニメーション開始
      setTimeout(() => {
        setIsLoadingVisible(false)
        // フェードアウト完了後にローディング状態を終了
        setTimeout(() => setIsLoading(false), 1000)
      }, 500)
    }
    
    loadAllImages()
  }, [])

  // モバイル用の設定
  const mobileSettings = {
    imageCount: isMobile ? 3 : 5, // モバイルでは画像数を減らす
    scale: isMobile ? [0.2, 0.2, 0.4] : [0.25, 0.25, 0.5],
    stackOffset: isMobile ? 0.2 : 0.3
  }

  return (
    <>
      {/* 3Dシーン - 常に背景でレンダリング */}
      <Canvas 
          className='webgl'
          performance={{ min: 0.5 }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0, 7], fov: isMobile ? 60 : 50 }}
      >
        <color args={ [0x74C2E8] }  attach="background" />
        
        {/* 霧エフェクト - 現在のエリアに応じて調整 */}
        <fog 
          attach="fog" 
          color="#74C2E8"
          near={
            currentScreen === 'main' ? 15 :
            currentScreen === 'photos' ? 15 :
            currentScreen === 'messages' ? 15 :
            15  // 各月の写真エリア - より遠くから霧を開始
          }
          far={
            currentScreen === 'main' ? 25 :
            currentScreen === 'photos' ? 25 :
            currentScreen === 'messages' ? 25 :
            25  // 各月の写真エリア - より遠くまで霧を延長
          }
        />
        
        <CameraController targetPosition={cameraPosition} targetLookAt={cameraTarget} />
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

        {currentScreen === 'main' && <Buttons text={'PHOTOS'} dest={'photos'} position={[0, 0, 0]} onCameraMove={handleCameraMove} isActive={true} />}
        {currentScreen === 'main' && <Buttons text={'MESSAGE'} dest={'messages'} position={[0, -1.2, 0]} onCameraMove={handleCameraMove} isActive={true} />}

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
          ].slice(0, mobileSettings.imageCount)}
          messages={[
            "6月の素敵な思い出です！みんなで楽しい時間を過ごしました。",
            "この日は本当に特別でした。たくさん笑って、たくさん話しました。", 
            "美味しい食事と素晴らしい仲間たち。忘れられない一日になりました。",
            "みんなの笑顔が輝いていた瞬間です。心から幸せを感じました。",
            "この写真を見るたびに、その時の楽しさが蘇ってきます。"
          ].slice(0, mobileSettings.imageCount)}
          position={[10, 2, -20]}
          scale={mobileSettings.scale}
          stackOffset={mobileSettings.stackOffset}
          onImageClick={handleImageClick}
          isActive={currentScreen === 'jun'}
        />
        
        {/* July エリア - カードスタック */}
        <ImageStack 
          images={[
            "/imgs/8/DSC_0110.JPG",
            "/imgs/8/DSC_0114.JPG", 
            "/imgs/8/DSC_0118.JPG",
            "/imgs/8/DSC_0127.JPG",
            "/imgs/8/DSC_0128.JPG"
          ].slice(0, mobileSettings.imageCount)}
          messages={[
            "7月の暑い夏の日、みんなでワイワイ楽しい時間を過ごしました！",
            "夏祭りの思い出。浴衣姿がとても素敵でした。", 
            "海辺で撮った一枚。太陽がキラキラと輝いていました。",
            "花火大会の夜。みんなの笑顔が花火より美しかったです。",
            "夏の終わりに撮った貴重な一枚。この夏は忘れられません。"
          ].slice(0, mobileSettings.imageCount)}
          position={[0, 2, -20]}
          scale={mobileSettings.scale}
          stackOffset={mobileSettings.stackOffset}
          onImageClick={handleImageClick}
          isActive={currentScreen === 'july'}
        />

        {/* August エリア - カードスタック */}
        <ImageStack 
          images={[
            "/imgs/8/DSC_0132.JPG",
            "/imgs/8/DSC_0134.JPG", 
            "/imgs/8/DSC_0135.JPG",
            "/imgs/8/DSC_0137.JPG",
            "/imgs/8/DSC_0139.JPG"
          ].slice(0, mobileSettings.imageCount)}
          messages={[
            "8月のお盆休み、家族との素晴らしい時間でした。",
            "夏の最後の思い出作り。みんなでプールに行きました！", 
            "BBQパーティーの一コマ。美味しい食べ物と楽しい仲間たち。",
            "夕日がとても美しかった日。この瞬間を永遠に覚えていたい。",
            "8月最後の週末。充実した夏の終わりを感じました。"
          ].slice(0, mobileSettings.imageCount)}
          position={[-10, 2, -20]}
          scale={mobileSettings.scale}
          stackOffset={mobileSettings.stackOffset}
          onImageClick={handleImageClick}
          isActive={currentScreen === 'august'}
        />

        {/* September エリア - カードスタック */}
        <ImageStack 
          images={[
            "/imgs/9/DSC_0255.JPG",
            "/imgs/9/DSC_0257.JPG", 
            "/imgs/9/DSC_0258.JPG",
            "/imgs/9/DSC_0259.JPG",
            "/imgs/9/DSC_0261.JPG"
          ].slice(0, mobileSettings.imageCount)}
          messages={[
            "9月の始まり、秋の訪れを感じる素敵な一日でした。",
            "涼しくなった風が心地よく、散歩が楽しかったです。", 
            "秋の味覚を楽しんだ日。みんなで美味しいものを食べました。",
            "紅葉が始まった公園で。自然の美しさに感動しました。",
            "9月の思い出がぎっしり詰まった特別な一枚です。"
          ].slice(0, mobileSettings.imageCount)}
          position={[-20, 2, -20]}
          scale={mobileSettings.scale}
          stackOffset={mobileSettings.stackOffset}
          onImageClick={handleImageClick}
          isActive={currentScreen === 'september'}
        />
        {/* フォルダページ */}
        {currentScreen === 'photos' && (
          <mesh position={[10, 0, 0]}>
              <Buttons text={'Jun.'} dest={'jun'} position={[0, 2.4, 0]} onCameraMove={handleCameraMove} isActive={true} />
              <Buttons text={'Jul.'} dest={'july'} position={[0, 1.2, 0]} onCameraMove={handleCameraMove} isActive={true} />
              <Buttons text={'Aug.'} dest={'august'} position={[0, 0, 0]} onCameraMove={handleCameraMove} isActive={true} />
              <Buttons text={'Sep.'} dest={'september'} position={[0, -1.2, 0]} onCameraMove={handleCameraMove} isActive={true} />
              
              {/* フォルダページの戻るボタン */}
              <BackButton 
                position={[0, -3.5, 0]} 
                onBack={handleBack} 
                destinationType="main"
                isActive={true}
              />
          </mesh>
        )}

        {/* 各月のページに戻るボタンを配置 */}
        {/* June エリアの戻るボタン */}
        {currentScreen === 'jun' && (
          <BackButton 
            position={[10, -1, -20]} 
            onBack={handleBack} 
            destinationType="photos"
            isActive={true}
          />
        )}
        
        {/* July エリアの戻るボタン */}
        {currentScreen === 'july' && (
          <BackButton 
            position={[0, -1, -20]} 
            onBack={handleBack} 
            destinationType="photos"
            isActive={true}
          />
        )}

        {/* August エリアの戻るボタン */}
        {currentScreen === 'august' && (
          <BackButton 
            position={[-10, -1, -20]} 
            onBack={handleBack} 
            destinationType="photos"
            isActive={true}
          />
        )}

        {/* September エリアの戻るボタン */}
        {currentScreen === 'september' && (
          <BackButton 
            position={[-20, -1, -20]} 
            onBack={handleBack} 
            destinationType="photos"
            isActive={true}
          />
        )}

        {/* メッセージページの戻るボタン */}
        {currentScreen === 'messages' && (
          <BackButton 
            position={[-10, -3, 0]} 
            onBack={handleBack} 
            destinationType="main"
            isActive={true}
          />
        )}
      </Canvas>
      
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#74C2E8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          opacity: isLoadingVisible ? 1 : 0,
          transition: 'opacity 1s ease-out',
          pointerEvents: isLoadingVisible ? 'auto' : 'none'
        }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(255,255,255,0.3)',
          borderTop: '6px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '30px',
          opacity: isLoadingVisible ? 1 : 0,
          transform: `scale(${isLoadingVisible ? 1 : 0.8})`,
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
        }}></div>
        
        <h2 style={{
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          margin: '0 0 10px 0',
          fontWeight: '600',
          opacity: isLoadingVisible ? 1 : 0,
          transform: `translateY(${isLoadingVisible ? 0 : '20px'})`,
          transition: 'opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s'
        }}>
          {loadingProgress < 100 ? '思い出を読み込んでいます...' : '準備完了！'}
        </h2>
        
        <div style={{
          width: '300px',
          height: '8px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '15px',
          opacity: isLoadingVisible ? 1 : 0,
          transform: `scaleX(${isLoadingVisible ? 1 : 0})`,
          transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            backgroundColor: loadingProgress === 100 ? '#4CAF50' : 'white',
            borderRadius: '4px',
            transition: 'width 0.3s ease, background-color 0.3s ease'
          }}></div>
        </div>
        
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          margin: '0 0 5px 0',
          opacity: isLoadingVisible ? 1 : 0,
          transform: `translateY(${isLoadingVisible ? 0 : '10px'})`,
          transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s'
        }}>
          {loadingProgress}% 完了
        </p>
        
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          margin: 0,
          textAlign: 'center',
          opacity: isLoadingVisible ? 1 : 0,
          transform: `translateY(${isLoadingVisible ? 0 : '10px'})`,
          transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s'
        }}>
          {preloadedImages.size} / {allImages.length} 枚の写真
        </p>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
      )}
      
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