# Design Pattern Desicions
Various design pattern desicions were implemented and some were purposefully not.
Below is a description of each design pattern, an example of how it was implemented in the contracts, and the advantages of having it.

### [Access Restriction](https://fravoll.github.io/solidity-patterns/access_restriction.html)

**Description**

Restrict the access to contract functionality according to suitable criteria. Both state variables and functions can have restricted access depending on whether they
are defined as public or use modifiers in the case of functions.

**Code**

Prediction.sol - 
```function vote(bool _vote) payable notOwner() onlyInState(State.Closed) public {...}```

**Advantages**

Access to the 'vote' function is restricted for anyone how is not the owner of the prediction, and can only be called when the contract state is 'closed'.
Of particular important is the 'onlyInState' modifier which restricts voting until all betting is finished and the state is closed.
This design pattern allows us to ensure voting does not happen during betting, and keeps our contract functionality working correctly depending on it's state.


### [Pull over Push](https://fravoll.github.io/solidity-patterns/pull_over_push.html)

**Description**

Shift the risk associated with transferring ether to the user.

**Code**

Prediction.sol - 
```function withdrawPrize() notOwner() onlyInStates(State.Resolved, State.Finished) public {...}```

**Advantages**

The function withdrawPrize() requires betters to withdraw their own prizes instead of having a single function which distributes all prizes to each better.
This is advantageous because it saves a lot of gas costs for this contract. Also, it reduces the risk of the recieving address being a contract which could have 
a fallback function implemented that simply throws an exception once it gets called. Basically, one failed transfer will not lead to revert of all other transfers as well.


### [Guard Check](https://fravoll.github.io/solidity-patterns/guard_check.html)

**Description**

Ensure that the behavior of a smart contract and its input parameters are as expected.

**Code**

Prediction.sol - 
```function resolve(bool _outcome) onlyOwner onlyInState(State.Closed) public { require(resolved == false);  ...  }```

**Advantages**

The guard check used in the 'resolve' function makes sure that the bet has not already been resolved. This will make sure no critical state variables have their values changed after a bet is already resolved. This could be dangerous if the outcome of a bet is changed multiple times. Many guard checks were used throughout the contracts, as it is a simple design pattern.

### [Circuit Breaker/Emergency Stop](https://fravoll.github.io/solidity-patterns/emergency_stop.html)

**Description**

Add an option to disable critical contract functionality in case of an emergency.

**Code**

Prediction.sol
```function bet(bool _outcome) payable notOwner() onlyInState(State.Open) stopInEmergency() public {...}```

**Advantages**

In the 'bet' function there is an emergency stop implemented, which can be triggered by the owner of the bet. This kill switch is there to prevent betting on a statement/prediction that is flawed or invalid. This will ensure bet funds are not lost in the event of a corrupted or disqualified bet that may occur due to some event.
The usage of this design pattern here protects from funds being lost and to retain the legitimacy of betting in the case of an emergency that may ruin the fairness of a 
bet or prediction.

### [State Machine](https://solidity.readthedocs.io/en/v0.4.24/common-patterns.html#state-machine)

**Description**

Allows a contract to behave like a state machine, which means that they have certain stages in which they behave differently or in which different functions can be called. A function call often ends a stage and transitions the contract into the next stage.

**Code**

Prediction.sol
```enum State { Open, Closed, Resolved, Finished }```

**Advantages**

The Prediction contract uses the State enum variable to keep track of which state it's currently in. The 4 states are necessary for the contract logic to work properly
and for bets, votes, and payouts to occur in the correct order. Below is a description of each state that is used in the Prediction contract:
    1. Open - bets can be placed on any outcome
    2. Closed - bets can no longer be placed, voters can begin voting
    3. Resolved - owner has resolved the prediction according to the votes, betters/voters can withdraw their prizes
    4. Finished - no more withdrawing prizes


### [Oracle](https://fravoll.github.io/solidity-patterns/oracle.html)

**Description**

Gain access to data stored outside of the blockchain.

**Reason not used**

This design pattern was not used in this project. The reason is because we want outcomes to be determined either by the owner or by voting on the outcome through a democratic process, rather than having a point of failure on the oracle being used. Although oracles can provide valuable information for resolving various bets, they 
are also dangerous and can be exploited or hacked by bad actors. This project implements voting to remove the need for oracles and let outcomes be determined democratically.
