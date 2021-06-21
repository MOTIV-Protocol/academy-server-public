import React from 'react';
import { Page, Navbar, Button, Block } from 'framework7-react';
// import CouponItem from './CouponItem';
import { useQuery } from 'react-query';
import { getCoupons } from '@api';
import EmptyList from '@components/shared/EmptyList';

const CouponIndex = () => {
  const { data: coupons } = useQuery('coupons', async () => {
    const response = getCoupons({ q: { expires_at_gt: Date() } });
    return (await response).data;
  });

  return (
    <Page noToolbar>
      <Navbar title="쿠폰함" backLink slot="fixed" />
      {/* <Button fill className="margin">
        쿠폰 등록하기
      </Button> */}
      <div className="text-lg font-bold m-4">보유쿠폰 {coupons?.length}장</div>
      {coupons?.length === 0 ? (
        <EmptyList text="사용가능한 쿠폰이 없어요." />
      ) : (
        <div className="mx-4">
          {coupons?.map((coupon) => (
            <CouponItem key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </Page>
  );
};

export default CouponIndex;
