// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SomniaPongContract {
    // Match result event
    event MatchReported(
        bytes32 indexed matchId, 
        address indexed reporter, 
        address winner, 
        uint8 scoreA, 
        uint8 scoreB,
        uint256 timestamp
    );

    // Winner paid event
    event WinnerPaid(
        bytes32 indexed matchId,
        address winner,
        uint256 amount
    );

    // Match state
    struct Match {
        address player1;
        address player2;
        uint8 scoreA;
        uint8 scoreB;
        address winner;
        bool isComplete;
        bool isPaid;
        uint256 timestamp;
    }

    // Match tracking
    mapping(bytes32 => Match) public matches;
    mapping(bytes32 => uint8) public reports; // dedupe counter

    // Contract owner
    address public owner;
    
    // Entry fee (in wei)
    uint256 public entryFee = 0.001 ether; // 0.001 STT per player
    
    // Contract balance
    uint256 public contractBalance;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Join a match by paying entry fee
    function joinMatch(bytes32 matchId) external payable {
        require(msg.value == entryFee, "Must pay exact entry fee");
        require(!matches[matchId].isComplete, "Match already completed");
        
        Match storage matchData = matches[matchId];
        
        if (matchData.player1 == address(0)) {
            matchData.player1 = msg.sender;
        } else if (matchData.player2 == address(0) && matchData.player1 != msg.sender) {
            matchData.player2 = msg.sender;
        } else {
            revert("Match is full or you already joined");
        }
        
        contractBalance += msg.value;
    }

    // Report match result (can be called by either player)
    function reportMatch(
        bytes32 matchId, 
        address winner, 
        uint8 scoreA, 
        uint8 scoreB
    ) external {
        Match storage matchData = matches[matchId];
        
        // Verify caller is a player in this match
        require(
            msg.sender == matchData.player1 || msg.sender == matchData.player2,
            "Only match participants can report results"
        );
        
        // Prevent duplicate reports
        bytes32 resultHash = keccak256(abi.encode(matchId, winner, scoreA, scoreB));
        reports[resultHash]++;
        
        // Only process first report
        if (reports[resultHash] == 1) {
            matchData.scoreA = scoreA;
            matchData.scoreB = scoreB;
            matchData.winner = winner;
            matchData.isComplete = true;
            matchData.timestamp = block.timestamp;
            
            emit MatchReported(matchId, msg.sender, winner, scoreA, scoreB, block.timestamp);
            
            // Pay the winner if both players joined
            if (matchData.player1 != address(0) && matchData.player2 != address(0)) {
                _payWinner(matchId, winner);
            }
        }
    }

    // Internal function to pay winner
    function _payWinner(bytes32 matchId, address winner) internal {
        Match storage matchData = matches[matchId];
        
        if (!matchData.isPaid && winner != address(0)) {
            uint256 prizeAmount = entryFee * 2; // Both players' entry fees
            
            require(contractBalance >= prizeAmount, "Insufficient contract balance");
            
            contractBalance -= prizeAmount;
            matchData.isPaid = true;
            
            // Transfer prize to winner
            (bool success, ) = winner.call{value: prizeAmount}("");
            require(success, "Failed to transfer prize");
            
            emit WinnerPaid(matchId, winner, prizeAmount);
        }
    }

    // Get match details
    function getMatch(bytes32 matchId) external view returns (
        address player1,
        address player2,
        uint8 scoreA,
        uint8 scoreB,
        address winner,
        bool isComplete,
        bool isPaid,
        uint256 timestamp
    ) {
        Match storage matchData = matches[matchId];
        return (
            matchData.player1,
            matchData.player2,
            matchData.scoreA,
            matchData.scoreB,
            matchData.winner,
            matchData.isComplete,
            matchData.isPaid,
            matchData.timestamp
        );
    }

    // Owner functions
    function setEntryFee(uint256 newFee) external onlyOwner {
        entryFee = newFee;
    }

    function withdrawBalance() external onlyOwner {
        require(contractBalance > 0, "No balance to withdraw");
        uint256 amount = contractBalance;
        contractBalance = 0;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to withdraw");
    }

    // Emergency function to recover stuck funds
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw");
    }

    // Fallback function
    receive() external payable {
        contractBalance += msg.value;
    }
}
