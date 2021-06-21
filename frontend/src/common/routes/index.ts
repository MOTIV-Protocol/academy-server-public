import HomePage from '@pages/home';
import IntroPage from '@pages/intro';
import NotFoundPage from '@pages/404';
import LoginPage from '@pages/users/sessions/new';
import SignUpPage from '@pages/users/registrations/new';
import CurrentLocationPage from '@pages/popup/CurrentLocation';
import { resources } from './routes.utils';

const SharedRoutes = [{ path: '(.*)', component: NotFoundPage }];
const LoggedOutRoutes = [
  { path: '/intro', component: IntroPage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
];

const LoggedInRoutes = [
  { path: '/', component: HomePage },
  ...resources('point_histories'),
  ...resources('calculate_histories'),
  ...resources('attendances'),
  ...resources('comments'),
  ...resources('coupons'),
  ...resources('user_coupons'),
  ...resources('events'),
  ...resources('contacts'),
  ...resources('faqs'),
  ...resources('likes'),
  ...resources('reviews', {
    collections: ['owner'],
  }),
  ...resources('schools', {
    collections: ['owner', 'search'],
  }),
  ...resources('lectures', {
    collections: ['owner'],
  }),
  ...resources('users', {
    collections: ['teachers', 'owner', 'mypage'],
  }),
  ...resources('orders', {
    collections: ['payment', 'list_picker'],
  }),
  ...resources('notices'),
  ...resources('line_items'),
  {
    path: '/current-location/',
    component: CurrentLocationPage,
    options: {
      transition: 'f7-cover-v',
    },
  },
];

export default [...LoggedOutRoutes, ...LoggedInRoutes, ...SharedRoutes, { path: '(.*)', component: NotFoundPage }];
