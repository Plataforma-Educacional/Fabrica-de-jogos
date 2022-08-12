import React, { ChangeEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface Props {
    index: number
    value: string[]
    state: string[][]
    setState: Dispatch<SetStateAction<string[][]>>
}

const AnagramCell: FunctionComponent<Props> = ({ index, value, state, setState }) => {
    const handleWordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, i: number) => {
        let p = [...state]
        let page = p[index]
        page.splice(i, 1, event.target.value)
        p.splice(index, 1, page)
        setState(p)
    }
    const handleRemovePage = (index: number) => {
        let p = [...state]
        p.splice(index, 1)
        setState(p)
    }

    return (
        <Paper
            elevation={5}
            sx={{
                padding: '15px',
            }}
        >
            <Grid container direction="column" spacing={2} alignItems="center">
                <Grid item container alignItems="center" justifyContent="center">
                    <Grid item xs={10}>
                        <Typography variant="subtitle1">Pag {index + 1}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton
                            disabled={state.length === 1}
                            onClick={() => {
                                handleRemovePage(index)
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
                {value.map((word: string, i: number) => {
                    return (
                        <Grid item container key={i}>
                            <TextField
                                label="Palavra"
                                name="word"
                                variant="outlined"
                                value={word}
                                inputProps={{
                                    maxLength: 16,
                                }}
                                onChange={(event) => {
                                    handleWordChange(event, index, i)
                                }}
                                fullWidth
                                required
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )
}

export default AnagramCell
