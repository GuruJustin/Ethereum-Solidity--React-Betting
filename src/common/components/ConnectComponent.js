import React from 'react';
import BubblePreloader from 'react-bubble-preloader';

const ConnectComponent = ({
  title
}) => {
  return (
    <div className="container">

      {/* TITLE */}
      <div className="text-center">
        <p className="text-muted text-center">{title}</p>
        <BubblePreloader
          bubble={{ width: '5rem', height: '5rem' }}
          animation={{ speed: 2 }}
          className=""
          colors={['#415bf4', '#5b41f4', '#7741f4']}
        />
      </div>
    </div>
  );
};

export default ConnectComponent;
