import React, { useState, useEffect } from 'react';
import { Block, BlockTitle, Row, Col, List, Link, ListItem, Navbar, Page } from 'framework7-react';
import { OrderModel } from '@constants';
import { useSetRecoilState } from 'recoil';
import { getOrder } from '@api';
import { cartState } from '@atoms';
import { currency } from '@utils/helpers';

const OrderShow = (props) => {
  const setCartState = useSetRecoilState(cartState);
  const {id, f7route} = props

  const [state, setState] = useState({
    loading: true,
    order: {} as OrderModel
  });

  const { loading, order } = state

  const dictionary = {
    ready: "결제 대기 중",
    paid: "결제 완료",
    complete: "등록 완료",
    canceled: "취소",
  }

  const payMethodDict = {
    kakao: "카카오페이",
    card: "카드"
  }

  useEffect(() => {
    const onInit = async () => {
      const response = await getOrder(id)
      const order = response.data
      if(f7route.query?.complete){
        setCartState((state) => ({ ...state, visible: false }));
      }
      setState(state => ({loading: true, order}))
    }
    onInit()
  }, [])

  return (
    <Page noToolbar>
      <Navbar title="주문 상세보기" backLink/>
      <Block>
          <h1>상세 주문 내역</h1>
          
          <Row>
            <Col width="33" className="text-xl font-semibold">결제상태</Col>
            <Col width="66" className="text-xl font-semibold">{dictionary[order?.status]}</Col>
          </Row>
          
          <Row>
            <Col width="33" className="text-xl font-semibold">결제방법</Col>
            <Col width="66" className="text-xl font-semibold">{payMethodDict[order?.pay_method]}</Col>
          </Row>

          <Row>
            <Col width="50">
              <Link href={`tel:${order?.school?.phone}`} className="button button-fill external" text="전화"/>
            </Col>            
            <Col width="50">
              <Link className="button button-fill" text="학원보기" href={`/schools/${order?.school?.id}`} />
            </Col>
          </Row>
          
          <BlockTitle>결제금액</BlockTitle>
          <List>
            { order?.line_items?.map( line_item => 
              <ListItem 
                key={line_item?.id} 
                header={line_item?.lecture?.category?.title} 
                title={line_item?.lecture?.title} 
                footer={line_item?.lecture?.school?.name} 
                after={`${currency(line_item?.price)}원`}>
                {/* after의 클래스에 margin-right가 들어가야 하는데... */}
              </ListItem>
            )}
            { order?.used_point !== 0 && (
              <li>
                <div className="item-content">
                  <div className="item-inner display-flex flex-direction-row font-semibold">
                    <div>포인트 사용 금액</div>
                    <div className="item-after font-semibold">{currency(order.used_point)}원</div>
                  </div>
                </div>
              </li>
            )}
            <li>
              <div className="item-content">
                <div className="item-inner display-flex flex-direction-row font-semibold">
                  <div>총 주문 금액</div>
                  <div className="item-after font-semibold">{currency(order.amount)}원</div>
                </div>
              </div>
            </li>
          </List>
          
          <BlockTitle>학원 주소</BlockTitle>
          <Block>{order?.school?.business_address}</Block>
          
          <BlockTitle>학원 전화번호</BlockTitle>
          <Block>{order?.school?.phone}</Block>
          
          <BlockTitle>원장님께</BlockTitle>
          <Block>{order?.say_to_owner}</Block>
          
          <BlockTitle>강사님께</BlockTitle>
          <Block>{order?.say_to_teacher}</Block>
          
        </Block>
    </Page>
  )
}

export default OrderShow;
