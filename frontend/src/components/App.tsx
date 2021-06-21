import { IS_PRODUCTION } from '@config';
import routes from '@routes';
import { userSelector } from '@selectors';
import { App } from 'framework7-react';
import { getDevice } from 'framework7/bundle';
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useRecoilValue } from 'recoil';
import { RecoilRoot } from 'recoil';
import { RecoilRootPortal } from './RecoilRootPortal';
import Views from './Views';

const Splash = () => {
  // Recoil 비동기 로딩 시, 빈 화면
  return IS_PRODUCTION ? <></> : <>Loading</>;
};

const F7App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: IS_PRODUCTION,
        refetchOnReconnect: IS_PRODUCTION,
      },
    },
  });

  const device = getDevice();

  // Framework7 parameters
  const f7params = {
    name: 'Academy',
    theme: 'auto',
    id: 'com.insomenia.academy',
    routes,
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      iosTextColor: 'white',
      iosBackgroundColor: 'black',
      androidOverlaysWebView: false,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Splash />}>
        <RecoilRoot>
          <App {...f7params}>
            <Views />
          </App>
          {IS_PRODUCTION ? null : <ReactQueryDevtools position="bottom-right" />}
          <RecoilRootPortal />
        </RecoilRoot>
      </Suspense>
    </QueryClientProvider>
  );
};

export default F7App;
