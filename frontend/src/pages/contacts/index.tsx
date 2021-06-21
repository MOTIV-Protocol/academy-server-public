import React, { useState, useEffect } from 'react';
import ContactsNew from './new';
import {
  Block,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  f7,
  Link,
  Navbar,
  Page,
  PageContent,
  Tab,
  Tabs,
  Toolbar,
} from 'framework7-react';
import { getContacts } from '@api';
import EmptyList from '@components/shared/EmptyList';

const ContactIndex = (props) => {
  const { f7router } = props;
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const onInit = async () => {
      const response = await getContacts();
      setContacts(response.data);
    };
    onInit();
  }, []);

  return (
    <Page pageContent={false}>
      <Navbar backLink title="이메일 문의" />

      <Toolbar tabbar top>
        <Link tabLink="#tab-contacts-new" tabLinkActive>
          문의하기
        </Link>
        <Link tabLink="#tab-contacts-index">문의내역</Link>
      </Toolbar>

      <PageContent>
        <Tabs routable>
          <Tab tabActive id="tab-contacts-new">
            <ContactsNew f7={f7} f7router={f7router} />
          </Tab>
          <Tab id="tab-contacts-index">
            {contacts.length === 0 ? (
              <EmptyList text="접수한 문의가 없어요!" className="mt-10" />
            ) : (
              contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardHeader>{contact.title}</CardHeader>
                  <CardContent>{contact.content}</CardContent>
                  <CardFooter>
                    <div>{contact.name}</div> |<div>{contact.email}</div> |<div>{contact.phone}</div>
                  </CardFooter>
                </Card>
              ))
            )}
          </Tab>
        </Tabs>
      </PageContent>
    </Page>
  );
};

export default ContactIndex;
