import { getOrder, postImages, postReviews } from '@api';
import Rateyo from '@components/reviews/Rateyo';
import { OrderModel } from '@constants';
import { currency } from '@utils/helpers';
import { f7, Page, Navbar, NavRight } from 'framework7-react';
import React, { useEffect, useRef, useState } from 'react';

const ReviewNew = ({f7route}) => {
  const { order_id } = f7route.query;
  
  const [state, setState] = useState({
    order: {} as OrderModel,
    score: 0,
    imageData: [],
    content: "",
  })

  // 제출 및 서버 전송
  const submit = async () => {
    f7.preloader.show();
    try {
      let response = await postReviews({ review: { score: state.score, content: state.content, order_id } })
      const review_id = response.data?.id
      const promises = state.imageData.map((data) => {
        const formData = new FormData()
        formData.append('image[imagable_id]', review_id)
        formData.append('image[imagable_type]', "Review")
        formData.append('image[image]', data.file)
        postImages(formData)
      })
      await Promise.all(promises)
      f7.toast.create({ position: "center", closeTimeout: 2000, text: "작성했습니다!" }).open()
      f7.views.current.router.back( null, { force: true })
    } catch (e) {
      f7.toast.create({ position: "center", closeTimeout: 2000, text: "작성 중 문제가 발생했습니다." }).open()
    }
    finally {
      f7.preloader.hide();
    }
  }

  // 사진 불러오는 창 띄우기
  const imageChooser = useRef();
  const openFileBrowser = () => {
    if (!!imageChooser?.current && state.imageData.length >= 5) return
      $(imageChooser.current).click()
  }

  // 이미지 삭제
  const deleteFile = (index) => () => {
    f7.dialog.confirm('이 사진을 삭제하시겠어요?', function () {
      setState(state => {
        const imageData = [...state.imageData]
        imageData.splice(index, 1)
        return {...state, imageData}
      })
    });
  }

  // 선택한 이미지 추가
  const imageSelected = (event) => {
    const input = event.target;
    Array.from(input.files)?.forEach(file => {
      if (state.imageData.length >= 5) return
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => setState( state => {
        const newImageData = { id: Date.now() - parseInt(Math.random() * 1000), file, reader }
        return {...state, imageData: [...state.imageData, newImageData]}
      })
    })
  }

  const onRateChange = (score) => setState(state => ({ ...state, score }))
  const changeHandler = e => setState(state => ({ ...state, [e.target.name]: e.target.value }))
  
  const onInit = async () => {
    f7.preloader.show()
    const response = await getOrder(order_id)
    const order = response.data
    setState(state => ({ ...state, order }))
    f7.preloader.hide()
  }

  useEffect(() => {
    onInit()
  }, [])

  return (
    <Page noToolbar className="reviews-new">
      <Navbar title="리뷰작성" slot="fixed" backLink>
        <NavRight>
          <a href="#" className="link padding-half" onClick={submit}>
            완료
          </a>
        </NavRight>
      </Navbar>
      
      <div className="star-container">
        <Rateyo starWidth="40px" fullStar onChange={onRateChange} />
        <div id="score">
          {
            state.score ?
              `${state.score}점`
              :
              "별점을 선택해주세요"
          }
        </div>
      </div>

      <div className="content-container">
        <textarea name="content" value={state.content} onChange={changeHandler} placeholder="가슴은 뜨겁게, 리뷰는 솔직하게 작성해주세요" />
      </div>

      <div className="photo-container">
        <input ref={imageChooser} type="file" name="photo" accept="image/*" onChange={imageSelected} multiple />

        <div className="slot button color-gray" onClick={openFileBrowser}>
          <i className="icon f7-icons">photo</i>
          <div>사진 {state.imageData.filter(image => !!image).length}/5</div>
        </div>
        {
          state.imageData.map((data, index) =>
            <div key={data.id} className="slot button" onClick={deleteFile(index)}>
              <img src={data.reader.result} />
            </div>
          )
        }
      </div>

      <div className="checkbox-container">
        <label className="checkbox">
          <input id="only-owner-view" type="checkbox" />
          <i className="icon-checkbox"></i>
        </label>
        <label htmlFor="only-owner-view">학원 원장한테만 보이게</label>
        <a href="#" className="link">
          <i className="icon f7-icons">question_circle</i>
        </a>
      </div>

      <hr />

      <div className="main-text">강의는 괜찮았나요?</div>

      <div className="list lecture-list no-hairlines">
        <ul>
          {state.order?.line_items?.map(({ id, lecture, price }) =>
            <li key={id}>
              <div>{lecture.title} <small>{currency(price)}원</small></div>
              <a href="#">
                <i className="icon f7-icons">hand_thumbsup</i>
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className="checkbox-container">
        <label className="checkbox">
          <input id="hide-menu" type="checkbox" />
          <i className="icon-checkbox"></i>
        </label>
        <label htmlFor="hide-menu">메뉴 비공개</label>
        <a href="#" className="link">
          <i className="icon f7-icons">question_circle</i>
        </a>
      </div>

    </Page>
  );
}

export default ReviewNew
