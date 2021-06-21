import React from 'react';
import { useQuery } from 'react-query';
import { CategoryModel } from '@constants';
import { getCategories } from '@api';
import CategoriesGridSkeleton from './skeleton/CategoriesGridSkeleton';
import { imagePath } from '@utils/helpers';

const CategoriesGrid = () => {
  const {data: categories, isLoading, isError, error} = useQuery<CategoryModel[]>(["categories"], async () => {
    const response = await getCategories();
    return response.data || []
  })

  return <div className="row margin-top m-3">
    { isLoading ? <CategoriesGridSkeleton/> : 
    categories.map(category =>
      <div key={category.id} className="col-25 text-align-center margin-top-half">
        <div className="content-box no-padding padding-vertical-half">
          <a href={`/schools?category_id=${category.id}`}>
            <img src={imagePath(category)} style={{width: "40%", margin: "0 auto"}} />
            <small>{category.title}</small>
          </a>
        </div>
      </div>
    )}
  </div>
}

export default CategoriesGrid;
