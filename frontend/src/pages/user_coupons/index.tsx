import React from 'react';
import { Page, Navbar, Button, Block } from 'framework7-react';
import { Formik, FormikHelpers } from 'formik';
import CouponItem from './CouponItem';
import { useQuery, useQueryClient } from 'react-query';
import { getUserCoupons, postUserCoupons } from '@api';
import EmptyList from '@components/shared/EmptyList';
import * as Yup from 'yup';
import { f7, List, ListInput, Row, Col } from 'framework7-react';
import { errorSelector } from 'recoil';

interface FormValues { 
  coupon_number: string;
}

const couponNumberSchema = Yup.object().shape({
  coupon_number: Yup.string()
    .min(4, '길이가 너무 짧습니다.')
    .max(20, '길이가 너무 깁니다.')
    .required('필수 입력사항 입니다.')
})

const CouponIndex = () => {
  const queryClient = useQueryClient();
  
  const { data: coupons, refetch } = useQuery('coupons', async () => {
    const response = getUserCoupons({ q: { expires_at_gt: Date.now() } });
    return (await response).data;
  });

  const initialValues: FormValues = { coupon_number: "" };

  const onFormSubmit = async (params: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    try {
      const response = await postUserCoupons({user_coupon: { ...params }});
      if(response.data?.error) {
        f7.dialog.alert(`${response.data.error}`);
      } else {
        queryClient.removeQueries('orders');
        await refetch();
        f7.dialog.alert('쿠폰이 추가되었습니다.');
      }
    } catch (error) {
      f7.dialog.alert('정보를 확인 해주세요.');
    }
  };

  return (
    <Page noToolbar>
      <Navbar title="쿠폰함" backLink slot="fixed" />
      <div className="list no-hairlines block margin-top">
        <Formik
          initialValues={initialValues}
          validationSchema={couponNumberSchema}
          onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => onFormSubmit(values, setSubmitting)}
          validateOnMount>
          {({ values, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <List className="no-hairlines-md">
                <ul>
                  <Row className="mb-2">
                    <div>쿠폰등록</div>
                  </Row>
                  <Row>
                    <Col width="80">
                      <ListInput
                        name="coupon_number"
                        type="string"
                        placeholder="쿠폰번호를 입력해주세요."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.coupon_number}
                        className="border-b border-gray-300 pl-0"
                        inputStyle={{"width": "100%", "fontSize": "larger", "marginTop": "0.4em", "marginLeft": "calc((var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-left) - var(--menu-list-offset)) / -1)"}}
                      />
                    </Col>
                    <Col width="20">
                      <li className="item-content justify-content-center no-padding">
                        <input
                          type="submit"
                          className={`button button-fill button-large ${isSubmitting ? 'disabled' : ''}`}
                          value="등록"
                        />
                      </li>
                    </Col>
                  </Row>
                  <Row>
                    <div className="text-red-500 text-sm mt-1">{touched.coupon_number && errors.coupon_number}</div>
                  </Row>
                </ul>
              </List>
            </form>
          )}
        </Formik>
      </div>
      {coupons?.length === 0 ? (
        <EmptyList text="사용가능한 쿠폰이 없어요." style={{"height": "80%"}}/>
      ) : (
        <div className="mx-4">
          {coupons?.map((user_coupon) => (
            <CouponItem key={user_coupon.id} coupon={user_coupon.coupon} />
          ))}
        </div>
      )}
    </Page>
  );
};

export default CouponIndex;
