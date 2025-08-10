# 🎮 Somnia Pong - Blockchain Gaming

A revolutionary multiplayer Pong game with blockchain integration, built on the Somnia Testnet. Experience the future of gaming where every match result is recorded on-chain!

## 🌟 Features

### 🎯 Core Gameplay
- **Classic Pong Experience** - Smooth paddle controls and realistic physics
- **100-Second Timer** - Fast-paced matches with countdown display
- **First to 5 Points** - Quick, exciting gameplay sessions
- **Real-time Multiplayer** - WebRTC-based peer-to-peer connection

### 🔗 Blockchain Integration
- **Somnia Testnet** - Built on Chain ID 50312
- **Smart Contract** - Match results stored on-chain at `0x4e7890BfCaab0A4474e627794D4912979B4D92Ba`
- **Entry Fees** - 0.001 STT per match
- **Winner Payouts** - Automatic prize distribution to winners
- **Fake Wallet** - Demo mode with address `0xa5ED32a4728651D60D720D72c02a79F7f6F12BBF`

### 🎨 Creative UI/UX
- **Animated Gradients** - Dynamic background with color shifts
- **Glassmorphic Design** - Modern semi-transparent elements
- **Orbitron Font** - Futuristic gaming typography
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Works on all devices

### 🔊 Immersive Audio
- **Background Music** - 8-bit retro gaming soundtrack
- **Sound Effects** - Paddle hits, scoring, game over sounds
- **Auto-play** - Continuous music without permission prompts
- **Volume Control** - Optimized audio levels

### 🎮 Game Features
- **Wallet Toggle** - Connect/disconnect with one click
- **Match Codes** - Custom game identifiers
- **Real-time Status** - Live updates and transaction confirmations
- **Game Over Screen** - Winner announcement and blockchain submission

## 🚀 Quick Start

### Play Online
Visit: **https://krishmatrix.github.io/netplayjs-demo/somnia-pong/**

### Local Development
```bash
# Clone the repository
git clone https://github.com/KrishMatrix/netplayjs-demo.git
cd netplayjs-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 How to Play

1. **Connect Wallet** - Click "Connect Wallet" to start
2. **Enter Match Code** - Use any code (e.g., "ABC123")
3. **Join Match** - Click "Join Match" to enter the game
4. **Play Pong** - Use arrow keys or mouse to control paddles
5. **Win or Lose** - First to 5 points or 100 seconds wins
6. **Blockchain Result** - Match automatically submitted to Somnia Testnet

## 🔧 Technical Stack

- **Frontend**: TypeScript, HTML5 Canvas, WebRTC
- **Blockchain**: Somnia Testnet (Chain ID 50312)
- **Smart Contract**: Solidity (Ethereum-compatible)
- **Audio**: Web Audio API, HTML5 Audio
- **Styling**: CSS3 with animations and gradients
- **Build Tool**: Webpack

## 📋 Smart Contract Functions

```solidity
// Join a match with entry fee
function joinMatch(bytes32 matchId) external payable

// Report match results
function reportMatch(bytes32 matchId, address winner, uint8 scoreA, uint8 scoreB) external

// Get match details
function getMatch(bytes32 matchId) external view returns (Match memory)

// Get entry fee amount
function entryFee() external view returns (uint256)
```

## 🎵 Audio Features

- **Background Music**: `game-music-player-console-8bit-background-intro-theme-297305.mp3`
- **Auto-play**: Starts automatically without user permission
- **Loop**: Continuous playback throughout the game
- **Volume**: Optimized at 20% for pleasant background audio
- **Fallback**: Manual play button if autoplay blocked

## 🌐 Network Configuration

- **Chain ID**: 50312 (0xC4B8)
- **RPC URL**: https://dream-rpc.somnia.network
- **Explorer**: https://shannon-explorer.somnia.network
- **Currency**: STT (Somnia Testnet Token)

## 🎮 Game Controls

- **Left Paddle**: Arrow Up/Down or Mouse
- **Right Paddle**: Arrow Up/Down or Mouse
- **Touch Support**: Tap to move paddles on mobile
- **Auto-pause**: Game pauses when window loses focus

## 🔄 Game Flow

1. **Initialization** - Game loads with animated background
2. **Wallet Connection** - Fake wallet connects instantly
3. **Match Setup** - Enter match code and join
4. **Gameplay** - 100-second timer with sound effects
5. **Game Over** - Winner determined and result submitted
6. **Blockchain** - Transaction hash displayed with explorer link

## 🎨 UI Components

- **Wallet UI**: Glassmorphic panel with gradient background
- **Game Canvas**: 600x300 pixel game area
- **Status Display**: Real-time updates and transaction info
- **Timer**: Countdown display (turns red when < 10 seconds)
- **Game Over Screen**: Winner announcement with blockchain status

## 🎵 Sound System

- **Synthesized Audio**: Web Audio API for dynamic sounds
- **Frequency Control**: Different tones for different events
- **Duration Management**: Short, crisp sound effects
- **Error Handling**: Graceful fallback if audio fails

## 📱 Mobile Support

- **Responsive Design**: Adapts to different screen sizes
- **Touch Controls**: Tap to move paddles
- **Mobile Audio**: Optimized for mobile browsers
- **Performance**: Smooth 60 FPS gameplay

## 🔒 Security Features

- **Fake Transactions**: Demo mode for testing
- **Input Validation**: Safe user input handling
- **Error Boundaries**: Graceful error handling
- **XSS Protection**: Sanitized content display

## 🚀 Future Enhancements

- [ ] Real MetaMask integration
- [ ] Multiple game modes
- [ ] Tournament system
- [ ] NFT rewards
- [ ] Leaderboards
- [ ] Social features

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**🎮 Ready to play the future of gaming? Visit https://krishmatrix.github.io/netplayjs-demo/somnia-pong/**

*Built with ❤️ for the Somnia blockchain community*
