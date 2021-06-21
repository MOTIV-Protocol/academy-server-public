import React, { useState } from 'react';
import { postContacts, } from "../../common/api";
import { Button, List, ListInput } from 'framework7-react';

const ContactNew = ({ f7, f7router }) => {

  const [state, setState] = useState({
    loading: false,
    contact: {
      name: "",
      email: "",
      phone: "",
      title: "",
      content: ""
    }
  })
  const { loading, contact } = state;

  const submit = async () => {
    setState(state => ({ ...state, loading: true }))
    try {
      await postContacts({ contact })
      f7router.back();
      f7.toast.create({
        text: '정상 접수되었습니다!',
        position: 'center',
        closeTimeout: 2000,
      }).open();
    } catch (e) {
      setState(state => ({ ...state, loading: false }))
    }
  }

  const inputHandler = (e) => {
    const { id, value } = e.target
    setState(state => ({ ...state, contact: { ...state.contact, [id]: value } }))
  }

  return (
    <div className="padding">
      <List>
        <ListInput label="이름" type="text" placeholder="홍길동" clearButton
          inputId="name" value={contact.name} onInput={inputHandler} />
        <ListInput label="이메일" type="email" placeholder="gildong@naver.com" clearButton
          inputId="email" value={contact.email} onInput={inputHandler} />
        <ListInput label="휴대폰" type="tel" placeholder="010-0000-0000" clearButton
          inputId="phone" value={contact.phone} onInput={inputHandler} />
        <ListInput label="제목" type="text" clearButton
          inputId="title" value={contact.title} onInput={inputHandler} />
        <ListInput label="문의내용" type="textarea" clearButton
          inputId="content" value={contact.content} onInput={inputHandler} />
      </List>

      <Button large fill preloader loading={loading} onClick={submit}>
        제출
      </Button>
    </div>
  )
}

export default ContactNew
