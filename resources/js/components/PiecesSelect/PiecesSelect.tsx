import React, { MouseEvent, FunctionComponent, SetStateAction, Dispatch } from 'react'
import { Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

type Props = {
    value: number
    setValue: Dispatch<SetStateAction<number>>
}

const PiecesSelect: FunctionComponent<Props> = ({ value, setValue }) => {
    const handlePieces = (event: MouseEvent<HTMLElement>, newPieces: number) => {
        if (newPieces === null) {
            return
        }
        setValue(newPieces)
    }
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <Typography fontSize={18} variant="subtitle2" color="primary">
                    Quantidade de peças:
                </Typography>
            </Grid>
            <ToggleButtonGroup value={value} exclusive onChange={handlePieces} color="primary">
                <ToggleButton value={2}>{'- 2 -'}</ToggleButton>
                <ToggleButton value={3}>{'- 3 -'}</ToggleButton>
                <ToggleButton value={4}>{'- 4 -'}</ToggleButton>
                <ToggleButton value={6}>{'- 6 -'}</ToggleButton>
            </ToggleButtonGroup>
        </Grid>
    )
}

export default PiecesSelect
