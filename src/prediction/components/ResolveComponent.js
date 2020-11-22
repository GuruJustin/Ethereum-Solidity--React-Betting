import React from 'react';

const ResolveComponent = ({ resolvePrediction, resolvePredictionUsingVotes }) => {

  const handleResolveButtonClick = function(outcome) {
    resolvePrediction(outcome);
  };

  const handleUseVotesButtonClick = function() {
    resolvePredictionUsingVotes();
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <strong>You may resolve this prediction now</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-info"
            onClick={(evt) => handleResolveButtonClick(true)}>
            Did Happen
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleResolveButtonClick(false)}>
            Didn't Happen
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-warning"
            onClick={(evt) => handleUseVotesButtonClick()}>
            Use votes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResolveComponent;
