import EmptyList from '@components/shared/EmptyList';
import { CategoryModel } from '@constants';
import { getDevice } from 'framework7';
import { Block, Button, List, ListItem, Navbar, Page, PageContent, Searchbar, Toolbar } from 'framework7-react';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { getCategories, getSchools } from '../../common/api';
import { SortName, SortType } from '../schools/constants';
import SchoolItem from '../schools/SchoolItem';
import FilterPopup from './FilterPopup';
import SortSheet from './SortSheet';

const SchoolSearch: React.FC = () => {
  const { data: categories } = useQuery<CategoryModel[]>(
    ['categories'],
    async () => {
      const response = await getCategories();
      return response.data || [];
    },
    { placeholderData: [] },
  );

  const [state, setState] = useState({
    categoryFilter: [] as CategoryModel[],
    sortType: SortType.DEFAULT,
    term: '',
  });

  const getFilterList = (categoryFilter: CategoryModel[]) =>
    categoryFilter.flatMap((category) => [
      category.id,
      ...(category.children?.map((subCategory) => subCategory.id) ?? [category.id]),
    ]);

  const { data, isError, error, fetchNextPage, isLoading } = useInfiniteQuery(
    ['schools', { term: state.term, categoryFilter: state.categoryFilter, sortType: state.sortType }],
    async ({ pageParam: page = 1 }) => {
      const lectures_category_id_in =
        state.categoryFilter?.length > 0 ? getFilterList(state.categoryFilter) : undefined;
      const s =
        state.sortType === SortType.LIKE
          ? 'like_count desc'
          : state.sortType === SortType.ORDER
          ? 'order_count desc'
          : state.sortType === SortType.SCORE
          ? 'average_score desc'
          : undefined;
      const response = await getSchools({
        page,
        sort_type: state.sortType,
        q: {
          name_cont: state.term?.length > 0 ? state.term : undefined,
          lectures_category_id_in,
          lectures_start_at_gteq: Date(),
          s,
        },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage, pages) => (pages ? pages.length + 1 : 1),
    },
  );

  const loadMore = () => {
    if (!isLoading && data?.pages?.slice(-1)[0].length > 0) fetchNextPage();
  };

  const setSortType = (sortType: number) => {
    setState((state) => ({ ...state, sortType }));
  };
  const addCategoryToFilter = (category: CategoryModel) => {
    setState((state) => ({
      ...state,
      categoryFilter: [...state.categoryFilter.filter((each) => each.id !== category.id), category],
    }));
  };
  const removeSubCategory = (category: CategoryModel) => () => {
    setState((state) => ({
      ...state,
      categoryFilter: [...state.categoryFilter.filter((each) => each.id !== category.id)],
    }));
  };

  const termChangeHandler = debounce((e) => {
    setState((state) => ({ ...state, term: e.target.value }));
  }, 400);

  return (
    <Page infinite infinitePreloader={isLoading} infiniteDistance={50} onInfinite={loadMore} pageContent={false}>
      <Navbar backLink title="학원 검색" />
      <Toolbar top scrollable tabbar>
        <Searchbar
          onChange={termChangeHandler}
          onClickClear={termChangeHandler}
          onClickDisable={termChangeHandler}
        ></Searchbar>
        <div className="category__filter" slot="after-inner">
          <SortSheet sortType={state.sortType} setSortType={setSortType} />
          <FilterPopup subCategories={categories} addSubCategory={addCategoryToFilter} />

          <div className="flex-1 flex flex-row space-x-1">
            <Button sheetOpen=".sort-sheet" className="category__filter--sort">
              {SortName[state.sortType]}
            </Button>
            <Button popupOpen=".filter-popup" className="category__filter--filter">
              필터
            </Button>
            {state.categoryFilter
              ?.filter((subCategory) => state.categoryFilter.find((each) => each.id === subCategory.id))
              ?.map((subCategory) => (
                <Button
                  key={subCategory.id}
                  className="category__filter--sub-category"
                  onClick={removeSubCategory(subCategory)}
                >
                  {subCategory.title}
                </Button>
              ))}
          </div>
        </div>
      </Toolbar>

      <PageContent>
        <div style={{ height: 44 }}></div>
        {!isLoading && isError ? (
          <Block>{error['message']}</Block>
        ) : data?.pages?.flat()?.length === 0 ? (
          <EmptyList text="해당 조건으로 학원이 검색되지 않아요!" />
        ) : (
          <List noChevron noHairlines mediaList className="no-margin">
            {data?.pages?.flat()?.map((school) => (
              <ListItem key={school.id} link={`/schools/${school.id}`}>
                <SchoolItem school={school} />
              </ListItem>
            ))}
          </List>
        )}
      </PageContent>
    </Page>
  );
};

export default SchoolSearch;
