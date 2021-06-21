import { CouponModel } from '@constants';
import { currency, dateToText } from '@utils/helpers';
import React from 'react';

interface CouponItemProps {
  coupon: CouponModel;
  disabled?: boolean;
}
const CouponItem: React.FC<CouponItemProps> = (props) => {
  const { coupon, disabled = false } = props;

  return (
    <div className={disabled ? 'coupon-item--disabled' : 'coupon-item'}>
      <div className="coupon-item__price">{currency(coupon.discount_price)}원</div>
      <div className="coupon-item__title">{coupon.name}</div>
      <div className="coupon-item__minimum">최소주문금액 {currency(coupon.minimum_order_price)}원</div>
      <div className="coupon-item__date">{dateToText(coupon?.expires_at as string)} 만료</div>
    </div>
  );
};

export default CouponItem;
