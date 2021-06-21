import { getCategories } from "@api";
import { CategoryModel } from "@constants";
import { Button, Link, Navbar, Page, Tabs, Toolbar } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import CategoryPage from "../categories/CategoryPage";
import { SortName, SortType } from "./constants";
import FilterPopup from "./FilterPopup";
import SortSheet from "./SortSheet";

const SchoolInedx = (props) => {
  const pageEl = useRef<HTMLElement>();

  const {data: categories} = useQuery<CategoryModel[]>(["categories"], async () => {
    const response = await getCategories();
    return response.data || []
  })

  const { category_id = categories[0].id } = props.f7route.query;
  const [state, setState] = useState({
    currentCategory: categories.find(each => each.id === parseInt(category_id)),
    subCategoryFilter: [],
    sortType: SortType.DEFAULT,
  });

  const setCurrentCategory = (currentCategory) => () =>
    setState((state) => {
      focusOnActive("smooth", currentCategory);
      return { ...state, currentCategory };
    });
  const addSubCategory = (subCategory) => {
    setState((state) => {
      if (state.subCategoryFilter.find((each) => each.id === subCategory.id)) return state;
      return { ...state, subCategoryFilter: [...state.subCategoryFilter, subCategory] };
    });
  };
  const removeSubCategory = (subCategory) => () => {
    setState((state) => {
      const subCategoryFilter = [...state.subCategoryFilter];
      const index = subCategoryFilter.findIndex((each) => each.id === subCategory.id);
      if (index < 0) return state;
      subCategoryFilter.splice(index, 1);
      return { ...state, subCategoryFilter };
    });
  };

  // tab-link-active가 화면 정중앙에 오도록 해주는 함수
  const focusOnActive = (behavior = "smooth", category = null) => {
    if (category === null) category = state.currentCategory
    const tabLink = pageEl.current?.el?.querySelector(`#tab-link-${category.position}`);
    tabLink?.scrollIntoView({
      behavior,
      inline: "center",
      block: "nearest",
    });
  };
  const setSortType = (sortType) => setState((state) => ({ ...state, sortType }));

  useEffect(() => {
    setTimeout(() => focusOnActive(), 300); // 0.3초 딜레이를 주지않으면 F7 PageIn 애니메이션이 씹힙니다.. 일단 이렇게 조치했습니다.
  }, [state.currentCategory]);

  return (
    <Page ref={pageEl} pageContent={false} tabs>
      <Navbar title="분류" backLink />
      <Toolbar top scrollable tabbar>
        {categories.map((category) => (
          <Link key={category.id} tab tabLink={`#tab-${category.position}`} tabLinkActive={category.id === state.currentCategory.id}
            id={`tab-link-${category.position}`} onClick={setCurrentCategory(category)} >
            {category.title}
          </Link>
        ))}
        <div className="category__filter" slot="after-inner">
          <SortSheet sortType={state.sortType} setSortType={setSortType} />
          <FilterPopup subCategories={state.currentCategory.children} addSubCategory={addSubCategory} />

          <Button link sheetOpen=".sort-sheet" className="category__filter--sort">{SortName[state.sortType]}</Button>
          {state.currentCategory?.children?.length > 0 && (
            <Button link popupOpen=".filter-popup" className="category__filter--filter">필터</Button>
          )}
          {state.subCategoryFilter
            ?.filter(subCategory => state.currentCategory.children.find(each => each.id === subCategory.id))
            ?.map((subCategory) => (
              <Button key={subCategory.id} className="category__filter--sub-category"
                onClick={removeSubCategory(subCategory)}>
                {subCategory.title}
              </Button>
            ))}
        </div>
      </Toolbar>

      {/* <!-- 탭 페이지 --> */}
      <Tabs swipeable className="category__tabs">
        {categories.map(category => (
          <CategoryPage key={category.id} category={category} subCategoryFilter={state.subCategoryFilter} sortType={state.sortType}
            active={state.currentCategory.id === category.id}
            initialActive={parseInt(category_id) === category.id}/>
        ))}
      </Tabs>
    </Page>
  );
};

export default SchoolInedx;
