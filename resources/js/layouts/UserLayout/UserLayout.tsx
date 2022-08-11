import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Container, CssBaseline, Box } from '@mui/material'
import { Outlet, useSearchParams } from 'react-router-dom'

import Copyright from 'components/Copyright/Copyright'
import { setBaseState } from 'reducers/userReducer'
import NavBar from 'components/NavBar/NavBar'
import { RootState } from '../../store'
import { useGetUserInfoQuery } from 'services/portal'

const UserLayout = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { token, origin } = useSelector((state: RootState) => state.user)
    const { data, error, isLoading } = useGetUserInfoQuery({ token, origin })
    const dispatch = useDispatch()

    useEffect(() => {
        if (searchParams.has('user_token') && searchParams.has('api_address')) {
            localStorage.setItem('token', searchParams.get('user_token') as string)
            const uri = decodeURI(searchParams.get('api_address') as string).replace('/api/', '')
            localStorage.setItem('origin', uri)
            dispatch(setBaseState())
            searchParams.delete('api_address')
            searchParams.delete('user_token')
            setSearchParams(searchParams)
            window.location.reload()
        }
        if (!localStorage.getItem('token') || !localStorage.getItem('origin')) {
            window.location.href = '/401'
        }
    }, [])

    if (error) window.location.href = '/401'

    if (isLoading)
        return (
            <CircularProgress
                sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        )

    return (
        <>
            <NavBar data={data} />
            <CssBaseline />
            <Container maxWidth="xl" component="main">
                <Outlet />
            </Container>
            <Copyright />
        </>
    )
}

export default UserLayout
