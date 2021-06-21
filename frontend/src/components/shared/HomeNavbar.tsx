import React, { forwardRef, useRef } from 'react';
import { Navbar, NavLeft, NavRight, NavTitle } from 'framework7-react';

interface HomeNavbarProps {
  title?: string | number | React.ReactChildren | React.ReactNode;
  main?: boolean;
  [attr: string]: any;
}
const HomeNavbar: React.FC<HomeNavbarProps> = (props) => {
  const { title, right = null, main = false, children } = props;

  return (
    <Navbar>
      {
        main ? 
        <NavLeft>
          <a href="#" className="link icon-only panel-open" data-panel="left">
            <i className="icon f7-icons if-not-md">menu</i>
            <i className="icon material-icons if-md">menu</i>
          </a>
        </NavLeft> : <></>
      }
      <NavTitle>
        {title}
      </NavTitle>
      {children}
    </Navbar>
  );
};

export default HomeNavbar;