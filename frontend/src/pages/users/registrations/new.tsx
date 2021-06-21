import React, { MouseEvent, useState } from "react";
import { Block, Button, Checkbox, f7ready, Link, List, ListInput, ListItem, Navbar, Page } from "framework7-react";
import { signUpAPI } from "@api";
import PhoneCertification from "../../../components/shared/PhoneCertification";
import SchoolSelectPopup from "./SchoolSelectPopup";
import { toast } from "@utils";
import useAuth from "@hooks/useAuth";
import { SchoolModel } from "@constants";
import { UserRole } from "@constants/schema";

const UserSignUp = (props) => {
  const { authenticateUser } = useAuth();
  const [state, setState] = useState({
    certComplete: false,
    termCheck: false,
    privacyCheck: false,
    marketingCheck: false,
    role: "student" as UserRole,
    school: null as SchoolModel,
  });

  const setSchool = (school?: SchoolModel) => () => setState((state) => ({ ...state, school }));
  const onClickRole = (role: UserRole) => () => setState((state) => ({ ...state, role }));
  const certCompleteFunc = () => setState((state) => ({ ...state, certComplete: true }));
  const onClickCheckAll = () => setState(state => ({ ...state, termCheck: true, privacyCheck: true, marketingCheck: true }));
  
  const onChangeCheckBox = (e: MouseEvent<HTMLInputElement> ) => {
    const { name, checked } = e.target as HTMLInputElement;
    setState(state => ({ ...state, [name]: checked }));
  }

  const onClickFormSubmit = ( e: MouseEvent<HTMLFormElement> ) => {
    e.preventDefault();
    if( !state.termCheck ) return toast.get().setToastText("이용약관에 동의해주셔야 합니다.").openToast()
    if( !state.privacyCheck ) return toast.get().setToastText("개인정보 보호정책에 동의해주셔야 합니다.").openToast()
    if( !state.certComplete ) return toast.get().setToastText("휴대폰인증이 필요합니다.").openToast()
    if( state.role === "teacher" && state.school === null ) return toast.get().setToastText("등록할 학원을 선택하세요.").openToast()
    
    f7ready( async f7 => {
      const formData = f7.form.convertToData(e.target as HTMLFormElement);
      signUpAPI({ user: {...formData, role: state.role, school_id: state.school?.id} })
        .then((res) => authenticateUser(res.data))
        .catch((error) => {
          if (error.response)
            toast.get().setToastText(error.response?.data?.error || "문제가 발생했습니다.").openToast()
        });
    })
  };

  return (
    <Page>
      <Navbar title={i18next.t("signup.title")} backLink slot="fixed" />
      <form className="login-form" id="new-user" onSubmit={onClickFormSubmit}>
        <Block>
          <p>로그인에 사용할</p>
          <p>정보를 입력해주세요.</p>
        </Block>
        <List noHairlines className="padding">
          <li className="item-content item-input item-input-outline no-padding">
            <div className="item-inner">
              <div className="item-title item-floating-label">{i18next.t("login.email")}</div>
              <div className="item-input-wrap">
                <input type="email" name="email" />
                <span className="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li className="item-content item-input item-input-outline no-padding">
            <div className="item-inner">
              <div className="item-title item-floating-label">
                {i18next.t("login.password")}
              </div>
              <div className="item-input-wrap">
                <input type="password" name="password" />
                <span className="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li className="item-content item-input item-input-outline no-padding">
            <div className="item-inner">
              <div className="item-title item-floating-label">
                {i18next.t("login.password_confirm")}
              </div>
              <div className="item-input-wrap">
                <input type="password" name="password_confirmation" />
                <span className="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li className="item-content item-input item-input-outline no-padding">
            <div className="item-inner">
              <div className="item-title item-floating-label">{i18next.t("login.name")}</div>
              <div className="item-input-wrap">
                <input type="text" name="name" />
                <span className="input-clear-button"></span>
              </div>
            </div>
          </li>
        </List>

        <div className="padding">
          <h3>어떻게 가입하셨나요?</h3>
          <p className="segmented segmented-round margin-vertical">
            <a
              onClick={onClickRole("student")}
              className={`button button-round button-outline ${state.role === "student" && "button-active"
                }`}
            >
              학생
            </a>
            <a
              onClick={onClickRole("teacher")}
              className={`button button-round button-outline ${state.role === "teacher" && "button-active"
                }`}
            >
              선생님
            </a>
          </p>
          {state.role === "teacher" &&
            (state.school === null ? (
              <a href="#" data-popup=".school-select-popup" className="popup-open button button-fill">
                학원 선택
              </a>
            ) : (
              <div className="row">
                <h2 className="col-70">{state.school?.name}</h2>
                <a href="#" className="popup-open button col-30" onClick={setSchool(null)}>
                  선택취소
                </a>
              </div>
            ))}
          <small>수업하실 학원을 선택해주세요. 원장님의 승인 후 가입됩니다.</small>
          <SchoolSelectPopup setSchool={setSchool} />
        </div>

        <div className="form-divider"></div>

        <PhoneCertification cert_func={certCompleteFunc} />

        <div className="form-divider"></div>

        <List noChevron noHairlines className="padding">
          <div className="block-title agree-box">
            이용약관 및 개인정보 취급방침 동의
            <a onClick={onClickCheckAll} className="color-theme agree-all button button-outline link">
              전체 동의
            </a>
          </div>

          <div className="agree-wrap-box">
            <div className="ck">
              <Checkbox onChange={onChangeCheckBox} name="termCheck" checked={state.termCheck}>
                <div className="item-inner">
                  <div className="item-title">이용약관에 동의합니다 (필수)</div>
                </div>
              </Checkbox>
              <a className="button">보기</a>
            </div>

            <div className="ck">
              <Checkbox onChange={onChangeCheckBox} name="privacyCheck" checked={state.privacyCheck} >
                <div className="item-inner">
                  <div className="item-title">개인정보 보호정책에 동의합니다 (필수)</div>
                </div>
              </Checkbox>
              <a className="button">보기</a>
            </div>

            <div className="ck">
              <Checkbox onChange={onChangeCheckBox} name="marketingCheck" checked={state.marketingCheck} >
                <div className="item-inner">
                  <div className="item-title">마케팅에 수신에 동의합니다 (선택)</div>
                </div>
              </Checkbox>
              <a className="button">보기</a>
            </div>
          </div>

          <ul>
            <li className="item-content justify-content-center margin-top no-padding">
              <input
                type="submit"
                className={`button button-fill button-large ${!state.certComplete || !state.termCheck || !state.privacyCheck ? 'disabled' : '' }`}
                value="회원가입"
                disabled={!state.certComplete || !state.termCheck || !state.privacyCheck}
              />
            </li>
          </ul>
        </List>
      </form>
    </Page>
  );
};

export default UserSignUp
