import React from 'react';
import { Link } from 'react-router';
import * as info from '../../../package.json';
import {
  PATH_CREATE,
  PATH_ROOT,
  PATH_ABOUT, SHOW_VERSION
} from '../../constants';

const NavigationComponent = ({ path }) => {
  return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">

          {/* BetMeBot */}
          <div className="navbar-header">
            <div className="navbar-brand">
              <div className="brand">                
                <span>BetMeBot</span>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="navbar-collapse collapse">

            {/* NAV ITEMS (LEFT) */}
            <ul className="nav navbar-nav">

              {/* BETS */}
              <li className={`${path === PATH_ROOT ? 'active' : ''}`}>
                <Link to={PATH_ROOT}>View Bets</Link>
              </li>

              {/* MAKE BET */}
              <li className={path === PATH_CREATE ? 'active' : ''}>
                <Link to={PATH_CREATE}>Make Bet</Link>
              </li>

            </ul>

            {/* NAV ITEMS (RIGHT) */}
            <ul className="nav navbar-nav navbar-right">

              {/* ABOUT */}
              <li className={path === PATH_ABOUT ? 'active' : ''}>
                <Link to={PATH_ABOUT}>About</Link>
              </li>

              {/* VERSION */}
              {SHOW_VERSION &&
                <li>
                  <a> v{info.version}</a>
                </li>
              }

            </ul>

          </div>

        </div>
      </nav>
    </div>
  );
};

export default NavigationComponent;
