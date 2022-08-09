import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import { KeyboardDoubleArrowRight } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { EditorState } from 'draft-js'

import RichTextField from 'components/RichTextField/RichTextField'
import { matchUpObj, matchUpPage } from 'types'
import textToDraft from 'utils/textToDraft'

interface Props {
    index: number
    value: matchUpPage
    state: matchUpPage[]
    setState: Dispatch<SetStateAction<matchUpPage[]>>
}

const MatchUpCell: FunctionComponent<Props> = ({ index, value, state, setState }) => {
    const handleRemovePage = (index: number) => {
        let p = [...state]
        p.splice(index, 1)
        setState(p)
    }
    const handleWordChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
        i: number
    ) => {
        let p = [...state]
        let page = p[index]
        let matchUp = page[i]
        matchUp.word = event.target.value
        page.splice(i, 1, matchUp)
        p.splice(index, 1, page)
        setState(p)
    }
    const handleMeaningChange = (editorState: EditorState, index: number, i: number) => {
        let p = [...state]
        let page = p[index]
        let matchUp = page[i]
        matchUp.meaning = editorState
        page.splice(i, 1, matchUp)
        p.splice(index, 1, page)
        setState(p)
    }
    return (
        <Paper
            elevation={5}
            sx={{
                padding: '15px',
            }}
        >
            <Grid container alignSelf="center" spacing={2}>
                <Grid item xs={10}>
                    <Typography variant="subtitle1">Pag {(index + 1).toString()}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton
                        onClick={() => {
                            handleRemovePage(index)
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Grid>
                {value.map((matchUp: matchUpObj, i: number) => {
                    return (
                        <Grid item xs={12} key={i}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        variant="outlined"
                                        label="Palavra"
                                        required
                                        inputProps={{
                                            maxLength: 12,
                                        }}
                                        fullWidth
                                        value={matchUp.word}
                                        onChange={(event) => handleWordChange(event, index, i)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <KeyboardDoubleArrowRight fontSize="small" />
                                </Grid>
                                <Grid item xs={7}>
                                    <RichTextField
                                        editorState={
                                            typeof matchUp.meaning === 'string'
                                                ? textToDraft(matchUp.meaning)
                                                : matchUp.meaning
                                        }
                                        onChange={handleMeaningChange}
                                        index={index}
                                        i={i}
                                        label={'Significado...'}
                                        maxLength={80}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )
}

export default MatchUpCell
