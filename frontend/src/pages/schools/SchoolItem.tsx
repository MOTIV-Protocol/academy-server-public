import { imagePath } from '@utils/helpers';
import React from 'react';
import Rateyo from '../../components/reviews/Rateyo';

const SchoolItem = (props) => {
  const { school } = props

  return <div className="margin-vertical-half row">
    <div className="col-30">
      <img src={imagePath(school)} className="width-100 radius" />
    </div>
    <div className="col-70 flex flex-col justify-center">
      <h4 className="text-lg font-bold">{school.name}</h4>
      <div className="flex flex-row">
        <div className="flex-1 mb-2 text-md text-gray-800">{school.introduce}</div>
        <div className="flex flex-col justify-end items-end">
          <span className="text-xs px-0.5 mb-1 rounded-sm border border-gray-600 text-gray-500">찜 {school.like_count}</span>
          <Rateyo rating={school.average_score || 0} starWidth="14px"/>
        </div>
      </div>
    </div>
  </div>
}

export default SchoolItem;
