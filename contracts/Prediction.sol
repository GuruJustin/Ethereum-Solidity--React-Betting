pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/** @title Prediction. 
  * @dev A prediction contract that anyone can create for anyone to bet on.
*/
contract Prediction is Ownable {

  using SafeMath for uint;

  bool public stopped; // circuit breaker variable to prevent betting on a prediction if there is a problem with the statement

  string public statement; // statement that describes the prediction
  uint public betEndTimestamp; // bets cannot be placed after this time
  uint public withdrawPeriod; // duration alotted for withdrawing prizes after prediction is resolved
  uint public feePercent; // percentage of prizes that are given to the owner of the prediction

  bool public outcome; // the outcome of the prediction, determined by the votes
  uint public resolutionTimestamp; // the time the prediction was resolved
  uint public withdrawEndTimestamp; // withdrawing prizes deadline
  bool public feesWithdrawn; // check if this prediction has had it's fees withdrawn
  bool public resolved; // flag repsenting if this prediction is resolved

  /** 
    4 states that a prediction can be in:
    1. Open - bets can be placed on any outcome
    2. Closed - bets can no longer be placed, voters can begin voting
    3. Resolved - owner has resolved the prediction according to the votes, betters/voters can withdraw their prizes
    4. Finished - no more withdrawing prizes
   */
  enum State { Open, Closed, Resolved, Finished }

  mapping(bool => mapping(address => uint)) bets; // mapping from true/false outcomes => mapping from better's address to bet amount
  mapping(bool => uint) public totals; // mapping from true/false outcomes => total bet size

  mapping(bool => mapping(address => uint)) votes; // mapping from true/false outcomes => mapping from voter's address to vote stake
  mapping(bool => uint) public voteTotals; // mapping from true/false outcomes => total vote stake

  event BetEvent              (address indexed from, bool prediction, uint value);
  event VoteEvent             (address indexed from, bool vote, uint value);
  event ResolveEvent          (bool selectedOutcome);
  event WithdrawPrizeEvent    (address indexed from);
  event WithdrawVotePrizeEvent(address indexed from);
  event WithdrawFeesEvent     (address indexed from);  

  /** @dev Function modifier to prohibit the owner from using a function */
  modifier notOwner() {
    require(msg.sender != owner);
    _;
  }

  /** @dev Function modifier to prohibit calling a function depending on the contract State */
  modifier onlyInState(State _state) {
    if (_state != getState()) { revert(); }
    _;
  }

  /** @dev Function modifier to prohibit calling a function depending multiple values of the contract State */
  modifier onlyInStates(State _state1, State _state2) {
    if (_state1 != getState() && _state2 != getState()) { revert(); }
    _;
  }

  /** @dev Circuit breakers modifier to prohibit calling a function in the case of an emergency (i.e. an invalid betting statement) */
  modifier stopInEmergency {
    require(!stopped);
     _;
  }
  
  /** @dev  Constructor
    * @param _statement Statement that describes the prediction.
    * @param _betEndTimestamp Last time that bets can be placed.
    * @param _withdrawPeriod Duration after resolution that prizes can be withdrawn.
    * @param _feePercent Fee charged for owner from betting pool.
  */
  constructor (string _statement, uint _betEndTimestamp, uint _withdrawPeriod, uint _feePercent) public {
    require(_betEndTimestamp > now);

    statement = _statement;
    feePercent = _feePercent;
    betEndTimestamp = _betEndTimestamp;
    withdrawPeriod = _withdrawPeriod;    
  }

  /** @dev Function to toggle the circuit breaker variable 'stopped', used to stop betting. */
  function toggleBettingActive() onlyOwner() public {
    stopped = !stopped;
  }

  /** @dev  Function to allow betters to bet Ether (sent with function call) on an outcome of this prediction. Bets can only added in the 'open' State.
    * Betting can be stopped by the owner if the prediction is invalid.
    * @param _outcome The outcome for which the function caller is betting on
  */
  function bet(bool _outcome) payable notOwner() onlyInState(State.Open) stopInEmergency() public {
    // Check if any Ether was sent for the bet.
    if (msg.value == 0) revert();

    // Update better's balances based on which outcome they bet for.
    uint pos = bets[true][msg.sender];
    uint neg = bets[false][msg.sender];
    bets[true][msg.sender] = _outcome ? pos.add(msg.value) : pos;
    bets[false][msg.sender] = !_outcome ? neg.add(msg.value) : neg;

    // Add new bet amount to the bet totals pot.
    totals[_outcome] = totals[_outcome].add(msg.value);

    emit BetEvent(msg.sender, _outcome, msg.value);
  }

  /** @dev  Function to get a better's balance that he/she bet on for a specific outcome.
    * @param _outcome The outcome for which to retrieve the amount bet on.
  */
  function getUserBalance(bool _outcome) public constant returns (uint) {
    return bets[_outcome][msg.sender];
  }

  /** @dev  Function to get a voter's balance that he/she vote on for a specific outcome.
    * @param _outcome The outcome for which to retrieve the vote stake amount.
  */
  function getVoterBalance(bool _outcome) public constant returns (uint) {
    return votes[_outcome][msg.sender];
  }

  /** @dev  Function resolve this prediction contract. The outcome is determined by the owner.     
    * The prediction can only be resolved in the closed State.
    * @param _outcome The outcome that the owner decides on.
  */
  function resolve(bool _outcome) onlyOwner onlyInState(State.Closed) public {
    require(resolved == false);
    outcome = _outcome;
    resolved = true;
    resolutionTimestamp = now;
    withdrawEndTimestamp = now.add(withdrawPeriod);
    emit ResolveEvent(outcome);
  }

  /** @dev  Function to resolve this prediction contract determined by voters staking money on the outcome. 
    * The outcome with more money staked is considered to be the real outcome.
    * The prediction can only be resolved in the closed State.    
  */
  function resolveUsingVotes() onlyOwner onlyInState(State.Closed) public {
    require(resolved == false);
    outcome = voteTotals[true] >= voteTotals[false] ? true : false;
    resolved = true;
    resolutionTimestamp = now;
    withdrawEndTimestamp = now.add(withdrawPeriod);
    emit ResolveEvent(outcome);
  }

  /** @dev  Function to allow anyone to vote on the outcome using staked Ether.
    * The staked Ether will remain in this contract until the prediction is resolved.
    * Voting can only occur in the closed State.
    * @param _vote The outcome that the voter is voting on.
  */
  function vote(bool _vote) payable notOwner() onlyInState(State.Closed) public {
    // Check if any Ether was sent for the vote.
    if (msg.value == 0) revert();

    // Update voter's balances based on which outcome they vote for.
    uint pos = votes[true][msg.sender];
    uint neg = votes[false][msg.sender];
    votes[true][msg.sender] = _vote ? pos.add(msg.value) : pos;
    votes[false][msg.sender] = !_vote ? neg.add(msg.value) : neg;

    // Add new bet amount to the vote totals pot.
    voteTotals[_vote] = voteTotals[_vote].add(msg.value);

    emit VoteEvent(msg.sender, _vote, msg.value);
  }

  /** @dev  Function for better's to withdraw their prizes if they won.
    * Prizes can only be withdrawn after the prediction is resolved or finished.
  */
  function withdrawPrize() notOwner() onlyInStates(State.Resolved, State.Finished) public {

    // Calculate total prize.
    uint prize = calculatePrize(outcome);
    require(prize > 0);

    // Send funds.
    require(address(this).balance >= prize);
    msg.sender.transfer(prize);
    
    // Reset bets.
    bets[true][msg.sender] = 0;
    bets[false][msg.sender] = 0;

    emit WithdrawPrizeEvent(msg.sender);
  }

  /** @dev  Function to calculate the prize for each better who won. Prizes can only be calculated when the state is resolved/finished.
    * The losing balance is distributed proportionately to the amount the better put in the winning balance, also the original bet amount is added and
    * the fee is subtracted for the owner.
    * @param _outcome The outcome for which to calculate the prize for.
  */
  function calculatePrize(bool _outcome) onlyInStates(State.Resolved, State.Finished) public constant returns (uint) {
    // No prize if outcome is not matched.
    if (_outcome != outcome) return 0;

    // Get the balance of the better that was bet on the outcome.
    uint betterBalance = bets[_outcome][msg.sender];
    if (betterBalance == 0) return 0;

    // Get the total winning and losing balances.
    uint winningPot = totals[outcome];
    uint losingPot = totals[!outcome];

    // Calculate the prize and fee.
    uint factor = 1000000000000000000000000;
    uint winPercentage = betterBalance.mul(factor).div(winningPot);
    uint loserChunk = winPercentage.mul(losingPot).div(factor);
    uint prize = loserChunk.add(betterBalance);
    uint fee = prize.mul(feePercent).div(100);

    return prize.sub(fee);
  }

  /** @dev  Function for voter's to withdraw their prizes if they were correct.
    * Prizes can only be withdrawn after the prediction is resolved or finished.
  */
  function withdrawVotePrize() notOwner() onlyInStates(State.Resolved, State.Finished) public {

    // Calculate total prize.
    uint votePrize = calculateVotePrize(outcome);
    require(votePrize > 0);

    // Send funds.
    require(address(this).balance >= votePrize);
    msg.sender.transfer(votePrize);
    
    // Reset votes.
    votes[true][msg.sender] = 0;
    votes[false][msg.sender] = 0;

   emit WithdrawVotePrizeEvent(msg.sender);
  }

  /** @dev  Function to calculate the prize for each voter who was correct. Prizes can only be calculated when the state is resolved/finished.
    * The "wrong" vote balance is distributed proportionately to the amount the better put in the "correct" balance, also the original vote stake amount is added.
    * @param _outcome The outcome for which to calculate the vote prize for.
  */
  function calculateVotePrize(bool _outcome) onlyInStates(State.Resolved, State.Finished) public constant returns (uint) {
    // No prize if vote does not match outcome.
    if (_outcome != outcome) return 0;

    // Get the balance of the voter that was bet on the outcome.
    uint voterBalance = bets[_outcome][msg.sender];
    if (voterBalance == 0) return 0;

    // Get the total winning and losing vote balances.
    uint rightPot = voteTotals[outcome];
    uint wrongPot = voteTotals[!outcome];

    // Calculate the vote prize.
    uint factor = 1000000000000000000000000;
    uint winPercentage = voterBalance.mul(factor).div(rightPot);
    uint loserChunk = winPercentage.mul(wrongPot).div(factor);
    return loserChunk.add(voterBalance);
  }

  /** @dev  Function for owner to withdraw the fees collected. Fees can only be collected after a prediction is resolved or is finished.    
  */
  function withdrawFees() onlyOwner onlyInStates(State.Resolved, State.Finished) public {
    // Check that the fees have not already been withdrawn.
    require(!feesWithdrawn);

    // Calculate total fees.
    uint fees = calculateFees();
    if (fees > address(this).balance) fees = address(this).balance;
    require(fees > 0);
    
    // Send fees to owner.
    require(address(this).balance >= fees);
    owner.transfer(fees);
    feesWithdrawn = true;

   emit WithdrawFeesEvent(msg.sender);
  }

  /** @dev  Function to calculate the fee amount, can only be called after a prediction is resolved or is finished.    
  */
  function calculateFees() onlyInStates(State.Resolved, State.Finished) public constant returns (uint) {
    // Use total bets instead of balance because balance will decrease with withdrawals.
    uint total = totals[true] + totals[false];
    return total.mul(feePercent).div(100);
  }

  /** @dev  Safety function for owner to withdraw all funds in this prediction's balance so that no funds are stuck inside this contract forever.
   * Can only be called after the prediction state is finished.
  */
  function purge() onlyOwner onlyInState(State.Finished) public {
    require(address(this).balance > 0);
    owner.transfer(address(this).balance);
  }

  /** @dev  Function to get the current state of the prediction. */
  function getState() public constant returns (State) {
    if (!resolved) {
      if (now < betEndTimestamp)
        return State.Open;
      else
        return State.Closed;
    }
    else {
      if (now < withdrawEndTimestamp)
        return State.Resolved;
      else
        return State.Finished;
    }
  }

}