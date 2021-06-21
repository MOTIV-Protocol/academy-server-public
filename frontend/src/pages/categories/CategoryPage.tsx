import EmptyList from '@components/shared/EmptyList';
import { Block, List, ListItem, PageContent } from 'framework7-react';
import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { getSchools } from '../../common/api';
import { SortType } from '../schools/constants';
import SchoolItem from '../schools/SchoolItem';

const CategoryPage = (props) => {
  const { category, subCategoryFilter, sortType, active = false, initialActive = false } = props;

  const getFilterList = (subCategoryFilter) =>
    subCategoryFilter.length > 0
      ? [
          ...subCategoryFilter
            .map((subCategory) => subCategory.id)
            .filter((id) => category.children.find((subCategory) => subCategory.id === id)),
        ]
      : [category.id, ...category?.children.map((sub_category) => sub_category.id)];

  const { data, isError, error, fetchNextPage, isLoading, refetch } = useInfiniteQuery(
    ['schools', category.id, sortType, subCategoryFilter],
    async ({ pageParam: page = 1 }) => {
      const lectures_category_id_in = getFilterList(subCategoryFilter);
      const s =
        sortType === SortType.LIKE
          ? 'like_count desc'
          : sortType === SortType.ORDER
          ? 'order_count desc'
          : sortType === SortType.SCORE
          ? 'average_score desc'
          : undefined;
      const response = await getSchools({
        page,
        sort_type: sortType,
        q: {
          lectures_category_id_in,
          lectures_start_at_gteq: Date(),
          s,
        },
      });
      return response.data;
    },
    {
      enabled: active,
      getNextPageParam: (lastPage, pages) => (pages ? pages.length + 1 : 1),
    },
  );

  const loadMore = () => {
    if (!isLoading && data?.pages?.slice(-1)[0].length > 0) fetchNextPage();
  };

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  return (
    <PageContent
      id={`tab-${category.position}`}
      infinite
      infiniteDistance={50}
      infinitePreloader={isLoading}
      onInfinite={loadMore}
      onTabShow={loadMore}
      tab
      ptr
      ptrPreloader
      onPtrRefresh={reload}
      tabActive={initialActive}
    >
      {!isLoading && isError ? (
        <Block>{error['message']}</Block>
      ) : data?.pages?.flat()?.length === 0 ? (
        <EmptyList text="해당 학원이 검색되지 않아요!" />
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
  );
};

export default CategoryPage;
