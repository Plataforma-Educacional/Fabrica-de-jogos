import { Button, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import RichTextField from 'components/RichTextField/RichTextField'
import AddIcon from '@mui/icons-material/Add'
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { quizQuestion } from 'types'
import { EditorState } from 'draft-js'

type Props = {
    index: number
    value: quizQuestion
    state: quizQuestion[]
    setState: Dispatch<SetStateAction<quizQuestion[]>>
}

const QuizCell = ({ index, value, state, setState }: Props) => {
    const handleRemoveQuestion = (index: number) => {
        if (state.length === 1) {
            return
        }
        let q = [...state]
        q.splice(index, 1)
        setState(q)
    }
    const handleCreateAnswer = (index: number) => {
        let q = [...state]
        let question = state[index]
        if (question.answers.length === 5) {
            return
        }
        question.answers.push('')
        q.splice(index, 1, question)
        setState(q)
    }
    const handleRemoveAnswer = (index: number, i: number) => {
        let q = [...state]
        let question = state[index]
        if (question.answers.length === 2) {
            return
        }
        question.answers.splice(i, 1)
        q.splice(index, 1, question)
        setState(q)
    }
    const handleQuestionTitleChange = (value: EditorState, index: number) => {
        let q = [...state]
        let question = q[index]
        question.title = value
        q.splice(index, 1, question)
        setState(q)
    }
    const handleAnswerChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
        i: number
    ) => {
        let q = [...state]
        let question = state[index]
        question.answers[i] = event.target.value
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
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Typography variant="subtitle1">Questão {(index + 1).toString()}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton
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
                        onChange={handleQuestionTitleChange}
                        index={index}
                        label={'Enunciado...'}
                        maxLength={160}
                    />
                </Grid>
                {value.answers.length <= 4 && (
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            size="small"
                            endIcon={<AddIcon fontSize="small" />}
                            onClick={() => {
                                handleCreateAnswer(index)
                            }}
                        >
                            Adicionar Alternativa
                        </Button>
                    </Grid>
                )}
                <Grid item xs={12} key={index}>
                    <Grid container alignItems="center" spacing={2}>
                        {value.answers.map((answer: String, i: number) => {
                            return (
                                <Grid item xs={12} key={i}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={10}>
                                            <TextField
                                                variant="outlined"
                                                label={i === 0 ? 'Alternativa correta' : `Alternativa ${i + 1}`}
                                                size="small"
                                                required
                                                inputProps={{
                                                    maxLength: 31,
                                                }}
                                                fullWidth
                                                color={i === 0 ? 'success' : 'primary'}
                                                value={answer}
                                                onChange={(event) => handleAnswerChange(event, index, i)}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton disabled={i === 0} onClick={() => handleRemoveAnswer(index, i)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default QuizCell
