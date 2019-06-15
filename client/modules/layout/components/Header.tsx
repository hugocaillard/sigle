import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import tw from 'tailwind.macro';
import Router from 'next/router';
import { MdSort } from 'react-icons/md';
import { getConfig } from 'radiks';
import {
  Container,
  Button,
  Link,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from '../../../components';
import { MobileMenu } from './MobileMenu';
import { UserContext } from '../../../context/UserContext';
import { PrivateStory } from '../../../models';
import { defaultUserImage } from '../../../utils';
import { SignInDialog } from '../../dialog/SignInDialog';

const HeaderContainer = styled.div`
  ${tw`py-3 flex items-center`};
`;

const HeaderIcon = styled(MdSort)`
  ${tw`mr-3 lg:hidden cursor-pointer`};
`;

const HeaderLogo = styled.img`
  height: 30px;
`;

const HeaderSeparator = styled.img`
  ${tw`mx-auto`};
`;

// TODO nice underline with more space
const HeaderLink = styled(Link)`
  ${tw`py-3 px-3 block lg:text-sm hover:underline hidden lg:block`};
`;

const HeaderButton = styled(Button)`
  ${tw`ml-3`};
`;

const HeaderButtonNewStory = styled(Button)`
  ${tw`ml-3 mr-4`};
`;

const HeaderUserPhoto = styled.img`
  ${tw`w-8 h-8 rounded-full`};
`;

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const { user, sigleUser, loading } = useContext(UserContext);

  const handleLogout = () => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    window.location.reload();
  };

  const handleNewStory = async () => {
    const privateStory = new PrivateStory({
      title: '',
      content: '',
    });
    await privateStory.save();
    Router.push(`/me/stories/${privateStory._id}`);
  };

  const userImage = sigleUser
    ? sigleUser.attrs.imageUrl
      ? sigleUser.attrs.imageUrl
      : defaultUserImage(sigleUser.attrs.username, 32)
    : null;

  return (
    <Container>
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogin={() => setLoginOpen(true)}
        user={user}
        userImage={userImage}
      />
      <HeaderContainer>
        <SignInDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

        <HeaderIcon size={30} onClick={() => setMenuOpen(true)} />

        <Link href="/">
          <HeaderLogo src="/static/images/logo.png" alt="Sigle logo" />
        </Link>

        <HeaderSeparator />

        <HeaderLink href="/discover">Discover</HeaderLink>
        {/* TODO how to use */}
        {/* <HeaderLink href="/b">How to use?</HeaderLink> */}
        {/* TODO nice loading */}
        {loading && <div>Loading ...</div>}

        {!loading && !user && (
          <HeaderButton color="black" onClick={() => setLoginOpen(true)}>
            Sign in
          </HeaderButton>
        )}

        {!loading && user && (
          <HeaderButtonNewStory color="primary" onClick={handleNewStory}>
            New story
          </HeaderButtonNewStory>
        )}

        {!loading && user && (
          <Menu>
            <MenuButton>
              <HeaderUserPhoto src={userImage} alt={user.username} />
            </MenuButton>
            <MenuList>
              <MenuItem onSelect={() => Router.push('/me')}>
                My stories
              </MenuItem>
              <MenuItem onSelect={() => Router.push(`/@${user.username}`)}>
                My profile
              </MenuItem>
              <MenuItem onSelect={() => Router.push('/me/settings')}>
                Settings
              </MenuItem>
              <MenuItem onSelect={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HeaderContainer>
    </Container>
  );
};
