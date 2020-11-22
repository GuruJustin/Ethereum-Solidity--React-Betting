import React from 'react';
import { form } from 'react-inform';
import {ETH_SYMBOL} from "../../constants";

class PlaceVoteComponent extends React.Component {

  handleVoteSubmit(prediction) {
    const { voteValue } = this.props.fields;
    this.props.form.forceValidate();
    if(!this.props.form.isValid()) return;
    this.props.placeVote(prediction, voteValue.value);
  };

  render() {

    const { voteValue } = this.props.fields;

    return (
      <div className={`panel panel-${!this.props.isOwned ? 'info' : 'default'}`}>
        <div className="panel-heading">
          <strong>Stake your vote</strong>
        </div>
        <div className="panel-body">

          {/* OWNER CAN'T VOTE */}
          {this.props.isOwned &&
          <div>
            <h4 className="text-muted">
              Sorry, owner's can't vote on their own predictions.
            </h4>
          </div>
          }

          {/* VOTE FORM */}
          {!this.props.isOwned &&
          <form>

            {/* VALUE */}
            <div className={`form-group ${voteValue.error ? 'has-danger' : ''}`}>
              <input
                type="text"
                className="form-control"
                placeholder={`0${ETH_SYMBOL}`}
                {...voteValue.props}
              />
              <small className="text-danger">
                {voteValue.error}
              </small>
            </div>

            {/* YES */}
            <button
              type="button"
              className="btn btn-info"
              onClick={(evt) => this.handleVoteSubmit(true)}>
              This happened
            </button>

            &nbsp;

            {/* NO */}
            <button
              type="button"
              className="btn btn-danger"
              onClick={(evt) => this.handleVoteSubmit(false)}>
              This did not happen
            </button>
          </form>
          }

        </div>
      </div>
    );
  }
}

const fields = ['voteValue'];
const validate = values => {
  const { voteValue } = values;
  const errors = {};
  if (!voteValue || voteValue.length === 0) errors.voteValue = 'Vote value is required.';
  if(isNaN(voteValue)) errors.voteValue = 'Please enter a valid number.';
  if(voteValue > 50) errors.voteValue = 'Whoa! Please enter a smaller stake.';
  if(voteValue < 0.01) errors.voteValue = 'Please enter a larger stake.';
  return errors;
};

export default form({
  fields,
  validate
})(PlaceVoteComponent);
