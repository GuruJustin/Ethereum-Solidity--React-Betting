import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {
  updateVoteBalances,
  updateVotersBalances
} from ".";

export function placeVote(vote, voteEther) {
  console.log('placeVote()', vote, voteEther);
  return async function(dispatch, getState) {

    const web3 = getState().network.web3;
    const prediction = getState().prediction.contract;
    console.log('prediction', prediction);

    dispatch(setWaiting(true));

    // Place vote
    const voteWei = web3.toWei(voteEther, 'ether');
    console.log('placing vote: ', vote, voteWei, getState().network.activeAccountAddress);
    prediction.vote(vote, {
      from: getState().network.activeAccountAddress,
      value: voteWei,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      console.log('vote placed!');
      dispatch(setWaiting(false));

      // Invalidate prediction data.
      dispatch(updateVoteBalances(prediction.address));
      dispatch(updateVotersBalances(prediction.address));
    });
  };
}
