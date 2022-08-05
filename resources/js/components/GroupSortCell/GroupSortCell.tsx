import React, { ChangeEvent, Dispatch, SetStateAction, FunctionComponent } from 'react';
import { Button, Grid, IconButton, Paper, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { groupObj } from 'types';

interface Props {
    index: number;
    value: groupObj;
    state: groupObj[];
    setState: Dispatch<SetStateAction<groupObj[]>>;
}

const GroupSortCell: FunctionComponent<Props> = ({ index, value, state, setState }) => {
    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        let g = [...state];
        g[index].title = event.target.value;
        setState(g);
    };

    const handleAddItem = (index: number) => {
        if (state[index].items.length === 5) {
            return;
        }
        let g = [...state];
        g[index].items.push('');
        setState(g);
    };

    const handleRemoveItem = (index: number, i: number) => {
        let g = [...state];
        g[index].items.splice(i, 1);
        setState(g);
    };

    const handleItemChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, i: number) => {
        let g = [...state];
        g[index].items[i] = event.target.value;
        setState(g);
    };
    return (
        <>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Grid container alignSelf="center" alignItems="flex-start" justifyContent="center" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Título"
                            variant="filled"
                            value={value.title}
                            onChange={(event) => handleTitleChange(event, index)}
                            inputProps={{
                                maxLength: 185,
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    {value.items.length < 5 && (
                        <Grid item xs={12}>
                            <Button onClick={() => handleAddItem(index)} variant="contained" size="small">
                                Adicionar Item
                            </Button>
                        </Grid>
                    )}
                    {value.items.map((item, i) => {
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
                                            value={item}
                                            onChange={(event) => handleItemChange(event, index, i)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            onClick={() => {
                                                handleRemoveItem(index, i);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>
        </>
    );
};

export default GroupSortCell;
