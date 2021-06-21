import EmptyList from '@components/shared/EmptyList';
import { Block, Button, Col, List, ListButton, ListItem, Popup, Preloader, Row, Searchbar } from 'framework7-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getSchoolsWithoutToken } from '../../../common/api';

const SchoolSelectPopup = (props) => {
  const { setSchool } = props
  const [term, setTerm] = useState("")
  const { data: schools, isLoading, isError, error, refetch } = useQuery(["schools"], async () => {
    const response = await getSchoolsWithoutToken({ q: { name_cont: term } })
    return response.data
  })

  const debouncedRefetch = useMemo((interval = 400) => {
    var timerId = null
    return () => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        refetch()
        timerId = null
      }, interval)
    }
  }, [])

  const inputHandler = e => {
    setTerm(e.target.value)
    debouncedRefetch()
  }

  return <Popup swipeToClose className="school-select-popup">
    <Row className="margin">
      <Col width={80}></Col>
      <Col width={20}><Button popupClose large>닫기</Button></Col>
    </Row>
    <Searchbar
      className="searchbar-inline margin"
      searchContainer=".search-list"
      searchIn=".item-title"
      disableButton={false}
      value={term}
      onInput={inputHandler}
    ></Searchbar>
    <List>
      {
        isLoading ? <Preloader /> :
          isError ? <Block>{error['message']}</Block> :
            schools.length === 0 ? <EmptyList text="검색된 학원이 없어요!"/> :
              schools.map(school =>
                <ListItem key={school.id} popupClose onClick={setSchool(school)} link title={school.name} />
              )
      }
    </List>
  </Popup>
}

export default SchoolSelectPopup;
