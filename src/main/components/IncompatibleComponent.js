import React from 'react';
import {TARGET_LIVE_NETWORK} from "../../constants";

const IncompatibleComponent = ({
  isChrome,
  hasMetamask,
  onProperNetwork
}) => {
  return (
    <div className="container">
      <div className="jumbotron">

        <h1 className="text-center">
          Hold on!
        </h1>
        <br/>

        {/* CHROME */}
        { !isChrome &&
        <div>
          <h3 className="text-center">This application needs to be ran on Google Chrome. <a href="https://www.google.com/chrome/browser/features.html"> Get it here.</a></h3>
        </div>
        }

        {/* METAMASK */}
        { !hasMetamask &&
        <div>
          <h3 className="text-center">This application requires the Metamask Google Chrome extension.<a href="https://metamask.io/"> Get it here.</a></h3>
        </div>
        }

        {/* NETWORK */}
        { !onProperNetwork &&
        <div>
          <h3 className="text-center">Please point Metamask to the {TARGET_LIVE_NETWORK} network.</h3>
        </div>
        }

      </div>
    </div>
  );
};

export default IncompatibleComponent;