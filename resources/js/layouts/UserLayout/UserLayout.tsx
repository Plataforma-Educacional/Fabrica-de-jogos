import React from 'react';
import NavBar from '../../components/_layout/NavBar';
import { Container, CssBaseline } from '@mui/material';
import Copyright from '../../components/_layout/Copyright';
import { Outlet } from 'react-router-dom';
import BackFAButton from '../../components/_layout/BackFAButton';

const UserLayout = () => {
    return (
        <>
            <NavBar />
            <CssBaseline />
            <Container maxWidth="xl" component="main">
                <BackFAButton />
                <Outlet />
            </Container>
            <Copyright />
        </>
    );
};

export default UserLayout;
