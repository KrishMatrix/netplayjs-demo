# Somnia Pong - On-Chain Match Results

A multiplayer Pong game that submits match results to the Somnia blockchain and pays winners.

## Features

- **100-second timer** - Games end after 100 seconds or when a player reaches 5 points
- **Somnia Testnet integration** - Connect your wallet to Somnia testnet
- **Entry fees** - Players pay 0.001 STT to join matches
- **Winner payout** - Winner receives both players' entry fees (0.002 STT total)
- **On-chain verification** - Match results are recorded on the blockchain

## Smart Contract Deployment

### 1. Deploy the Contract

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `SomniaPongContract.sol`
3. Copy the contract code from `contracts/SomniaPongContract.sol`
4. Set compiler to Solidity 0.8.20
5. Connect to Somnia Testnet:
   - Network: Somnia Testnet
   - RPC: https://dream-rpc.somnia.network
   - Chain ID: 50312 (0xC4B8)
6. Deploy the contract
7. Copy the deployed contract address

### 2. Update the Frontend

1. Open `src/somnia-pong.html`
2. Replace `PASTE_YOUR_SOMNIA_PONG_CONTRACT_ADDRESS` with your deployed contract address
3. Save the file

**Note**: The contract address is already configured: `0x4e7890BfCaab0A4474e627794D4912979B4D92Ba`

### 3. Get Somnia Testnet Tokens

1. Visit the [Somnia Faucet](https://faucet.somnia.network/)
2. Enter your wallet address
3. Request testnet tokens

## How to Play

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask to Somnia testnet
2. **Enter Match Code**: Both players enter the same match code (e.g., "ABC123")
3. **Join Match**: Click "Join Match" to pay the entry fee (0.001 STT)
4. **Play**: Use arrow keys or mouse to control your paddle
5. **Win**: First to 5 points or highest score after 100 seconds wins
6. **Get Paid**: Winner automatically receives 0.002 STT (both entry fees)

## Game Rules

- **Timer**: 100 seconds maximum
- **Scoring**: First to 5 points wins, or highest score when time runs out
- **Entry Fee**: 0.001 STT per player
- **Prize**: 0.002 STT to the winner
- **Controls**: Arrow keys or mouse for paddle movement

## Technical Details

- **Chain**: Somnia Testnet (Chain ID: 50312)
- **RPC**: https://dream-rpc.somnia.network
- **Explorer**: https://shannon-explorer.somnia.network
- **Entry Fee**: 0.001 STT (configurable by contract owner)
- **Match ID**: Generated from match code using keccak256

## Contract Functions

- `joinMatch(bytes32 matchId)` - Pay entry fee to join a match
- `reportMatch(bytes32 matchId, address winner, uint8 scoreA, uint8 scoreB)` - Report match results
- `getMatch(bytes32 matchId)` - Get match details
- `entryFee()` - Get current entry fee

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your web server or GitHub Pages
3. Make sure to update the contract address in the HTML file

## Troubleshooting

- **MetaMask not connecting**: Make sure you're on Somnia testnet (Chain ID: 50312)
- **Transaction fails**: Check that you have enough STT for gas fees and entry fee
- **Game not submitting**: Ensure both players have joined the match with the same match code

## Security Notes

- Only match participants can report results
- Duplicate reports are prevented
- Winner is automatically paid when match is reported
- Contract owner can adjust entry fees and withdraw excess funds
