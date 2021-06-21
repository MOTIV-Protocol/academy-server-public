import React, { useEffect } from 'react';
import { Page, Link, Block } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { likedSchoolsState } from '@atoms';
import { getLikedSchools } from '@api';
import SchoolItem from '@pages/schools/SchoolItem';
import HomeNavbar from '@components/shared/HomeNavbar';
import EmptyList from '@components/shared/EmptyList';

const LikeIndex = () => {
  const [likedSchools, setLikedSchools] = useRecoilState(likedSchoolsState);

  const refresh = async () => {
    await getLikedSchools().then(({ data }) => setLikedSchools(data));
  };

  const reload = async (done = null) => {
    await refresh();
    if (done) done();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Page ptr ptrPreloader onPtrRefresh={reload}>
      <HomeNavbar title="찜한 학원" slot="fixed" main/>
      {likedSchools?.length > 0 ? (
        <div className="m-4">
          {likedSchools.map((school) => (
            <Link key={school.id} href={`/schools/${school.id}`}>
              <SchoolItem school={school} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyList text="찜한 학원이 텅 비어있어요."/>
      )}
    </Page>
  );
};

export default LikeIndex;
