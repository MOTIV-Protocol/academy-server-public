import React from 'react';
import { Page, Navbar, f7, List, ListInput } from 'framework7-react';
import { loginAPI } from '@api';
import i18next from 'i18next';
import useAuth from '@hooks/useAuth';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { Token } from '@constants';

interface FormValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required('필수 입력사항 입니다.'),
  password: Yup.string()
    .min(4, '길이가 너무 짧습니다.')
    .max(50, '길이가 너무 깁니다.')
    .required('필수 입력사항 입니다.'),
});

const initialValues: FormValues = { email: '', password: '' };

const SessionNewPage = ({ f7route, f7router }) => {
  const { authenticateUser } = useAuth();

  const onFormSubmit = async (params: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    try {
      const response = await loginAPI({ user: { ...params } });
      await authenticateUser(response.data as Token);
      f7.dialog.alert('성공적으로 로그인 하였습니다.');
    } catch (error) {
      f7.dialog.alert(error?.response?.data ?? '정보를 확인 해주세요.');
      setSubmitting(false);
    }
  };

  return (
    <Page noToolbar>
      <Navbar title={i18next.t('login.title')} backLink={true} sliding={false} slot="fixed" />
      <div className="list padding-top no-hairlines block">
        <Formik
          initialValues={initialValues}
          validationSchema={SignInSchema}
          onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => onFormSubmit(values, setSubmitting)}
          validateOnMount
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
            <form className="login-form" id="new-session" onSubmit={handleSubmit}>
              <List className="no-hairlines-md">
                <li className="item-content justify-content-center">
                  <h1>
                    <img src="static/images/logo.png" alt="logo" />
                  </h1>
                </li>
                <ListInput
                  label={`${i18next.t('login.email')}`}
                  name="email"
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  errorMessageForce
                  errorMessage={touched.email && errors.email}
                />
                <ListInput
                  label={`${i18next.t('login.password')}`}
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  errorMessageForce
                  errorMessage={touched.password && errors.password}
                />
                <li className="item-content justify-content-center margin-top no-padding">
                  <input
                    type="submit"
                    className={`button button-fill button-large ${isSubmitting ? 'disabled' : ''}`}
                    value="로그인"
                  />
                </li>
                <li className="item-content justify-content-center margin-top no-padding">
                  <a href="/users/sign_up" className="button button-large button-outline width-100 margin-bottom">
                    회원가입
                  </a>
                </li>
                <li className="text-align-right margin-top margin-bottom no-padding">
                  <div>{i18next.t('login.forget')}</div>
                </li>
              </List>
              <hr />
            </form>
          )}
        </Formik>
      </div>
    </Page>
  );
};

export default SessionNewPage;
