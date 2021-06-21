import React from 'react';
import { SortName, SortType } from './constants';

const SortSheet = (props) => {
  const { sortType, setSortType } = props;

  const sort = (index) => () => setSortType(index);

  return (
    <div className="sheet-modal sort-sheet category__sort-sheet" data-swipe-to-close="true" data-backdrop="true">
      <div className="sheet-modal-inner">
        <div className="page-content">
          <div className="category__sort-sheet--title">정렬</div>

          <div className="list">
            <ul>
              {SortName?.map((item, index) => (
                <li key={index}>
                  <label className="item-radio item-radio-icon-end item-content sheet-close" onClick={sort(index)}>
                    {sortType?.value === index && (
                      <div>
                        <input type="radio" checked />
                        <i className="icon icon-radio"></i>
                      </div>
                    )}
                    <div className="item-inner">
                      <div className="item-title">{item}</div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortSheet;
