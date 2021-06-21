import { getUserCoupons } from '@api';
import EmptyList from '@components/shared/EmptyList';
import { UserCouponModel } from '@constants';
import CouponItem from '@pages/user_coupons/CouponItem';
import { toast } from '@utils';
import { Navbar, Page, Preloader } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';

interface CouponPickerProps {
  f7route: any;
  f7router: any;
  pickCoupon: (coupon: UserCouponModel) => void;
  price: number;
}
const CouponPicker: React.FC<CouponPickerProps> = (props) => {
  const { pickCoupon, price, f7router } = props;
  const { data: coupons } = useQuery('coupons', async () => {
    const response = await getUserCoupons({ q: { expires_at_gt: Date.now() } });
    return response.data;
  });

  const clickHandler = (userCoupon: UserCouponModel) => (e: React.MouseEvent) => {
    if (userCoupon.coupon.minimum_order_price > price) {
      toast.get().setToastText('최소주문금액 조건에 맞지 않아요').openToast();
    } else {
      pickCoupon(userCoupon);
      f7router.back();
    }
  };

  return (
    <Page>
      <Navbar title="쿠폰 선택" backLink />
      {coupons?.length === 0 ? (
        <Preloader />
      ) : coupons?.length === 0 ? (
        <EmptyList text="가지고 있는 쿠폰이 없어요" />
      ) : (
        <div className="m-6">
          {coupons?.map((userCoupon) => (
            <a onClick={clickHandler(userCoupon)}>
              <CouponItem key={userCoupon.id} coupon={userCoupon.coupon} disabled={userCoupon.coupon.minimum_order_price > price} />
            </a>
          ))}
        </div>
      )}
    </Page>
  );
};

export default CouponPicker;
