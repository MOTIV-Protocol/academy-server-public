import React, { useEffect } from 'react';
import { f7ready, Page } from 'framework7-react';
import HomeNavbar from '../../components/shared/HomeNavbar';

const UserOwner = (props) => {

  useEffect( () => {
    f7ready( f7 => {
      // f7.views.current.router.navigate("/schools/owner")
    })
  }, [])

  return (
    <Page>
      <HomeNavbar title="홈" slot="fixed" />
      원장님 전용 메인페이지입니다.
    </Page>
  )
}

export default UserOwner;
