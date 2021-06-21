import React, { useEffect, useState } from 'react';
import { Page, Navbar, f7, f7ready } from 'framework7-react';
import { getNotice } from '../../common/api'; 


export default ({f7route}) =>{
  const [notice, setNotice] = useState(false);
  let {id} = f7route.params;

  useEffect(() => {
    f7ready(async () => {
      const response = await getNotice(id)
      setNotice(response.data)
    })
  }, [])

  return (
    <Page noToolbar>
      <Navbar backLink title="공지사항" slot="fixed"/>
      {/* <basic-navbar title="공지사항" /> */}
      <div className="container margin-vertical">
        {notice ? (
          <div className="content-box">
            <h3> {notice.title} </h3>
            <div className="small text-color-gray margin-bottom"> {notice.created_at} </div>
            {simpleFormat(notice.body)}
          </div>
        ) : (
          <div className="content-box skeleton-block">
            <h3> ______ </h3>
            <div className="small text-color-gray margin-bottom"> _______ </div>
            __
          </div>
        )}
      </div>
    </Page>
  )
}