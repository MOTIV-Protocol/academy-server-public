import React, { useCallback, useEffect, useRef } from 'react';

type RateyoProps = {
  starWidth?: string | number;
  fullStar?: boolean;
  halfStar?: boolean;
  readOnly?: boolean;
  rating?: string | number;
  onChange?: Function;
  [key: string]: any;
}

const Rateyo = ({starWidth, fullStar, halfStar, readOnly, rating, onChange, ...etc}: RateyoProps = {}) => {
  const rateyoRef = useCallback( element => {
    if( !element ) return;
    ($(element) as any).rateYo({
      starWidth,
      fullStar,
      halfStar,
      readOnly,
      rating,
      onChange,
      ...etc
    });
  }, [])
  return (<div ref={rateyoRef}></div>);
};

export default Rateyo;