import { styled } from '@mui/system'
import { ToggleButton } from '@mui/material'

const ImageToggleButton = styled(ToggleButton)({
    '&.Mui-selected': {
        border: '5px solid rgba(0, 134, 248, 0.7)',
    },
})

export default ImageToggleButton
