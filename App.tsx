import React, { JSX } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = (): JSX.Element => {
  // WebViewの参照
  const webViewRef = React.useRef<WebView>(null);

  const handleCharPress = (char: string) => {
    console.log(`${char} ボタンが押されました`);
    
    // WebViewに手話表示指示を送信
    const message = JSON.stringify({
      type: 'SHOW_SIGN',
      sign: char
    });
    
    webViewRef.current?.postMessage(message);
  };

  const handleVoicePress = () => {
    console.log('音声認識ボタンが押されました');
    // TODO: 音声認識開始
  };

  const handleSignPress = () => {
    console.log('手話認識ボタンが押されました');
    // TODO: 手話認識開始
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4285f4" barStyle="light-content" />
      
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>SignLink</Text>
        <Text style={styles.subtitle}>🤝 手話でつながる</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 3D手話表示エリア（WebView） */}
        <View style={styles.avatarArea}>
          <WebView
            ref={webViewRef}
            source={{ 
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        overflow: hidden;
                      }
                      #container {
                        width: 100vw;
                        height: 100vh;
                        position: relative;
                      }
                      #info {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        color: #4285f4;
                        font-weight: bold;
                        z-index: 100;
                        font-size: 14px;
                      }
                    </style>
                  </head>
                  <body>
                    <div id="container">
                      <div id="info">SignLink 3D Hand Model</div>
                    </div>

                    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
                    <script>
                      let scene, camera, renderer, handGroup;
                      let isHandModel = true; // 手形モデルフラグ

                      // 基本手形モデル作成関数
                      function createBasicHand() {
                        const group = new THREE.Group();
                    
                        // 手のひら（楕円形に近い形状）
                        const palmGeometry = new THREE.BoxGeometry(2.2, 2.8, 0.6);
                        const palmMaterial = new THREE.MeshLambertMaterial({ 
                          color: 0xFFDBC1,  // 肌色
                          transparent: true,
                          opacity: 0.95
                        });
                        const palm = new THREE.Mesh(palmGeometry, palmMaterial);
                        palm.position.set(0, 0, 0);
                        group.add(palm);
                    
                        // 指の設定（位置、サイズ、角度）
                        const fingerConfigs = [
                          { 
                              name: 'thumb', 
                              x: -1.3, y: 0.5, z: 0.3,
                              length: 1.2, radius: 0.18,
                              rotation: { x: 0, y: 0, z: 0.8 }
                          },
                          { 
                              name: 'index', 
                              x: -0.7, y: 1.6, z: 0,
                              length: 1.8, radius: 0.15,
                              rotation: { x: 0, y: 0, z: 0.1 }
                          },
                          { 
                              name: 'middle', 
                              x: -0.2, y: 1.8, z: 0,
                              length: 2.0, radius: 0.15,
                              rotation: { x: 0, y: 0, z: 0 }
                          },
                          { 
                              name: 'ring', 
                              x: 0.3, y: 1.7, z: 0,
                              length: 1.7, radius: 0.14,
                              rotation: { x: 0, y: 0, z: -0.1 }
                          },
                          { 
                              name: 'pinky', 
                              x: 0.8, y: 1.4, z: 0,
                              length: 1.3, radius: 0.12,
                              rotation: { x: 0, y: 0, z: -0.2 }
                          }
                        ];
                    
                        // 各指を作成
                        fingerConfigs.forEach((config, index) => {
                          const fingerGroup = new THREE.Group();
                        
                          // 指の基本形状（円柱）
                          const fingerGeometry = new THREE.CylinderGeometry(
                            config.radius * 0.8,  // 先端を細く
                            config.radius,        // 根元
                            config.length, 
                            8
                          );
                        
                          const fingerMaterial = new THREE.MeshLambertMaterial({ 
                            color: 0xFFDBC1,  // 肌色
                            transparent: true,
                            opacity: 0.95
                          });
                        
                          const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
                        
                          // 指の向きを調整（デフォルトのY軸方向から適切な方向に）
                          finger.position.set(0, config.length / 2, 0);
                          fingerGroup.add(finger);
                        
                          // 指の関節部分（小さな球体）
                          const jointGeometry = new THREE.SphereGeometry(config.radius * 0.9, 8, 6);
                          const jointMaterial = new THREE.MeshLambertMaterial({ 
                            color: 0xFFD4A8,  // 少し濃い肌色
                            transparent: true,
                            opacity: 0.9
                          });
                          const joint = new THREE.Mesh(jointGeometry, jointMaterial);
                          joint.position.set(0, config.length * 0.7, 0);
                          fingerGroup.add(joint);
                        
                          // 指先（小さな球体）
                          const tipGeometry = new THREE.SphereGeometry(config.radius * 0.7, 8, 6);
                          const tipMaterial = new THREE.MeshLambertMaterial({ 
                            color: 0xFFCBA8,  // 指先の色
                            transparent: true,
                            opacity: 0.95
                          });
                          const tip = new THREE.Mesh(tipGeometry, tipMaterial);
                          tip.position.set(0, config.length, 0);
                          fingerGroup.add(tip);
                        
                          // 指グループの位置と回転を設定
                          fingerGroup.position.set(config.x, config.y, config.z);
                          fingerGroup.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
                        
                          // 指に名前を付けて識別しやすくする
                          fingerGroup.name = config.name;
                        
                          group.add(fingerGroup);
                        });
                        return group;
                      }

                      function init() {
                        try {
                          scene = new THREE.Scene();
                          scene.background = new THREE.Color(0xf0f4f8);

                          camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                          camera.position.set(0, 2, 6);  // 手形がよく見える位置
                          camera.lookAt(0, 0, 0);

                          renderer = new THREE.WebGLRenderer({ antialias: true });
                          renderer.setSize(window.innerWidth, window.innerHeight);
                          renderer.shadowMap.enabled = true;
                          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                          document.getElementById('container').appendChild(renderer.domElement);

                          // ライト設定（手形がよく見えるように）
                          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                          scene.add(ambientLight);

                          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
                          directionalLight.position.set(10, 15, 10);
                          directionalLight.castShadow = true;
                          directionalLight.shadow.mapSize.width = 2048;
                          directionalLight.shadow.mapSize.height = 2048;
                          scene.add(directionalLight);

                          // 補助ライト（影を和らげる）
                          const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
                          fillLight.position.set(-10, 5, 5);
                          scene.add(fillLight);

                          // 手形モデルを作成
                          handGroup = createBasicHand();
                          handGroup.castShadow = true;
                          handGroup.receiveShadow = true;
                          scene.add(handGroup);

                          // 地面（影を受ける）
                          const planeGeometry = new THREE.PlaneGeometry(15, 15);
                          const planeMaterial = new THREE.MeshLambertMaterial({ 
                            color: 0xffffff,
                            transparent: true,
                            opacity: 0.8
                          });
                          const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                          plane.rotation.x = -Math.PI / 2;
                          plane.position.y = -3;
                          plane.receiveShadow = true;
                          scene.add(plane);

                          animate();
                        
                          // 成功メッセージを送信
                          window.ReactNativeWebView?.postMessage(JSON.stringify({
                            type: 'READY',
                            message: '3D手形モデル準備完了'
                          }));
                        } catch (error) {
                          console.error('Three.js初期化エラー:', error);
                          document.getElementById('info').innerHTML = 'Three.js読み込みエラー';
                        }
                      }

                      function animate() {
                        if (!handGroup) return;
                        requestAnimationFrame(animate);

                        // 手形をゆっくり回転（手話が見やすいように）
                        handGroup.rotation.y += 0.005;

                        renderer.render(scene, camera);
                      }

                      function showSign(signType) {
                        if (!handGroup) return;
                    
                          console.log('手話表示:', signType);

                          // 手のひらと指を取得
                          const palm = handGroup.children[0];
                          const fingers = handGroup.children.slice(1); // [thumb, index, middle, ring, pinky]

                          // アニメーション用の目標位置・回転を設定
                          const targetRotations = [];
                          const targetPositions = [];

                          // デフォルト位置
                          const defaultConfigs = [
                            { // 親指
                              rotation:{x:0, y:0, z:0.8},
                              position:{x:-1.3, y:0.5, z:0.3}
                            },
                            { // 人差し指
                              rotation:{x:0, y:0, z:0.1},
                              position:{x:-0.7, y:1.6, z:0}
                            },
                            { // 中指
                              rotation:{x:0, y:0, z:0},
                              position:{x:-0.2, y:1.8, z:0}
                            },
                            { // 薬指
                              rotation:{x:0, y:0, z:-0.1},
                              position:{x:0.3, y:1.7, z:0}
                            },
                            { // 小指
                              rotation:{x:0, y:0, z:-0.2},
                              position:{x:0.8, y:1.4, z:0}
                            },
                          ]
                    
                          switch(signType) {
                          case 'あ':
                            // 指文字「あ」: 親指を立て、他の指を握る
                            targetRotations[0] = { x: 0.3, y: 0.5, z: 1.2 };    // 親指：立てる
                            targetRotations[1] = { x: -1.8, y: 0, z: 0.1 };     // 人差し指：握る
                            targetRotations[2] = { x: -1.8, y: 0, z: 0 };       // 中指：握る
                            targetRotations[3] = { x: -1.8, y: 0, z: -0.1 };    // 薬指：握る
                            targetRotations[4] = { x: -1.8, y: 0, z: -0.2 };    // 小指：握る
                            
                            targetPositions[0] = { x: -1.0, y: 1.2, z: 0.8 };   // 親指：前に出す
                            targetPositions[1] = { x: -0.7, y: 0.8, z: 0 };     // 人差し指：下げる
                            targetPositions[2] = { x: -0.2, y: 0.9, z: 0 };     // 中指：下げる
                            targetPositions[3] = { x: 0.3, y: 0.8, z: 0 };      // 薬指：下げる
                            targetPositions[4] = { x: 0.8, y: 0.7, z: 0 };      // 小指：下げる
                            
                            // 指の色を変更（視覚的フィードバック）
                            setFingerColors([0xff6b6b, 0xcccccc, 0xcccccc, 0xcccccc, 0xcccccc]);
                            break;
            
                          case 'い':
                            // 指文字「い」: 人差し指を立て、他を握る
                            targetRotations[0] = { x: -1.5, y: 0, z: 0.8 };     // 親指：握る
                            targetRotations[1] = { x: 0.2, y: 0, z: 0.1 };      // 人差し指：立てる
                            targetRotations[2] = { x: -1.8, y: 0, z: 0 };       // 中指：握る
                            targetRotations[3] = { x: -1.8, y: 0, z: -0.1 };    // 薬指：握る
                            targetRotations[4] = { x: -1.8, y: 0, z: -0.2 };    // 小指：握る
                            
                            targetPositions[0] = { x: -1.3, y: 0.3, z: 0.3 };   // 親指：握る位置
                            targetPositions[1] = { x: -0.7, y: 1.8, z: 0 };     // 人差し指：立てる
                            targetPositions[2] = { x: -0.2, y: 0.9, z: 0 };     // 中指：下げる
                            targetPositions[3] = { x: 0.3, y: 0.8, z: 0 };      // 薬指：下げる
                            targetPositions[4] = { x: 0.8, y: 0.7, z: 0 };      // 小指：下げる
                            
                            setFingerColors([0xcccccc, 0x4ecdc4, 0xcccccc, 0xcccccc, 0xcccccc]);
                            break;
            
                          case 'う':
                            // 指文字「う」: 人差し指・中指を立てる
                            targetRotations[0] = { x: -1.5, y: 0, z: 0.8 };     // 親指：握る
                            targetRotations[1] = { x: 0.2, y: 0, z: 0.1 };      // 人差し指：立てる
                            targetRotations[2] = { x: 0.2, y: 0, z: 0 };        // 中指：立てる
                            targetRotations[3] = { x: -1.8, y: 0, z: -0.1 };    // 薬指：握る
                            targetRotations[4] = { x: -1.8, y: 0, z: -0.2 };    // 小指：握る
                            
                            targetPositions[0] = { x: -1.3, y: 0.3, z: 0.3 };   // 親指：握る
                            targetPositions[1] = { x: -0.7, y: 1.8, z: 0 };     // 人差し指：立てる
                            targetPositions[2] = { x: -0.2, y: 2.0, z: 0 };     // 中指：立てる
                            targetPositions[3] = { x: 0.3, y: 0.8, z: 0 };      // 薬指：下げる
                            targetPositions[4] = { x: 0.8, y: 0.7, z: 0 };      // 小指：下げる
                            
                            setFingerColors([0xcccccc, 0x45b7d1, 0x45b7d1, 0xcccccc, 0xcccccc]);
                            break;
            
                          case 'え':
                            // 指文字「え」: 人差し指・中指・薬指を立てる
                            targetRotations[0] = { x: -1.5, y: 0, z: 0.8 };     // 親指：握る
                            targetRotations[1] = { x: 0.2, y: 0, z: 0.1 };      // 人差し指：立てる
                            targetRotations[2] = { x: 0.2, y: 0, z: 0 };        // 中指：立てる
                            targetRotations[3] = { x: 0.2, y: 0, z: -0.1 };     // 薬指：立てる
                            targetRotations[4] = { x: -1.8, y: 0, z: -0.2 };    // 小指：握る
                            
                            targetPositions[0] = { x: -1.3, y: 0.3, z: 0.3 };   // 親指：握る
                            targetPositions[1] = { x: -0.7, y: 1.8, z: 0 };     // 人差し指：立てる
                            targetPositions[2] = { x: -0.2, y: 2.0, z: 0 };     // 中指：立てる
                            targetPositions[3] = { x: 0.3, y: 1.9, z: 0 };      // 薬指：立てる
                            targetPositions[4] = { x: 0.8, y: 0.7, z: 0 };      // 小指：下げる
                            
                            setFingerColors([0xcccccc, 0xf7dc6f, 0xf7dc6f, 0xf7dc6f, 0xcccccc]);
                            break;
            
                          case 'お':
                            // 指文字「お」: 4本指を立て、親指を握る
                            targetRotations[0] = { x: -1.5, y: 0, z: 0.8 };     // 親指：握る
                            targetRotations[1] = { x: 0.2, y: 0, z: 0.1 };      // 人差し指：立てる
                            targetRotations[2] = { x: 0.2, y: 0, z: 0 };        // 中指：立てる
                            targetRotations[3] = { x: 0.2, y: 0, z: -0.1 };     // 薬指：立てる
                            targetRotations[4] = { x: 0.2, y: 0, z: -0.2 };     // 小指：立てる
                            
                            targetPositions[0] = { x: -1.3, y: 0.3, z: 0.3 };   // 親指：握る
                            targetPositions[1] = { x: -0.7, y: 1.8, z: 0 };     // 人差し指：立てる
                            targetPositions[2] = { x: -0.2, y: 2.0, z: 0 };     // 中指：立てる
                            targetPositions[3] = { x: 0.3, y: 1.9, z: 0 };      // 薬指：立てる
                            targetPositions[4] = { x: 0.8, y: 1.6, z: 0 };      // 小指：立てる
                            
                            setFingerColors([0xcccccc, 0xbb8fce, 0xbb8fce, 0xbb8fce, 0xbb8fce]);
                            break;
            
                          default:
                            // デフォルト（開いた手）
                            for (let i = 0; i < 5; i++) {
                              targetRotations[i] = defaultConfigs[i].rotation;
                              targetPositions[i] = defaultConfigs[i].position;
                            }
                            setFingerColors([0xFFDBC1, 0xFFDBC1, 0xFFDBC1, 0xFFDBC1, 0xFFDBC1]);
                        }

                        // スムーズなアニメーション実行
                        animateFingers(targetRotations, targetPositions);
                    
                        // React Nativeに結果を送信
                        window.ReactNativeWebView?.postMessage(JSON.stringify({
                          type: 'SIGN_CHANGED',
                          sign: signType,
                          model: 'hand',
                          description: getSignDescription(signType)
                        }));
                      }
                      
                      // 指の色を設定する関数
                      function setFingerColors(colors) {
                          if (!handGroup) return;
                          
                          const fingers = handGroup.children.slice(1);
                          fingers.forEach((finger, index) => {
                              finger.children.forEach(part => {
                                  if (part.material) {
                                      part.material.color.setHex(colors[index] || 0xFFDBC1);
                                  }
                              });
                          });
                      }
                      
                      // 指のアニメーション関数
                      function animateFingers(targetRotations, targetPositions) {
                          if (!handGroup) return;
                          
                          const fingers = handGroup.children.slice(1);
                          const animationDuration = 1000; // 1秒間のアニメーション
                          const startTime = Date.now();
                          
                          // 現在の位置・回転を記録
                          const initialRotations = fingers.map(finger => ({
                              x: finger.rotation.x,
                              y: finger.rotation.y, 
                              z: finger.rotation.z
                          }));
                          
                          const initialPositions = fingers.map(finger => ({
                              x: finger.position.x,
                              y: finger.position.y,
                              z: finger.position.z
                          }));
                          
                          function animate() {
                              const elapsed = Date.now() - startTime;
                              const progress = Math.min(elapsed / animationDuration, 1);
                              
                              // イージング関数（スムーズな動き）
                              const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                              const easedProgress = easeInOut(progress);
                              
                              // 各指をアニメーション
                              fingers.forEach((finger, index) => {
                                  if (targetRotations[index]) {
                                      // 回転の補間
                                      finger.rotation.x = initialRotations[index].x + 
                                          (targetRotations[index].x - initialRotations[index].x) * easedProgress;
                                      finger.rotation.y = initialRotations[index].y + 
                                          (targetRotations[index].y - initialRotations[index].y) * easedProgress;
                                      finger.rotation.z = initialRotations[index].z + 
                                          (targetRotations[index].z - initialRotations[index].z) * easedProgress;
                                  }
                                  
                                  if (targetPositions[index]) {
                                      // 位置の補間
                                      finger.position.x = initialPositions[index].x + 
                                          (targetPositions[index].x - initialPositions[index].x) * easedProgress;
                                      finger.position.y = initialPositions[index].y + 
                                          (targetPositions[index].y - initialPositions[index].y) * easedProgress;
                                      finger.position.z = initialPositions[index].z + 
                                          (targetPositions[index].z - initialPositions[index].z) * easedProgress;
                                  }
                              });
                              
                              // アニメーション継続判定
                              if (progress < 1) {
                                  requestAnimationFrame(animate);
                              }
                          }
                          
                          animate();
                      }

                      // 手話の説明を取得
                      function getSignDescription(signType) {
                          const descriptions = {
                              'あ': '親指を立て、他の指を握る',
                              'い': '人差し指を立て、他の指を握る', 
                              'う': '人差し指と中指を立てる',
                              'え': '人差し指、中指、薬指を立てる',
                              'お': '4本指を立て、親指を握る'
                          };
                          return descriptions[signType] || '開いた手';
                      }

                      window.addEventListener('resize', () => {
                        if (!camera || !renderer) return;
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight);
                      });

                      // React Nativeからのメッセージ受信
                      window.addEventListener('message', (event) => {
                        try {
                          const data = JSON.parse(event.data);
                          if (data.type === 'SHOW_SIGN') {
                            showSign(data.sign);
                          }
                        } catch (error) {
                          console.error('メッセージ解析エラー:', error);
                        }
                      });

                      // Three.jsが読み込まれてから初期化
                      if (typeof THREE !== 'undefined') {
                        init();
                      } else {
                        document.getElementById('info').innerHTML = 'Three.js読み込み中...';
                        setTimeout(() => {
                          if (typeof THREE !== 'undefined') {
                              init();
                          } else {
                              document.getElementById('info').innerHTML = 'Three.js読み込み失敗';
                          }
                        }, 2000);
                      }
                    </script>
                  </body>
                </html>
              `
            }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log('WebViewメッセージ:', data);
              } catch (error) {
                console.log('WebViewメッセージ（生）:', event.nativeEvent.data);
              }
            }}
            onError={(error) => {
              console.log('WebViewエラー:', error);
            }}
            onLoad={() => {
              console.log('WebView読み込み完了');
            }}
          />
          <Text style={styles.avatarTitle}>3D手形モデル（基本版）</Text>
        </View>

        {/* あいうえおボタン */}
        <View style={styles.buttonContainer}>
          <Text style={styles.sectionTitle}>📝 指文字テスト（あいうえお）</Text>
            <View style={styles.buttonRow}>
              {['あ', 'い', 'う', 'え', 'お'].map((char) => (
                <TouchableOpacity
                  key={char}
                  style={styles.charButton}
                  onPress={() => handleCharPress(char)}
                >
                  <Text style={styles.charText}>{char}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.instruction}>
              ↑ ボタンをタップすると3D表示の色が変わります
            </Text>
        </View>

        {/* 機能ボタン */}
        <View style={styles.functionButtons}>
          <TouchableOpacity 
            style={styles.functionButton}
            onPress={handleVoicePress}
          >
            <Text style={styles.functionText}>🎤 音声認識</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.functionButton, styles.functionButtonSecondary]}
            onPress={handleSignPress}
          >
            <Text style={styles.functionText}>👋 手話認識</Text>
          </TouchableOpacity>
        </View>

        {/* 開発ステータス */}
        <View style={styles.statusArea}>
          <Text style={styles.statusTitle}>🚀 開発状況</Text>
            <View style={styles.statusItem}>
              <Text style={styles.statusTextCompleted}>✅ React Native環境構築完了</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusTextCompleted}>✅ SignLink基本UI実装完了</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusTextInProgress}>🔄 Three.js 3D表示統合中</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusTextPending}>⏳ 手形モデル作成予定</Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4285f4',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  avatarArea: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  webview: {
    height: 250,
    backgroundColor: 'transparent',
  },
  avatarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
    textAlign: 'center',
    padding: 15,
  },
  buttonContainer: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  charButton: {
    backgroundColor: '#e3f2fd',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4285f4',
    shadowColor: '#4285f4',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  charText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285f4',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  functionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
  },
  functionButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 35,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  functionButtonSecondary: {
    backgroundColor: '#34a853',
  },
  functionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusArea: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4285f4',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusItem: {
    marginBottom: 10,
  },
  statusTextCompleted: {
    fontSize: 16,
    color: '#34a853',
    fontWeight: '500',
  },
  statusTextInProgress: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: '500',
  },
  statusTextPending: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default App;
