import { api_url, deleteImage, getSchool, updateSchool, version } from '@api';
import { F7ComponentProps, ImageModel, SchoolModel } from '@constants';
import { getToken } from '@store';
import { toast } from '@utils';
import { thumbnailPath } from '@utils/helpers';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import { List, Navbar, Page } from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

interface SchoolEditProps extends F7ComponentProps {
  id: string;
}
const SchoolEdit: React.FC<SchoolEditProps> = (props) => {
  const { id: schoolId, f7router } = props;
  const { refetch: refetchSchool } = useQuery(['school', schoolId]);
  const [school, setSchool] = useState<SchoolModel>({
    id: 0,
    images: [],
    lectures: [],
  });

  useEffect(() => {
    const onInit = async () => {
      const response = await getSchool(+schoolId);
      setSchool(response.data);
    };
    onInit();
  }, []);

  // 학원 수정 제출
  const submit = async (e: React.MouseEvent) => {
    try {
      await updateSchool(+schoolId, { school })
      refetchSchool()
      toast.get().setToastText('학원 정보를 수정했어요!').openToast();
      f7router.back()
    } catch ( err ) {
      toast.get().setToastText('학원 정보 수정 중 문제가 발생했습니다.').openToast();
    }
  };

  // Handlers
  const inputHandler = (key: string) => (e: any) => {
    setSchool((school) => ({ ...school, [key]: e.target.value }));
  };
  const deleteImageHandler = (image: ImageModel) => async (e: React.MouseEvent) => {
    try {
      await deleteImage(image.id);
      setSchool((school) => ({ ...school, images: [...school.images].filter((each) => each.id !== image.id) }));
      toast.get().setToastText('해당 이미지를 삭제했어요.').openToast();
      refetchSchool();
    } catch (err) {
      console.error(err);
      toast.get().setToastText('이미지를 삭제하는데 문제가 발생했습니다.').openToast();
    }
  };

  const dictionary = [
    { label: '학원명', type: 'string', columnName: 'name' },
    { label: '사업자주소', type: 'string', columnName: 'business_address' },
    { label: '상호명', type: 'string', columnName: 'business_brand' },
    { label: '사업자등록번호', type: 'string', columnName: 'business_number' },
    { label: '대표자명', type: 'string', columnName: 'business_owner' },
    { label: '학원 소개', type: 'text', columnName: 'introduce' },
    { label: '학원위치', type: 'string', columnName: 'location' },
    { label: '위치 정보 소개', type: 'text', columnName: 'location_info' },
    { label: '근무 시간', type: 'text', columnName: 'opening_time' },
    { label: '학원 전화번호', type: 'text', columnName: 'phone' },
  ];

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
          'image[imagable_id]': schoolId,
          'image[imagable_type]': 'School',
        },
      });
      dropzone.on('complete', (file) => {
        var image = JSON.parse(file.xhr?.response);
        if (!!image) setSchool((school) => ({ ...school, images: [...school.images, image] }));
        refetchSchool();
        dropzone.removeFile(file);
      });
    } catch (err) {
      /* HMR 로 인해 발생하는 Dropzone Error 를 무시합니다. */
    }
  }, []);

  return (
    <Page>
      <Navbar backLink title="학원 정보 수정" slot="fixed" />
      <div className="m-4">
      <label>
        {school.images.length > 0 && (
          <>
            <div className="text-base font-bold mb-2">등록된 이미지</div>
            <div className="flex flex-row flex-wrap justify-center">
              {school.images.map((image) => (
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
      </div>
      <hr className="my-4" />
      <List inset noHairlines>
        {dictionary.map(({ label, type, columnName }, index) => (
          <li key={index} className="item-content item-input no-padding-left">
            <div className="item-inner">
              <div className="item-title item-label">{label}</div>
              <div className="item-input-wrap">
                {type === 'string' ? (
                  <input type="text" value={school[columnName]} onInput={inputHandler(columnName)} />
                ) : type === 'text' ? (
                  <textarea value={school[columnName]} onInput={inputHandler(columnName)} />
                ) : null}
                <span className="input-clear-button"></span>
              </div>
            </div>
          </li>
        ))}
      </List>
      <div onClick={submit} className="button button-fill button-large margin">
        정보 수정
      </div>
    </Page>
  );
};

export default SchoolEdit;
