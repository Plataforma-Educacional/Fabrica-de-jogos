import React, { ChangeEvent, FunctionComponent, SetStateAction, Dispatch } from 'react'
import { FormControlLabel, FormGroup, Grid, IconButton, Paper, Switch, Typography } from '@mui/material'
import RichTextField from 'components/RichTextField/RichTextField'
import DeleteIcon from '@mui/icons-material/Delete'
import { trueOrFalseQuestion } from 'types'
import { EditorState } from 'draft-js'

type Props = {
    index: number
    value: trueOrFalseQuestion
    state: trueOrFalseQuestion[]
    setState: Dispatch<SetStateAction<trueOrFalseQuestion[]>>
}

const TrueOrFalseCell: FunctionComponent<Props> = ({ index, value, state, setState }) => {
    const handleRemoveQuestion = (index: number) => {
        if (state.length === 1) {
            return
        }
        let q = [...state]
        q.splice(index, 1)
        setState(q)
    }
    const handleQuestionTitleChange = (value: EditorState, index: number) => {
        let q = [...state]
        let question = q[index]
        question.title = value
        q.splice(index, 1, question)
        setState(q)
    }
    const handleAnswerChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let q = [...state]
        let question = q[index]
        question.answer = event.target.checked
        q.splice(index, 1, question)
        setState(q)
    }

    return (
        <Paper
            elevation={5}
            sx={{
                padding: '15px',
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={10}>
                    <Typography variant="subtitle1">Questão {(index + 1).toString()}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton
                        disabled={state.length === 1}
                        onClick={() => {
                            handleRemoveQuestion(index)
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <RichTextField
                        editorState={value.title as EditorState}
                        onChange={(editorState: EditorState) => handleQuestionTitleChange(editorState, index)}
                        label={'Enunciado...'}
                        maxLength={160}
                    />
                </Grid>
                <Grid item container alignItems="center" justifyContent="center" xs={12}>
                    <Grid item textAlign="right" xs={4}>
                        <Typography variant="subtitle1">Falso</Typography>
                    </Grid>
                    <Grid item justifyContent="center" display="flex" xs={3}>
                        <Switch
                            size="medium"
                            checked={value.answer}
                            onChange={(event) => {
                                handleAnswerChange(event, index)
                            }}
                        />
                    </Grid>
                    <Grid item textAlign="left" xs={4}>
                        <Typography variant="subtitle1">Verdadeiro</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default TrueOrFalseCell
