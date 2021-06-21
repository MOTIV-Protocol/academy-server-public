import { Button, Col, Page, PageContent, Row, Swiper, SwiperSlide } from 'framework7-react';
import _ from 'lodash';
import React from 'react';
import sanitizeHtml from '../js/utils/sanitizeHtml';

const IntroPage = (props) => {
  let images = ['couple', 'segment', 'chilling', 'choose', 'chatting', 'confirmed', 'agreement', 'grades', 'brainstorming', 'hiring', 'love', 'messages1', 'development', 'team', 'together', 'space', 'mobile', 'website', 'easter', 'romantic', 'tasting', 'drone', 'coding', 'mindfulness', 'artificial', 'celebration', 'virtual', 'doggy', 'static', 'data', 'sleep', 'force', 'makeup', 'bicycle', 'podcast', 'fishing', 'credit', 'workout', 'pilates', 'group', 'mouth', 'school']
  let slides =  _.zip(_.sampleSize(images, 3), ["인썸니아의 사전 구축 기능<br/>시연용 앱입니다", "사전 구축 기능을 선택하면", "이미 구현된 기능을 활용해<br/>개발 비용이 절감됩니다"])
  return (
    <Page pageContent={false}>
      <PageContent className="display-flex no-padding-top">
        <div className="fixed-bottom fixed-bottom-large">
          <Row>
            <Col>
              <Button outline large href="/users/sign_in" >로그인</Button>
            </Col>
            <Col>
              <Button outline large href="/users/sign_up" fill>회원가입</Button>
            </Col>
          </Row>
        </div>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{height: '100%', backgroundColor: '#eee'}}
          pagination={{el: '.swiper-pagination', clickable: true }}
        >
          <div className="swiper-pagination" style={{bottom: '70px'}}></div>
          {slides.map( (item, index) => 
            <SwiperSlide key={index} className='content text-align-center'>
              <div className="display-flex justify-content-center" style={{height: '50%'}}>
                <img src={`https://insomenia.com/svgs/${item[0]}`} alt="" style={{maxWidth: '80%', maxHeight: '80%', marginTop: '30%'}}/>
              </div>
              <h4 className="" style={{marginTop: '100px', lineHeight: '1.3em'}}><strong className="title">{sanitizeHtml(item[1],{className: "text-lg text-center pt-4"})}</strong></h4>
            </SwiperSlide>
          )}
        </Swiper>
      </PageContent>
    </Page>
  )
}
export default IntroPage