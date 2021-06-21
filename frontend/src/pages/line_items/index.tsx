import { destroyLineItems, getCart } from "@api";
import { cartState } from "@atoms";
import EmptyList from "@components/shared/EmptyList";
import { toast } from "@utils";
import { Block, Navbar, Page, Link } from "framework7-react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import LectureItem from "../lectures/LectureItem";

const LineItemIndex = ({ f7router }) => {
  const [{line_items: cartList}, setCartState] = useRecoilState(cartState)
  
  const removeLineItem = (lineItemId) => async () => {
    const isBlank = await destroyLineItems(lineItemId);
    await getCart().then(({data}) => setCartState( state => ({...state, ...data })))
    if (isBlank.data === "blank") {
      await f7router.back({force: true})
    }
    toast.get().setToastText("장바구니에서 꺼냈어요").openIconToast("cart_fill_badge_minus")
  };

  useEffect(() => {
    setCartState((state) => ({ ...state, visible: false }));
    return () => setCartState((state) => ({ ...state, visible: true }));
  }, []);

  return (
    <Page noToolbar>
      <Navbar slot="fixed" title="장바구니" backLink />
      {cartList?.length === 0 ? <EmptyList text="장바구니가 비어있어요!"/> : (
        <Block>
          {cartList?.map(({ id, lecture }) => (
            <LectureItem key={id} lecture={lecture} remove={removeLineItem(id)} />
          ))}
        </Block>
      )}
      <Link
        href="/orders/payment"
        className="button button-fill button-large"
        style={{ position: "fixed", bottom: "16px", left: "16px", right: "16px", zIndex: 1 }}
      >
        결제하러가기
      </Link>
    </Page>
  );
};

export default LineItemIndex;
