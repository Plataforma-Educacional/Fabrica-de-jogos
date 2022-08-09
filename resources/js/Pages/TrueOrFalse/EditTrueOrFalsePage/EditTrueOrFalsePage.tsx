import React, { ChangeEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Button, Grid, Alert, CircularProgress, Typography } from '@mui/material'
import { EditorState, convertToRaw } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'react-router-dom'

import { useUpdateTrueOrFalseMutation, useGetTrueOrFalseBySlugQuery } from 'services/games'
import TrueOrFalseCell from 'components/TrueOrFalseCell/TrueOrFalseCell'
import LayoutPicker from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import { trueOrFalseQuestion } from 'types'
import draftToText from 'utils/draftToText'
import textToDraft from 'utils/textToDraft'
import { getError } from 'utils/errors'

const EditTrueOrFalsePage: FunctionComponent = () => {
    const { slug } = useParams()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [layout, setLayout] = useState(1)
    const { data, error, isLoading } = useGetTrueOrFalseBySlugQuery(slug as string)
    const [updateTrueOrFalse, response] = useUpdateTrueOrFalseMutation()
    const initialState: trueOrFalseQuestion[] = [{ title: EditorState.createEmpty(), answer: false }]
    const [questions, setQuestions] = useState(initialState)

    const handleCreateQuestion = () => {
        if (questions.length >= 9) {
            setAlert('O número máximo de questões para esse jogo é 9!')
            return
        }
        setQuestions([...questions, { title: EditorState.createEmpty(), answer: false }])
    }

    const handleSubmit: FormEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        let questionsJSON: trueOrFalseQuestion[] = []
        let error = false
        questions.map((item: trueOrFalseQuestion) => {
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
                answer: item.answer,
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
        updateTrueOrFalse({ slug, ...body })
    }

    const formatQuestions = (raw: trueOrFalseQuestion[]) => {
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
                <Grid item alignSelf="center" textAlign="center" xs={12}>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Verdadeiro ou Falso</b>
                    </Typography>
                </Grid>
                <LayoutPicker value={layout} setValue={setLayout} />
                <Grid item xs={12}>
                    <Button onClick={handleCreateQuestion} endIcon={<AddIcon fontSize="small" />} variant="contained">
                        Adicionar Questão
                    </Button>
                </Grid>
                <Grid item lg={12}>
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
                        {questions.map((question: trueOrFalseQuestion, index: number) => {
                            return (
                                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                    <TrueOrFalseCell
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

export default EditTrueOrFalsePage
