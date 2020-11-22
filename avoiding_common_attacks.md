# Avoiding Common Attacks
Below is a list of common attacks that were addressed in the implementation of the contracts, and descriptions of the measures taken to 
ensure they are not susceptible to those common attacks.

### Logic Bugs
Logic bugs were avoided by implementing a vast amount of unit tests that tested every function in every state of the Prediction and Prediction Market contracts.
The truffle framework was used to implement tests in JavaScript that call tests for functionalities implemented in both contracts.
    
### Integer Arithmetic Overflow
Integer arithmetic overflow was avoided by using Open Zeppelin's SafeMath.sol library to ensure no integer wrapping occured when calculating prizes and fees, which used
complex multiplication and division.
    
### Poison Data
Poison data was avoided by ensuring only the owner can modify state variables and that a normal better could only transfer ether into the contract via a bet function (a button in the UI) and voters could only cast their vote stake via the vote function (also a single button in the UI). This singular dimensionality for the user prevents
them from adding poisonous data to the smart contracts.

### Exposed functions
To prevent that any functions were accidentally exposed, the visibility of all functions and variables was explicitly declared, even for those that should default to public.
Also, no storage variables were declared private as none needed to be for the sake of any functionality.

### Vulnerable to Timestamp
Since the Prediction contract states depend on the blockchain time stamps, there is a potential attack vector for miners to manipulate the time stamps and thus manipulate
how much longer the betting state can go on for relative to the specified duration. The same applies for the withdraw period specified by the Prediction Market contract. 
This vulnerability can be somewhat mitigated by creating bets that are not time dependent and whose deadlines are arbitrary or are deadlines that are not too close to any 
particular real world event that they depend on.
    
### Malicious Admins
Malicious owners of a certain prediction could potentially lie about the outcome of a bet. To deal with this attack vector, voting was implemented to allow bets to be
resolved via vote staking on the outcome after the betting period is over. This can prevent entrusting too much bet funds to one person who may be corrupted.

### Transaction Origin
Because Ethereum core developers said not to assume 'tx.origin' will continue to be usable or meaningful, 'tx.origin' was never called or used in any of the contracts.
Instead, the contracts use 'msg.sender'.
