import { api_url, getCategories, getUsers, postLectures, putImages, version } from '@api';
import { CategoryModel, ImageModel, UserModel } from '@constants';
import { userSelector } from '@selectors';
import { getToken } from '@store';
import { toast } from '@utils';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

const LectureNew = () => {
  const [state, setState] = useState({
    lecture: {
      title: '',
      description: '',
      price: '',
      category_id: null,
      teacher_id: null,
    },
    images: [] as ImageModel[],
    subCategories: [] as CategoryModel[],
    selectedCategory: null,
  });
  const user = useRecoilValue(userSelector);

  const { data: categories } = useQuery(['categories'], async () => {
    const response = await getCategories();
    return response.data;
  }, {placeholderData: []});

  const { data: teachers } = useQuery(['teachers'], async () => {
    const response = await getUsers({ q: { role_eq: 'teacher', teaching_school_id_eq: user.own_school.id } });
    return response.data;
  }, {placeholderData: []});

  const submit = async () => {
    if (!state.lecture.category_id) return toast.get().setToastText('카테고리를 선택하세요.').openToast();
    if (!state.lecture.teacher_id) return toast.get().setToastText('담당 선생님을 선택하세요.').openToast();
    try {
      setState((state) => ({ ...state, loading: true }));
      const {
        data: { id: lectureId },
      } = await postLectures({ lecture: state.lecture });
      const promises = state.images.map((image) =>
        putImages(image.id, {
          image: {
            imagable_id: lectureId,
            imagable_type: 'Lecture',
          },
        }),
      );
      await Promise.all(promises);
      toast.get().setToastText('수업을 개설했습니다!').openToast();
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

  const dictionary = useMemo(
    () => [
      // 카테고리 선택, 선생님 선택, 대표사진 및 사진들 업로드 일단 미룹니다.
      { label: '수업명', type: 'text', columnName: 'title' },
      { label: '수업 설명', type: 'textarea', columnName: 'description' },
      { label: '강의비', type: 'number', columnName: 'price' },
    ],
    [],
  );

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
  const stateInputHandler = (key) => (e) => {
    const { value } = e.target;
    setState((state) => ({
      ...state,
      [key]: value,
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
      });
      dropzone.on('complete', (file) => {
        var image = JSON.parse(file.xhr?.response);
        if (!!image) setState((state) => ({ ...state, images: [...state.images, image] }));
      });
      dropzone.on('removedfile', (file) => {
        var image = JSON.parse(file.xhr?.response);
        if (!!image) setState((state) => ({ ...state, images: [...state.images.filter((each) => each.id !== image.id)] }));
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
          <div className="text-base font-bold mb-2">강의 이미지 등록</div>
          <form className="dropzone" ref={dropzoneRef}></form>
        </label>
        <hr className="my-4" />
        {dictionary.map(({ label, type, columnName }, index) => (
          <ListInput key={index} label={label} type={type} clearButton onInput={lectureInputHandler(columnName)} />
        ))}
        <ListInput label="선생님" type="select" onInput={lectureInputHandler('teacher_id')} defaultValue={0}>
          <option value={0}>선택해주세요</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </ListInput>
        <ListInput label="메인 카테고리" type="select" onInput={stateInputHandler('selectedCategory')}>
          <option value={0}>선택해주세요</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </ListInput>
        {state.selectedCategory && (
          <ListInput label="세부 카테고리" type="select" onInput={lectureInputHandler('category_id')}>
            <option value={0}>선택해주세요</option>
            {categories
              .find((each) => each.id == state.selectedCategory)
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

export default LectureNew;
