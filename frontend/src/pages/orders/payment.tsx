import { cartState } from '@atoms';
import Divider from '@components/shared/Divider';
import { configs } from '@config';
import { UserCouponModel } from '@constants';
import useAuth from '@hooks/useAuth';
import { loadTossPayments } from '@tosspayments/sdk';
import { currency } from '@utils/helpers';
import { Formik, FormikHelpers } from 'formik';
import { utils } from 'framework7';
import { Block, BlockTitle, Button, Col, f7, List, ListInput, ListItem, Navbar, Page, Row } from 'framework7-react';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';

interface FormValues {
  say_to_owner: string;
  say_to_teacher: string;
  buyer_tel: string;
  used_point: number;
}

const OrderPayment = ({ f7route, f7router }) => {
  const { currentUser } = useAuth();
  const { line_items: cartList, order_number: orderNumber } = useRecoilValue(cartState);
  const clientKey = configs.toss_client_key;
  const tossPayments = loadTossPayments(clientKey);

  // Methods
  const totalPrice = () => cartList.map((lineItem) => Math.floor(lineItem.lecture.price)).reduce((a, b) => a + b);
  const finalPrice = (values?: FormValues) =>
    Math.max(0, totalPrice() - (values?.used_point ?? 0) - (userCoupon?.coupon?.discount_price ?? 0));
  const getOrderName = () => {
    let cartListLength = cartList.length;
    let initialName = cartList[0].lecture?.title;
    let name = cartListLength === 1 ? initialName : `${initialName}외 ${cartListLength - 1}건`;
    return name;
  };
  const wholePointUsed = () => {};

  const orderSchema = Yup.object().shape({
    say_to_owner: Yup.string().required('필수 입력사항입니다.'),
    say_to_teacher: Yup.string().required('필수 입력사항입니다.'),
    buyer_tel: Yup.string().required('필수 입력사항입니다.'),
    used_point: Yup.number()
      .moreThan(-1, '현재 포인트를 확인해주세요')
      .lessThan(currentUser.point + 1, '현재 포인트를 확인해주세요'),
  });

  // 쿠폰
  const [userCoupon, setUserCoupon] = useState<UserCouponModel>(null);
  const pickCoupon = (coupon: UserCouponModel) => setUserCoupon(coupon);
  const gotoCouponPicker = () => {
    f7router.navigate('/orders/list_picker', { props: { pickCoupon, price: totalPrice() } });
  };

  const initialValues: FormValues = { say_to_owner: '', say_to_teacher: '', buyer_tel: '', used_point: 0 };
  const onFormSubmit = async (values: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    try {
      (await tossPayments).requestPayment('카드', {
        amount: finalPrice(values),
        orderId: orderNumber,
        orderName: getOrderName(),
        successUrl: `${configs.service_url}?result=success&${utils.serializeObject(values)}`,
        failUrl: `${configs.service_url}?result=fail&${utils.serializeObject(values)}`,
      });
    } catch (error) {
      f7.dialog.alert('정보를 확인 해주세요. ');
      setSubmitting(false);
    }
  };

  return (
    <Page noToolbar>
      <Navbar title="결제하기" backLink />
      <Formik
        initialValues={initialValues}
        validationSchema={orderSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => onFormSubmit(values, setSubmitting)}
        validateOnMount
      >
        {({
          values,
          isSubmitting,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
          setFieldValue,
        }) => (
          <form className="order-form" onSubmit={handleSubmit}>
            <BlockTitle>주문정보 입력</BlockTitle>
            <Block>
              <List noHairlinesMd>
                <ListInput
                  outline
                  type="text"
                  clearButton
                  label="원장님께"
                  id="sayToOwner"
                  name="say_to_owner"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.say_to_owner}
                  placeholder="원장님께 보낼 메시지를 적어주세요"
                  errorMessageForce
                  errorMessage={touched.say_to_owner && errors.say_to_owner}
                />
                <ListInput
                  outline
                  type="text"
                  clearButton
                  label="선생님께"
                  id="sayToTeacher"
                  name="say_to_teacher"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.say_to_teacher}
                  placeholder="선생님께 보낼 메시지를 적어주세요"
                  errorMessageForce
                  errorMessage={touched.say_to_teacher && errors.say_to_teacher}
                />
                <ListInput
                  outline
                  type="text"
                  clearButton
                  label="전화번호"
                  id="buyerTel"
                  name="buyer_tel"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.buyer_tel}
                  placeholder="전화번호를 적어주세요"
                  errorMessageForce
                  errorMessage={touched.buyer_tel && errors.buyer_tel}
                />
              </List>
            </Block>
            <Divider />
            <BlockTitle>쿠폰 사용</BlockTitle>
            <Block>
              <List>
                <ListInput
                  outline
                  name="페이지 전환"
                  value={userCoupon?.coupon?.name ?? '쿠폰 선택'}
                  readonly
                  id="pg"
                  onFocus={gotoCouponPicker}
                />
              </List>
            </Block>
            <Divider />
            <BlockTitle>포인트 사용</BlockTitle>
            <Block className="order-form-point">
              <Row className="items-center mb-3 order-form-point__current-point">
                <Col width="35" className="flex justify-between">
                  보유
                  <Button fill onClick={() => setFieldValue('used_point', currentUser.point)}>
                    전액사용
                  </Button>
                </Col>
                <Col width="50" className="text-left order-form-point__current-point--value">
                  {currentUser.point}
                </Col>
              </Row>
              <Row className="items-center mb-3 order-form-point__used">
                <Col width="35">사용</Col>
                <Col width="50">
                  <List className="order-form-point__used--list">
                    <ListInput
                      outline
                      type="number"
                      id="used_point"
                      name="used_point"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.used_point}
                      className="order-form-point__used--list-value"
                      placeholder="0"
                      errorMessageForce
                      errorMessage={touched.used_point && errors.used_point}
                    />
                  </List>
                </Col>
              </Row>
            </Block>
            <Divider />
            <BlockTitle>결제금액</BlockTitle>
            <List>
              {cartList?.map((line_item, index) => (
                <ListItem
                  key={index}
                  header={line_item.lecture.category.title}
                  title={line_item.lecture.title}
                  footer={line_item.lecture.school.name}
                  after={`${currency(line_item.lecture.price)}원`}
                />
              ))}
            </List>
            <List>
              <ListItem title="포인트 사용금액" after={`${currency(values.used_point)}원`} />
            </List>
            {userCoupon && (
              <List>
                <ListItem title="쿠폰 할인금액" after={`${currency(userCoupon.coupon.discount_price)}원`} />
              </List>
            )}
            <List>
              <ListItem title="총 주문 금액" after={`${currency(finalPrice(values))}원`} />
            </List>
            <Divider />
            <BlockTitle>결제 수단</BlockTitle>
            <Block>
              <List>
                <ListInput outline name="결제수단" value="카드결제" readonly id="pg" />
              </List>
              위 주문 내역을 확인 하였으며, 결제에 동의합니다.
            </Block>
            <input
              type="submit"
              className={`button button-fill button-large ${isSubmitting ? 'disabled' : ''}`}
              style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', width: '92%', zIndex: 9999 }}
              value="결제하기"
            />
          </form>
        )}
      </Formik>
    </Page>
  );
};

export default OrderPayment;
