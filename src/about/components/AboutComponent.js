import React, { Component } from 'react';

class AboutComponent extends Component {
  render() {
    return(
      <div>

        <div className="container">

          {/* Description */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>What is BetMeBot?</strong>
            </div>
            <div className="panel-body">
              BetMeBot is a betting platfom that allows users to bet on the outcome of any prediction.
              It is built on the Ethereum blockchain such that anyone can create a bet, participate in a bet, and vote on bet outcomes.
              Bets must be binary (true/false) and after the outcome is resolved, the winning betters can withdraw their winnings.
              Winnings are distributed proportionaly to the winners based on their bet size, and a small fee is charged that goes to the owner/creator of the prediction.              
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Instructions</strong>
            </div>
            <div className="panel-body">
              In the "Make Bet" section, define a bet that is a true or false statement, specify the resolution date after which bets are closed and users vote on the outcome, 
              and lastly define the withdrawal period, which is the duration that users have after resolution to withdraw their winnings.                          
            </div>
          </div>

          {/* RULES */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Rules</strong>
            </div>
            <div className="panel-body">
              The following set of rules are enforced by the smart contracts:
              <ul>
                <li>To ensure no funds are stuck, the owner can withdraw the entire balance of a bet after the withdrawl period is over.</li>
                <li>Owner cannot bet nor vote on their own predictions.<br/></li>
                <li>Owner can stop all betting if there is something invalid about the prediction.<br/></li>
                <li>Players can bet both true and false, all bets are final.</li>
                <li>Outcome voting ends on the bet end date, but can be irrelevant if the owner resolves it.</li>                
                <li>The withdrawal period starts as soon as the owner of a prediction resolves it.</li>
              </ul>
            </div>
          </div>

          {/* PRIZES */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Prizes</strong>
            </div>
            <div className="panel-body">
              Every bet has a pair of balances for each outcome. The winners can withdraw their original bet from the "winning" balance, and take their winnings from the "lose" balance.
              The amount withdrawable from the "lose" balance is proportional to how much they bet relative to the "winning balance". For example, if a winner had bet 1 eth and the total
              winning balance was 100 eth, then he will get 1% of the losing balance + his original 1 eth bet. However, in reality it will be slightly less because the owner retains a small 2% fee.            
            </div>
          </div>

          {/* SMART CONTRACTS */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Smart Contracts</strong>
            </div>
            <div className="panel-body">
              The back-end is composed of one PredictionMarket smart contract and numerous Prediction smart contracts.
              When a player creates a Prediction, he/she interacts with the PredictionMarket, which makes sure a proper Prediction smart contract is created.
              Afterwards, a new Prediction smart contract will exist that anyone can interact with, and the PredictionMarket will also keep track of it.
              </div>
          </div>

        </div>
      </div>
    );
  }
}

export default AboutComponent;
