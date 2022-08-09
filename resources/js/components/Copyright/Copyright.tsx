import { Typography } from '@mui/material'
import React, { FunctionComponent } from 'react'

const Copyright: FunctionComponent = () => {
    return (
        <>
            <br />
            <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright Portal Educacional© '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </>
    )
}
export default React.memo(Copyright)
