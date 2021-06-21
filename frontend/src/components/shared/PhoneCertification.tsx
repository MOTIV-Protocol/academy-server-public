import React from 'react';
import { f7 } from "framework7-react";
import { useRef, useState } from "react";
import { getSmsAuth } from '@api';
import { toast } from '@utils';

const PhoneCertification = (props) => {
  const $phoneInput = useRef<HTMLInputElement>()
  const $codeInput = useRef<HTMLInputElement>()

  const [state, setState] = useState({
    phone: "",
    code: "",
    sended: false,
    certComplete: false,
    time: "",
  });

  const showAlertToast = (msg) => toast.get().setToastText(msg).openIconToast();
  const onChangePhone = (e) => setState( state => ({...state, phone: e.target.value}))
  const onChangeCode = (e) => setState( state => ({...state, code: e.target.value}))

  // 남은 시간 계산
  const calcLeftTime = () => {
    let timeLeftInterval = null
    const clearTimeLeftInterval = () => { 
      if (!!timeLeftInterval) {
        clearInterval(timeLeftInterval)
        timeLeftInterval = null
        setState( state => ({...state, time: ""}))
      }
    }
    clearTimeLeftInterval()
    setState( state => ({...state, time: "3:00"}))
    let maxTime = 180; // 3 minutes
    timeLeftInterval = setInterval(() => {
      if( state.time === null ) clearTimeLeftInterval()
      let min, sec; min = Math.floor(maxTime / 60); sec = maxTime % 60;
      setState( state => !state.time ? state : ({...state, time: min + ":" + (sec >= 10 ? sec : `0${sec}`)}))
      maxTime--;
      if (maxTime < 0) {
        clearTimeLeftInterval()
        showAlertToast("인증시간이 초과되었습니다");
      }
    }, 1000);
  };

  // 휴대폰인증 메시지 클릭, 발송
  const onClickSendPhoneCert = async () => {
    if (state.phone === "") {
      showAlertToast("휴대폰 번호를 입력해주세요");
      $phoneInput.current?.focus();
      return
    } else if (state.phone.length < 10 || state.phone.length > 12) {
      showAlertToast("휴대폰 번호가 올바르지 않습니다");
      $phoneInput.current?.focus();
      return
    }

    try {
      f7.dialog.preloader("잠시만 기다려주세요...");
      
      let phone = state.phone
      if (phone.includes("-")) phone = phone.replaceAll("-", "")

      const response = await getSmsAuth({ phone });
      const { success } = response.data;
      if (success) {
        setState( state => ({...state, sended: true}) );
        showAlertToast("인증번호가 발송되었습니다");
        f7.dialog.close();
        $codeInput.current?.focus();
        calcLeftTime();
      } else showAlertToast("인증번호 발송이 불가능한 번호입니다");
    } catch (err) {
      if (err.response) showAlertToast(err.response.status + " " + err.response.statusText);
    } finally {
      f7.dialog.close();
    }
  };

  // 인증번호 확인 클릭
  const onClickCert = async () => {
    if (state.code === "") {
      showAlertToast("인증번호를 입력해주세요");
      return
    }
  
    try {
      const {phone, code} = state
      f7.dialog.preloader("잠시만 기다려주세요...");
      const response = await getSmsAuth({ phone, code });
      const { success, message } = response.data;
      if (success) {
        setState( state=> ({...state, certComplete: true, time: null}) );
        if (props.cert_func) props.cert_func();
      } else {
        $codeInput.current?.focus();
      }
      showAlertToast(message);
    } catch (err) {
      if (err.response) showAlertToast(err.response.status + " " + err.response.statusText);
    } finally {
      f7.dialog.close();
    }
  };

  return (
    <div className="list no-hairlines padding">
      <ul>
        <div className="margin-top margin-bottom">
          <span className="profile-form-title">휴대폰 본인 인증</span>
        </div>
        <li className="item-content item-input item-input-outline no-padding">
          <div className="item-inner row no-padding">
            <div className="item-input-wrap col-70">
              <input
                onChange={onChangePhone}
                name="phone"
                ref={$phoneInput}
                type="tel"
                placeholder="- 없이 번호만 입력해주세요"
                value={state.phone}
                readOnly={state.certComplete}
              />
              {!state.certComplete && <span className="input-clear-button"></span>}
            </div>
            <button
              onClick={() => onClickSendPhoneCert()}
              type="button"
              id="send-code-button"
              className={
                state.certComplete === true
                  ? "col-30 button button-fill button-large padding disabled"
                  : "col-30 button button-fill button-large padding"
              }
              disabled={state.certComplete}
            >
              {state.sended ? "재전송" : "전송"}
            </button>
          </div>
        </li>
        {state.sended && (
          <div>
            <li className="item-content item-input item-input-outline no-padding">
              <div className="item-inner">
                <div className="item-title item-floating-label">인증번호</div>
                <div className="item-input-wrap">
                  <input
                    onChange={onChangeCode}
                    ref={$codeInput}
                    name="code"
                    type="tel"
                    placeholder="인증번호를 입력해주세요"
                    value={state.code}
                    readOnly={state.certComplete}
                  />
                  {!state.certComplete && <span className="input-clear-button"></span>}
                </div>
              </div>
            </li>
            {
              state.time?.length > 0 &&
              <p className="time-left-container">
                남은시간: <span id="cert-time-left">{state.time}</span>
              </p>
            }
            <li className="item-content justify-content-center margin-top no-padding">
              <button
                onClick={() => onClickCert()}
                type="button"
                id="cert-button"
                className={
                  state.certComplete === true
                    ? "button button-fill button-large disabled"
                    : "button button-fill button-large"
                }
                disabled={state.certComplete}
              >
                {state.certComplete ? "인증되었습니다" : "인증완료"}
              </button>
            </li>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PhoneCertification
