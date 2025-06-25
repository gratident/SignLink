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

const App = (): JSX.Element => {
  const handleCharPress = (char: string) => {
    console.log(`${char} ボタンが押されました`);
    // TODO: 手話アニメーション表示
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
        <Text style={styles.subtitle}>手話でつながる</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 3Dアバター表示エリア */}
        <View style={styles.avatarArea}>
          <Text style={styles.avatarPlaceholder}>🤖</Text>
          <Text style={styles.avatarTitle}>3D手話アバター</Text>
          <Text style={styles.comingSoon}>Phase 1で実装予定</Text>
        </View>

        {/* あいうえおボタン */}
        <View style={styles.buttonContainer}>
          <Text style={styles.sectionTitle}>指文字テスト（あいうえお）</Text>
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
            style={styles.functionButton}
            onPress={handleSignPress}
          >
            <Text style={styles.functionText}>👋 手話認識</Text>
          </TouchableOpacity>
        </View>

        {/* 開発ステータス */}
        <View style={styles.statusArea}>
          <Text style={styles.statusTitle}>開発状況 📊</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>✅ React Native環境構築完了</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>✅ 基本UI実装完了</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>🔄 Three.js 3Dアバター開発中</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>⏳ 音声認識機能実装予定</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>⏳ 手話認識機能実装予定</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
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
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarPlaceholder: {
    fontSize: 80,
  },
  avatarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285f4',
    marginTop: 10,
  },
  comingSoon: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  charButton: {
    backgroundColor: '#e3f2fd',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4285f4',
    shadowColor: '#4285f4',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  charText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4285f4',
  },
  functionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
  },
  functionButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusItem: {
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
