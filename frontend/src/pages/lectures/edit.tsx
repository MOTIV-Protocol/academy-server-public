import {
  api_url,
  deleteImage,
  getCategories,
  getLecture,
  getUsers,
  putImages,
  putLectures,
  version
} from '@api';
import { CategoryModel, F7ComponentProps, ImageModel } from '@constants';
import { userSelector } from '@selectors';
import { getToken } from '@store';
import { toast } from '@utils';
import { thumbnailPath } from '@utils/helpers';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

const LectureEdit: React.FC<F7ComponentProps> = (props) => {
  const user = useRecoilValue(userSelector);
  const { refetch: refetchLecture } = useQuery(['lecture', props.id]);
  const [state, setState] = useState({
    lecture: {
      id: null,
      title: '',
      description: '',
      price: '',
      main_category_id: null,
      category_id: null,
      teacher_id: null,
    },
    images: [] as ImageModel[],
  });

  const { data: categories } = useQuery(
    ['categories'],
    async () => {
      const response = await getCategories();
      return response.data;
    },
    { placeholderData: [] },
  );

  const { data: teachers } = useQuery(
    ['teachers'],
    async () => {
      const response = await getUsers({ q: { role_eq: 'teacher', teaching_school_id_eq: user.own_school.id } });
      return response.data;
    },
    { placeholderData: [] },
  );

  const selectedMainCategory = useMemo<CategoryModel>(
    () => categories.find((category) => category.id === +state.lecture.main_category_id),
    [categories, state.lecture.main_category_id],
  );

  const deleteImageHandler = (image: ImageModel) => async (e: React.MouseEvent) => {
    try {
      await deleteImage(image.id);
      setState((state) => ({ ...state, images: [...state.images].filter((each) => each.id !== image.id) }));
      toast.get().setToastText('해당 이미지를 삭제했어요.').openToast();
      refetchLecture();
    } catch (err) {
      console.error(err);
      toast.get().setToastText('이미지를 삭제하는데 문제가 발생했습니다.').openToast();
    }
  };

  useEffect(() => {
    const onInit = async () => {
      const { data: lecture } = await getLecture(+props?.id);
      const {
        id,
        title,
        description,
        price,
        category: { id: category_id, root },
        teacher: { id: teacher_id },
        images,
      } = lecture;
      setState((state) => ({
        ...state,
        images,
        lecture: { id, title, description, price: `${price}`, category_id, teacher_id, main_category_id: root.id },
      }));
    };
    onInit();
  }, []);

  // 강의 수정 제출
  const submit = async () => {
    if (!(state.lecture.category_id > 0) || !(state.lecture.main_category_id > 0))
      return toast.get().setToastText('카테고리를 선택하세요.').openToast();
    if (!(state.lecture.teacher_id > 0)) return toast.get().setToastText('담당 선생님을 선택하세요.').openToast();
    try {
      setState((state) => ({ ...state, loading: true }));
      const {
        data: { id: lectureId },
      } = await putLectures(+props?.id, { lecture: state.lecture });
      const promises = state.images.map((image) =>
        putImages(image.id, {
          image: {
            imagable_id: lectureId,
            imagable_type: 'Lecture',
          },
        }),
      );
      await Promise.all(promises);
      refetchLecture();
      toast.get().setToastText('수업 정보를 수정했습니다!').openToast();
      f7.views.current.router.back();
    } catch (err) {
      toast
        .get()
        .setToastText(err?.response?.data || err)
        .openToast();
    } finally {
      setState((state) => ({ ...state, loading: true }));
    }
  };

  const lectureInputHandler = (key) => (e) => {
    const { value } = e.target;
    setState((state) => ({
      ...state,
      lecture: {
        ...state.lecture,
        [key]: value,
      },
    }));
  };

  const dropzoneRef = useCallback((dom) => {
    let { csrf, token } = getToken();
    try {
      const dropzone = new Dropzone(dom, {
        url: `${api_url}/images`,
        paramName: 'image[image]',
        headers: {
          'Accept-Version': `v${version}`,
          'X-CSRF-TOKEN': csrf,
          Authorization: `Bearer ${token}`,
        },
        acceptedFiles: 'image/*',
        params: {
          'image[imagable_id]': props.id,
          'image[imagable_type]': 'Lecture',
        },
      });
      dropzone.on('complete', (file) => {
        var image = JSON.parse(file.xhr?.response);
        if (!!image) setState((state) => ({ ...state, images: [...state.images, image] }));
        refetchLecture();
        dropzone.removeFile(file);
      });
    } catch (err) {
      /* HMR 로 인해 발생하는 Dropzone Error 를 무시합니다. */
    }
  }, []);

  return (
    <Page>
      <Navbar backLink title="새 강의 개설" slot="fixed" />
      <List inset noHairlines className="no-padding">
        <label>
          {state.images.length > 0 && (
            <>
              <div className="text-base font-bold mb-2">등록된 이미지</div>
              <div className="flex flex-row flex-wrap justify-center">
                {state.images.map((image) => (
                  <div key={image.id} className="flex flex-col">
                    <img src={thumbnailPath(image)} className="m-2 w-24 h-24 object-cover rounded" />
                    <a onClick={deleteImageHandler(image)} className="button">
                      삭제
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </label>
        <label>
          <div className="text-base font-bold mb-2">강의 이미지 등록</div>
          <form className="dropzone" ref={dropzoneRef}></form>
        </label>
        <hr className="my-4" />
        <ListInput
          label="수업명"
          type="text"
          clearButton
          onInput={lectureInputHandler('title')}
          value={state.lecture.title}
        />
        <ListInput
          label="수업 설명"
          type="textarea"
          clearButton
          onInput={lectureInputHandler('description')}
          value={state.lecture.description}
        />
        <ListInput
          label="강의비"
          type="number"
          clearButton
          onInput={lectureInputHandler('price')}
          value={state.lecture.price}
        />

        <ListInput
          label="선생님"
          type="select"
          onInput={lectureInputHandler('teacher_id')}
          value={state.lecture.teacher_id}
        >
          <option value={0}>선택해주세요</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </ListInput>
        <ListInput
          label="메인 카테고리"
          type="select"
          onInput={lectureInputHandler('main_category_id')}
          value={state?.lecture?.main_category_id ?? 0}
        >
          <option value={0}>선택해주세요</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </ListInput>
        {selectedMainCategory && (
          <ListInput
            label="세부 카테고리"
            type="select"
            onInput={lectureInputHandler('category_id')}
            value={state?.lecture?.category_id ?? 0}
          >
            <option value={0}>선택해주세요</option>
            {categories
              .find((each) => each.id == selectedMainCategory.id)
              .children.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
          </ListInput>
        )}
      </List>
      <div onClick={submit} className="button button-fill button-large margin">
        정보 수정
      </div>
    </Page>
  );
};

export default LectureEdit;
