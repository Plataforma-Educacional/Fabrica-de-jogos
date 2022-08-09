import React, { ChangeEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { Button, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface Props {
    value: string[]
    setValue: Dispatch<SetStateAction<string[]>>
    correct: boolean
}

const BalloonCell: FunctionComponent<Props> = ({ value, setValue, correct }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        let ans = [...value]
        ans[index] = event.target.value
        setValue(ans)
    }
    const handleAdd = () => {
        if (value.length > 15) {
            return
        }
        setValue([...value, ''])
    }
    const handleRemove = (index: number) => {
        let ans = [...value]
        ans.splice(index, 1)
        setValue(ans)
    }

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container alignSelf="center" alignItems="flex-start" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <Typography color="primary" variant="h5">
                        <b>{correct ? 'Palavras Corretas' : 'Palavras Erradas'}</b>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={handleAdd} variant="contained" size="small">
                        Adicionar {correct ? 'Resposta' : 'Alternativa'}
                    </Button>
                </Grid>
                {value.map((item, i) => {
                    return (
                        <Grid key={i} item xs={12} md={6}>
                            <Grid
                                container
                                alignSelf="center"
                                alignItems="flex-start"
                                justifyContent="center"
                                spacing={0}
                            >
                                <Grid item xs={10}>
                                    <TextField
                                        variant="outlined"
                                        label={'Item ' + (i + 1)}
                                        fullWidth
                                        size="small"
                                        inputProps={{
                                            maxLength: 12,
                                        }}
                                        color={correct ? 'success' : 'error'}
                                        value={item}
                                        onChange={(event) => handleChange(event, i)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton
                                        onClick={() => {
                                            handleRemove(i)
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )
}

export default BalloonCell
