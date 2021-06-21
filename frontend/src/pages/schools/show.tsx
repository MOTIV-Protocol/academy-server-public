import { likedSchoolsState } from '@atoms';
import { userSelector } from '@selectors';
import { distanceByLatLng } from '@utils/helpers';
import {
  Block,
  Button,
  Link,
  Navbar,
  NavRight,
  Page,
  PageContent,
  Progressbar,
  Swiper,
  SwiperSlide,
} from 'framework7-react';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { api_url, deleteLikes, getLectures, getLikedSchools, getSchool, postLikes } from '../../common/api';
import Rateyo from '../../components/reviews/Rateyo';
import HomeNavbar from '../../components/shared/HomeNavbar';
import { LoadingSkeleton } from '../user_coupons/skeleton/showSkeleton';
import LectureItem from '../lectures/LectureItem';
import ReviewItem from '../reviews/ReviewItem';

interface SchoolShowProps {
  id: string;
}
const SchoolShow: React.FC<SchoolShowProps> = (props) => {
  const user = useRecoilValue(userSelector);
  const setLikedSchools = useSetRecoilState(likedSchoolsState);
  const { id: schoolId } = props;

  const {
    data: school,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(['school', schoolId], async () => {
    const response = await getSchool(+schoolId);
    return response.data;
  });

  const { data: lectures } = useQuery(['lectures', schoolId], async () => {
    const response = await getLectures({ q: { start_at_gteq: Date() } });
    return response.data;
  });

  const like = (value) => async () => {
    if (value) await postLikes({ id: school.id });
    else await deleteLikes(school.id);
    refetch();
    await getLikedSchools().then(({ data }) => setLikedSchools(data));
  };

  const timeAbout = (minutes) => {
    if (minutes < 60) return `${minutes}분`;
    else if (minutes / 60 < 10) return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
  };
  const estimateTime = () => {
    const kmPerHourByWalking = 4;
    const kmPerHourByCar = 50;
    const distance = distanceByLatLng(user?.lat, user?.lng, school?.lat, school?.lng);
    const walkingMinutes = Math.ceil((distance / kmPerHourByWalking) * 60);
    const carMinutes = Math.ceil((distance / kmPerHourByCar) * 60);
    const messages =
      walkingMinutes > 120
        ? [`차량 ${timeAbout(carMinutes)} 예상`]
        : [`도보 ${timeAbout(walkingMinutes)} 예상`, `차량 ${timeAbout(carMinutes)} 예상`];
    return messages.join(', ');
  };

  const reload = async (done = null) => {
    await refetch();
    if (done) done();
  };

  const isOwnSchool = useMemo(() => user?.own_school?.id === +schoolId, [schoolId, user?.own_school?.id]);

  const isTeachingSchool = useMemo(
    () => user?.teaching_school?.id === +schoolId,
    [schoolId, user?.teaching_school?.id],
  );

  return (
    <Page noToolbar pageContent={false}>
      {isOwnSchool || isTeachingSchool ? (
        <HomeNavbar title={school?.name} slot="fixed" main>
          {isOwnSchool && (
            <NavRight>
              <Button href={`/schools/${schoolId}/edit`}>수정</Button>
            </NavRight>
          )}
        </HomeNavbar>
      ) : (
        <Navbar title={school?.name} slot="fixed" backLink />
      )}
      <PageContent ptr ptrPreloader onPtrRefresh={reload}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <Block>{error['message']}</Block>
        ) : (
          <div>
            <Swiper observer pagination>
              {school?.images?.map(({ id, image_path }) => (
                <SwiperSlide key={id}>
                  <img src={`${api_url}${image_path}`} className="lazy lazy-fade-in" />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="school__header">
              <div className="school__header--title">{school?.name}</div>
              <Rateyo starWidth="25px" halfStar={true} readOnly={true} rating={school.average_score || 0} />
              <div className="school__header--small">
                최근 리뷰 {school?.review_counts?.map((each) => each.count).reduce((a, b) => a + b)} | 원장님 댓글{' '}
                {school?.comment_count}
              </div>
              {user?.role === 'student' && (
                <div className="school__header--buttons">
                  <Link
                    href={`tel:${school?.phone}`}
                    className="button button-large external"
                    icon="las la-phone"
                    text="전화"
                  />
                  {school?.did_like ? (
                    <Link
                      href="#"
                      className="button button-large"
                      onClick={like(false)}
                      icon="las la-heart"
                      text={`찜 ${school?.like_count}`}
                    />
                  ) : (
                    <Link
                      href="#"
                      className="button button-large"
                      onClick={like(true)}
                      icon="lar la-heart"
                      text={`찜 ${school?.like_count}`}
                    />
                  )}
                  <Link href="#" className="button button-large" icon="las la-external-link-alt" text="공유" />
                </div>
              )}
            </div>

            <div className="school__info">
              <div className="row">
                <div className="school__info--key col-20">학원위치</div>
                <div className="school__info--value col-80">{school?.location}</div>
              </div>

              <div className="row">
                <div className="school__info--key col-20">등원시간</div>
                <div className="school__info--value col-80">{estimateTime()}</div>
              </div>
            </div>

            <div className="school__menus scrollmenu">
              <a href="#lectures" className="tab-link tab-link-active">
                강의
              </a>
              <a href="#info" className="tab-link">
                정보
              </a>
              <a href="#reviews" className="tab-link">
                리뷰
              </a>
            </div>

            <div className="school__tabs tabs">
              <div id="lectures" className="tab tab-active">
                {user?.role === 'owner' && (
                  <a href="/lectures/new" className="button button-fill margin-vertical">
                    새 강의 개설하기
                  </a>
                )}
                {lectures?.map((lecture) => (
                  <a key={lecture.id} href={`/lectures/${lecture.id}`}>
                    <LectureItem lecture={lecture} />
                  </a>
                ))}
              </div>

              <div id="info" className="tab">
                {user?.role === 'owner' && (
                  <a href={`/schools/${schoolId}/edit`} className="button button-fill margin-vertical">
                    학원 정보 수정
                  </a>
                )}
                <div className="school__tabs--header">학원 소개</div>
                <p>{school?.introduce}</p>

                <div className="school__tabs--header">위치정보</div>
                <p>{school?.location_info}</p>

                <div className="school__tabs--header">사업자정보</div>
                <div className="row">
                  <div className="school__tabs--key col-30">대표자명</div>
                  <div className="school__tabs--value col-70">{school?.business_owner}</div>
                </div>
                <div className="row">
                  <div className="school__tabs--key col-30">상호명</div>
                  <div className="school__tabs--value col-70">{school?.business_brand}</div>
                </div>
                <div className="row">
                  <div className="school__tabs--key col-30">사업자주소</div>
                  <div className="school__tabs--value col-70">{school?.business_address}</div>
                </div>
                <div className="row">
                  <div className="school__tabs--key col-30">사업자등록번호</div>
                  <div className="school__tabs--value col-70">{school?.business_number}</div>
                </div>

                <div className="school__tabs--header">학원 통계</div>
                <div className="row">
                  <div className="school__tabs--key col-30">최근 등록학생수</div>
                  <div className="school__tabs--value col-70">{school?.order_count}</div>
                </div>
                <div className="row">
                  <div className="school__tabs--key col-30">전체 리뷰등록수</div>
                  <div className="school__tabs--value col-70">{school?.review_count}</div>
                </div>
                <div className="row">
                  <div className="school__tabs--key col-30">찜</div>
                  <div className="school__tabs--value col-70">{school?.like_count}</div>
                </div>
              </div>

              <div id="reviews" className="tab">
                <div className="school__review">
                  <div className="row">
                    <div className="col-33 school__review--center">
                      <div className="school__review--score">{Math.round((school?.average_score || 0) * 10) / 10}</div>
                      <Rateyo starWidth="12px" halfStar={true} readOnly={true} rating={school?.average_score || 0} />
                    </div>
                    <div className="col-66">
                      {school.review_counts?.map(({ score, count }, index, array) => (
                        <div key={index} className="school__review__line">
                          <div className="school__review__line--score">{score}점</div>
                          <Progressbar
                            progress={(count / array.map((obj) => obj.count).reduce((a, b) => a + b)) * 100}
                            color="yellow" // (타입스크립트 에러) color 라는 속성이 분명있는데, 타입 명시 안한 Framework7 잘못
                          />
                          <div className="school__review__line--count">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {user?.role === 'owner' && (
                  <a href={`/reviews/owner`} data-reload-current={true} className="button button-fill margin-vertical">
                    리뷰 관리하기
                  </a>
                )}
                {school?.reviews?.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>
        )}
      </PageContent>
    </Page>
  );
};

export default SchoolShow;
