import React from 'react';

const FilterPopup = (props) => {
  const { subCategories, addSubCategory } = props;

  const selectCategory = (subCategory) => async () => {
    addSubCategory(subCategory);
  };

  return (
    <div className="popup filter-popup" data-swipe-to-close="true">
      <div className="m-3">
        <div className="flex justify-between mb-3">
          <div className="block-title">필터</div>
          <a href="#" className="popup-close flex items-end">
            <i className="f7-icons size-25">multiply</i>
          </a>
        </div>

        <div className="row">
          {subCategories.map((sub_category) => (
            <div
              key={sub_category.id}
              className="category__filter-popup--button col-50 button popup-close"
              onClick={selectCategory(sub_category)}
            >
              <div>{sub_category.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
