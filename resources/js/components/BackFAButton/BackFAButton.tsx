import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Fab } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

const BackFAButton: FunctionComponent = ({}) => {
    const navigate = useNavigate()
    return (
        <Fab
            color="primary"
            onClick={() => navigate('/')}
            sx={{
                marginTop: 2,
                position: 'absolute',
                display: { xs: 'none', sm: 'block' },
            }}
        >
            <ArrowBackIcon />
        </Fab>
    )
}
export default React.memo(BackFAButton)
