import { AccordionContent, Block, Button, f7, List, ListItem, Navbar, Page, Preloader, Row, Searchbar, Segmented } from "framework7-react";
import React, { useEffect, useState } from 'react';
import { useMemo } from "react";
import { useQuery } from "react-query";
import { getFaqs } from "../../common/api";

const FaqIndex = () => {
  const classifications = useMemo(() => [
    [
      { title: "회원가입", value: "to_register" },
      { title: "바로결제", value: "to_order" },
      { title: "리뷰관리", value: "to_review" },
    ], [
      { title: "이용문의", value: "to_use" },
      { title: "불편문의", value: "to_complain" },
      { title: "기타", value: "etc" },
    ]
  ], [])

  const [state, setState] = useState({
    classification: null,
    searchTerm: ""
  })
  const { classification, searchTerm } = state
  const { data: faqs, isLoading, isError, error, refetch } = useQuery(["faqs"], async () => {
    const response = await getFaqs()
    return response.data || []
  })

  const loadMore = async (done = null) => {
    await refetch()
    if (done) done();
  }

  const classificationHandler = (value) => () => {
    setState(state => ({
      ...state,
      classification: state.classification !== value ? value : null
    }))
  }

  const searchTermHandler = (e) => {
    setState(state => ({
      ...state,
      searchTerm: e.target.value
    }))
  }

  return (
    <Page noToolbar ptr ptrPreloader onPtrRefresh={loadMore}>
      <Navbar backLink title="자주 묻는 질문" slot="fixed" />

      <Searchbar placeholder="질문 검색하기" clearButton={true} disableButton={false}
        value={searchTerm} onInput={searchTermHandler} />

      {classifications.map((row, index) =>
        <Row className="margin" key={index}>
          {row.map(({ title, value }, index) =>
            <Button key={index} className="col-33" large onClick={classificationHandler(value)}
              fill={value === classification}>{title}</Button>
          )}
        </Row>
      )}

      <List accordionList>
        {
          isLoading ? <Preloader /> :
            isError ? <Block>{error['message']}</Block> :
              faqs
                .filter(each => classification ? each.classification === classification : true)
                .filter(each => searchTerm.length > 0 ? each.title.includes(searchTerm) : true)
                .map(faq =>
                  <ListItem key={faq.id} accordionItem title={faq.title}>
                    <AccordionContent>
                      <Block>
                        <p>{faq.content}</p>
                      </Block>
                    </AccordionContent>
                  </ListItem>
                )
        }
      </List>
    </Page>
  )
}

export default FaqIndex
