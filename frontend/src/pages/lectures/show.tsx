import { cartState } from '@atoms';
import { userSelector } from '@selectors';
import { toast } from '@utils';
import { currency } from '@utils/helpers';
import { Page, Navbar, Block, Button, SwiperSlide, Swiper, Preloader, f7, NavRight } from 'framework7-react';
import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { api_url, postLineItems, destroyLineItems, getLecture, getCart } from '../../common/api';

const LectureShow = (props) => {
  const user = useRecoilValue(userSelector);
  const [{ line_items: cartList }, setCartState] = useRecoilState(cartState);
  const { id: lectureId } = props;

  const {
    data: lecture,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(['lecture', lectureId], async () => {
    const response = await getLecture(lectureId);
    return response.data;
  });

  const addLectureToCart = async () => {
    const execute = async () => {
      f7.preloader.show();
      await postLineItems({ line_item: { lecture_id: lectureId } });
      await getCart().then(({ data }) => setCartState((state) => ({ ...state, ...data })));
      f7.preloader.hide();
      toast.get().setToastText('장바구니에 담았어요').openIconToast('cart_fill_badge_plus');
    };

    f7.preloader.show();
    await getCart().then(({ data }) => setCartState((state) => ({ ...state, ...data })));
    f7.preloader.hide();
    if (cartList.length > 0 && cartList[0].lecture.school.id !== lecture?.school.id)
      f7.dialog.confirm('장바구니에는 같은 학원 강의만 담을 수 있어요!', '비우고 다시 담을까요?', execute);
    else await execute();
  };

  const removeLectureFromCart = async () => {
    const lineItemId = cartList?.find((lineItem) => lineItem.lecture.id == lectureId)?.id;
    if (!lineItemId) return;
    await destroyLineItems(lineItemId);
    await getCart().then(({ data }) => setCartState((state) => ({ ...state, ...data })));
    toast.get().setToastText('장바구니에서 꺼냈어요').openIconToast('cart_fill_badge_minus');
  };

  const canEdit = useMemo(
    () =>
      (user.role === 'owner' && user.own_school.id === lecture?.school.id) ||
      (user.role === 'teacher' && user.teaching_school.id === lecture?.school.id),
    [user.own_school, user.teaching_school, lecture ],
  );

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  useEffect(() => {
    setCartState((state) => ({ ...state, visible: false }));
    return () => setCartState((state) => ({ ...state, visible: true }));
  }, []);

  return (
    <Page noToolbar ptr ptrPreloader onPtrRefresh={reload}>
      <Navbar title={lecture?.title} slot="fixed" backLink>
        {canEdit && (
          <NavRight>
            <Button href={`/lectures/${lecture.id}/edit`}>수정</Button>
          </NavRight>
        )}
      </Navbar>

      {isLoading && <Preloader />}
      {isError && <Block>{error['message']}</Block>}

      <Swiper observer observeSlideChildren pagination>
        {lecture?.images?.map(({ id, image_path }) => (
          <SwiperSlide key={id}>
            <img src={`${api_url}${image_path}`} className="lecture__swiper--image lazy lazy-fade-in" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Block>
        <small className="text-sm">{lecture?.category.title}</small>
        <h1 className="text-xl font-bold">{lecture?.title}</h1>
        <h2 className="text-lg font-bold text-blue-500">{currency(lecture?.price)}원</h2>
        <p className="mt-4">{lecture?.description}</p>
        {user?.role === 'student' &&
          (cartList?.find((lineItem) => lineItem.lecture.id == lectureId) ? (
            <Button
              outline
              large
              className="lecture__buttons--get-off"
              onClick={removeLectureFromCart}
              disabled={isLoading}
            >
              장바구니에서 꺼내기
            </Button>
          ) : (
            <Button fill large className="lecture__buttons--put-in" onClick={addLectureToCart} disabled={isLoading}>
              장바구니에 담기
            </Button>
          ))}
      </Block>
    </Page>
  );
};

export default LectureShow;
