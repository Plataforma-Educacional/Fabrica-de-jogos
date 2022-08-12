import { Card, Grid, ToggleButton, Typography } from '@mui/material'
import React, { MouseEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { styled } from '@mui/system'

const ImageToggleButton = styled(ToggleButton)({
    '&.Mui-selected': {
        border: '5px solid rgba(0, 134, 248, 0.7)',
    },
})

const formats = [0, 1, 2]

interface Props {
    value: number
    setValue: Dispatch<SetStateAction<number>>
}

const DragNDropFormat: FunctionComponent<Props> = ({ value, setValue }) => {
    const handleFormat = (event: MouseEvent<HTMLElement>, newFormat: number) => {
        if (newFormat === null) {
            return
        }
        setValue(newFormat)
    }

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
            <Grid item xs={12}>
                <Typography variant="subtitle1">Formato: </Typography>
            </Grid>
            {formats.map((format, i) => {
                return (
                    <Grid item alignSelf="center" xs={12} md={6} lg={3} key={i}>
                        <ImageToggleButton
                            selected={value === format}
                            value={format}
                            color="primary"
                            size="large"
                            sx={{
                                padding: 0,
                                borderRadius: 8,
                            }}
                            onChange={(event, value) => {
                                handleFormat(event, value)
                            }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 8,
                                    height: 150,
                                }}
                                elevation={5}
                            >
                                <img
                                    src={`/storage/drag-drop/${format}.png`}
                                    alt={`Formato ${format}`}
                                    width="100%"
                                    height="100%"
                                />
                            </Card>
                        </ImageToggleButton>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default React.memo(DragNDropFormat)
