import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    index: number;
    value: string[];
    state: string[][];
    setState: Dispatch<SetStateAction<string[][]>>;
};

const AnagramPage = ({ index, value, state, setState }: Props) => {
    const handleWordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, i: number) => {
        let p = [...state];
        let page = p[index];
        page.splice(i, 1, event.target.value);
        p.splice(index, 1, page);
        setState(p);
    };
    const handleRemovePage = (index: number) => {
        if (state.length === 1) {
            return;
        }
        let p = [...state];
        p.splice(index, 1);
        setState(p);
    };

    return (
        <Paper
            elevation={5}
            sx={{
                padding: '15px',
            }}
        >
            <Grid container spacing={3} alignItems="center">
                <Grid item alignSelf="center" xs={9}>
                    <Typography variant="subtitle1">Pag {index + 1}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <IconButton
                        onClick={() => {
                            handleRemovePage(index);
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Grid>
                {value.map((word: string, i: number) => {
                    return (
                        <Grid item alignSelf="center" key={i} xs={12}>
                            <TextField
                                label="Palavra"
                                name="word"
                                variant="outlined"
                                value={word}
                                inputProps={{
                                    maxLength: 16,
                                }}
                                onChange={(event) => {
                                    handleWordChange(event, index, i);
                                }}
                                fullWidth
                                required
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
};

export default AnagramPage;
