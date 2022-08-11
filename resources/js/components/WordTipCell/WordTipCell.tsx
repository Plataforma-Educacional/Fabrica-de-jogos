import React, { ChangeEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { Grid, IconButton, Paper, TextField } from '@mui/material'
import { EditorState } from 'draft-js'
import DeleteIcon from '@mui/icons-material/Delete'

import RichTextField from 'components/RichTextField/RichTextField'
import { wordObj } from 'types'

type Props = {
    index: number
    value: wordObj
    state: wordObj[]
    setState: Dispatch<SetStateAction<wordObj[]>>
}

const WordTipCell: FunctionComponent<Props> = ({ index, value, state, setState }) => {
    const handleRemoveWord = (index: number) => {
        if (state.length === 1) {
            return
        }
        let p = [...state]
        p.splice(index, 1)
        setState(p)
    }
    const handleWordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        let p = [...state]
        let word = p[index]
        word.word = event.target.value
        p.splice(index, 1, word)
        setState(p)
    }
    const handleTipChange = (editorState: EditorState, index: number) => {
        let p = [...state]
        let word = p[index]
        word.tip = editorState
        p.splice(index, 1, word)
        setState(p)
    }
    return (
        <Paper
            elevation={5}
            sx={{
                padding: '15px',
            }}
        >
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={11}>
                    <TextField
                        label="Palavra"
                        name="word"
                        variant="outlined"
                        value={value.word}
                        onChange={(event) => {
                            handleWordChange(event, index)
                        }}
                        inputProps={{
                            maxLength: 10,
                        }}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        disabled={state.length === 1}
                        onClick={() => {
                            handleRemoveWord(index)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <RichTextField
                        editorState={value.tip as EditorState}
                        onChange={handleTipChange}
                        label={'Dica'}
                        index={index}
                        maxLength={45}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default WordTipCell
