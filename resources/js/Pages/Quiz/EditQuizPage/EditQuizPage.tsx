import React, { ChangeEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Button, Grid, Alert, CircularProgress, Typography } from '@mui/material'
import { EditorState, convertToRaw } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'react-router-dom'

import { useUpdateQuizMutation, useGetQuizBySlugQuery } from 'services/games'
import { quizQuestion as questionObj, quizQuestion } from 'types'
import LayoutPicker from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import QuizCell from 'components/QuizCell/QuizCell'
import draftToText from 'utils/draftToText'
import textToDraft from 'utils/textToDraft'
import { getError } from 'utils/errors'

const initialState: quizQuestion = {
    title: EditorState.createEmpty(),
    answers: ['', ''],
}

const EditQuiz: FunctionComponent = () => {
    const { slug } = useParams()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [layout, setLayout] = useState(1)
    const [questions, setQuestions] = useState([initialState])
    const [updateQuiz, response] = useUpdateQuizMutation()
    const { data, error, isLoading } = useGetQuizBySlugQuery(slug as string)
    const handleCreateQuestion = () => {
        if (questions.length >= 8) {
            setAlert('O número máximo de questões para esse jogo é 8!')
            return
        }
        setQuestions([...questions, { ...initialState }])
    }

    const handleSubmit: FormEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        let questionsJSON: quizQuestion[] = []
        let error = false
        questions.map((item: quizQuestion) => {
            const title = item.title as EditorState
            let content = title.getCurrentContent()
            if (content.getPlainText('').length === 0) {
                setAlert('Preencha todos os campos!')
                error = true
                return
            }
            let textJson = convertToRaw(content)
            let markup = draftToText(textJson)
            questionsJSON.push({
                answers: item.answers,
                title: markup,
            })
        })
        if (error) {
            return
        }
        let body = {
            layout: layout,
            options: questionsJSON,
        }
        updateQuiz({ slug, ...body })
    }

    const formatQuestions = (raw: questionObj[]) => {
        raw.map((question) => {
            if (typeof question.title !== 'string') {
                return
            }
            question.title = textToDraft(question.title)
        })
        return raw
    }

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            let deep_copy = JSON.parse(JSON.stringify(data.options))
            setQuestions(formatQuestions(deep_copy))
            setLayout(data.layout)
        }
        error && setAlert(getError(error))
    }, [isLoading])

    useEffect(() => {
        response.isSuccess && setOpen(true)
        response.isError && setAlert(getError(response.error))
    }, [response.isLoading])

    if (isLoading)
        return (
            <CircularProgress
                sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        )

    return (
        <>
            <SuccessModal
                open={open}
                handleClose={() => {
                    setOpen(false)
                }}
            />
            <Grid
                container
                component="form"
                justifyContent="center"
                onSubmit={handleSubmit}
                sx={{ marginTop: 8 }}
                spacing={3}
            >
                <Typography color="primary" variant="h2" component="h2">
                    <b>Quiz</b>
                </Typography>
            </Grid>
            <Grid container component="form" justifyContent="center" onSubmit={handleSubmit} spacing={3}>
                <Grid item xs={12}>
                    <LayoutPicker value={layout} setValue={setLayout} />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={handleCreateQuestion} endIcon={<AddIcon fontSize="small" />} variant="contained">
                        Adicionar Questão
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="flex-start" justifyContent="center" spacing={3}>
                        {alert && (
                            <Grid item xs={12}>
                                <Alert
                                    severity="warning"
                                    onClick={() => {
                                        setAlert('')
                                    }}
                                >
                                    {alert}
                                </Alert>
                            </Grid>
                        )}
                        {questions.map((question: quizQuestion, index: number) => {
                            return (
                                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                    <QuizCell
                                        index={index}
                                        value={question}
                                        state={questions}
                                        setState={setQuestions}
                                    />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {response.isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Grid item xs={12}>
                            <Button size="large" type="submit" variant="outlined" disabled={Boolean(data?.approved_at)}>
                                Salvar
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    )
}
export default EditQuiz
