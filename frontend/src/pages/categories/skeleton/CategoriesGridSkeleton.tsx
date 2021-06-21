import React from 'react';

const CategoriesGridSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="col-25 text-align-center margin-top-half">
          <div className="content-box no-padding padding-vertical-half skeleton-effect-wave">
            <a>
              <img className="skeleton-block" style={{ width: '40%', height: '30px', margin: '0 auto' }} />
              <small className="skeleton-text">______</small>
            </a>
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoriesGridSkeleton;
