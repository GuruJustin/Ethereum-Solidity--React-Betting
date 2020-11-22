pragma solidity ^0.4.24;

import './Prediction.sol';

/** @title Prediction Market. */
contract PredictionMarket {  

  address[] predictions; // addresses of all the created predictions
  uint public minWithdrawPeriod; // minimum withdraw period for prizes
  uint public feePercent; // % fee taken by owner from all bets placed for a prediction

  event PredictionCreatedEvent(Prediction predictionAddress);

  /** @dev  Constructor
    * @param _minWithdrawPeriod Minimum withdraw period for withdrawing prizes after resolution.
    * @param _feePercent Percentage fee of all bets placed that owner will get from predictions.
  */
  constructor (uint _minWithdrawPeriod, uint _feePercent) public {
    minWithdrawPeriod = _minWithdrawPeriod;
    feePercent = _feePercent;
  }

  /** @dev  Create a new prediction contract
    * @param _statement The prediction description that bet's will be placed on.
    * @param _betEndTimestamp Time after which no more bets can be placed.
    * @param _withdrawPeriod Duration betters and voters have to withdraw their prizes.
  */
  function createPrediction(string _statement, uint _betEndTimestamp, uint _withdrawPeriod) public {
    // Reduce withdraw period if it is larger than the minimum allowed.
    if (_withdrawPeriod < minWithdrawPeriod) _withdrawPeriod = minWithdrawPeriod;
    
    // Crate prediction and store address.
    Prediction prediction = new Prediction(_statement, _betEndTimestamp, _withdrawPeriod, feePercent);
    predictions.push(prediction);
    
    // Transfer ownership to the creator.
    prediction.transferOwnership(msg.sender);
    emit PredictionCreatedEvent(prediction);
  }

  /** @dev  Get an array of contract addresses of prediction contracts that were created.*/
  function getPredictions() public constant returns (address[]) {
    return predictions;
  }
  
}