import React, { Component } from 'react';
import NavigationComponent from './NavigationComponent';
import IncompatibleComponent from './IncompatibleComponent';
import { connect } from 'react-redux';
import {
  TARGET_LIVE_NETWORK, USE_INJECTED_WEB3
} from '../../constants';

class App extends Component {

  render() {

    // INCOMPATIBLE.
    const isChrome = !!window.chrome && !!window.chrome.webstore;
    const hasMetamask = !USE_INJECTED_WEB3 || (USE_INJECTED_WEB3 && !!this.props.web3);
    const onProperNetwork = !USE_INJECTED_WEB3 || (this.props.networkName === undefined) || (this.props.networkName && this.props.networkName === TARGET_LIVE_NETWORK);
    if(!hasMetamask || !onProperNetwork) {
      return <IncompatibleComponent isChrome={isChrome} hasMetamask={hasMetamask} onProperNetwork={onProperNetwork}/>;
    }

    return (
      <div className="">

        {/* NAV */}
        <NavigationComponent path={this.props.location.pathname}/>

        {/* BODY */}
        <div className="wrapper">
          {/* CONTENT MANAGED BY ROUTES */}
          {this.props.children}
        </div>

        {/* FOOTER */}
        <footer className="row footer-muted" style={{height: '60px'}}>
          <div className="text-center">
            <small className="text-muted">
            &nbsp;Current Account: {this.props.activeAccountAddress} <br/>            
            &nbsp;Send donations to: 
            <a
                href="https://etherscan.io/enslookup?q=betmebot.atethereum.eth"
                target="_blank"
                rel="noopener noreferrer"
              >&nbsp;betmebot.atethereum.eth<br/>  
            </a>
            </small>
          </div>
        </footer>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.network.web3,
    networkName: state.network.networkName,
    isNetworkConnected: state.network.isConnected,
    activeAccountAddress: state.network.activeAccountAddress
  };
}

export default connect(mapStateToProps, null)(App);
