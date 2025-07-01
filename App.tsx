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
            // iOSの場合はローカルファイルではなく、インラインHTMLを使用
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
                  <div id="info">SignLink 3D Display</div>
                </div>

                <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
                <script>
                  let scene, camera, renderer, cube;
                  function init() {
                    try {
                      scene = new THREE.Scene();
                      scene.background = new THREE.Color(0xf0f0f0);

                      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                      camera.position.z = 5;

                      renderer = new THREE.WebGLRenderer({ antialias: true });
                      renderer.setSize(window.innerWidth, window.innerHeight);
                      document.getElementById('container').appendChild(renderer.domElement);

                      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                      scene.add(ambientLight);

                      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                      directionalLight.position.set(10, 10, 5);
                      scene.add(directionalLight);

                      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
                      const material = new THREE.MeshLambertMaterial({ 
                        color: 0x4285f4,
                        transparent: true,
                        opacity: 0.8
                      });
                      cube = new THREE.Mesh(geometry, material);
                      scene.add(cube);

                      animate();

                      // 成功メッセージを送信
                      window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'READY',
                        message: '3D表示準備完了'
                      }));
                    } catch (error) {
                      console.error('Three.js初期化エラー:', error);
                      document.getElementById('info').innerHTML = 'Three.js読み込みエラー';
                    }
                  }

                  function animate() {
                    if (!cube) return;
                    requestAnimationFrame(animate);

                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;

                    renderer.render(scene, camera);
                  }

                  function showSign(signType) {
                    if (!cube) return;
                    console.log('手話表示:', signType);

                    switch(signType) {
                      case 'あ':
                        cube.material.color.setHex(0xff4444);
                        break;
                      case 'い':
                        cube.material.color.setHex(0x44ff44);
                        break;
                      case 'う':
                        cube.material.color.setHex(0x4444ff);
                        break;
                      case 'え':
                        cube.material.color.setHex(0xffff44);
                        break;
                      case 'お':
                        cube.material.color.setHex(0xff44ff);
                        break;
                      default:
                        cube.material.color.setHex(0x4285f4);
                    }

                    // React Nativeに結果を送信
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                      type: 'SIGN_CHANGED',
                      sign: signType
                    }));
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
            </html>`
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
        <Text style={styles.avatarTitle}>3D手話アバター（開発中）</Text>
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
