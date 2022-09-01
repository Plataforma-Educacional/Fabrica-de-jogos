import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Button, TextField, Grid, Alert, CircularProgress, Typography } from '@mui/material'
import { EditorState, convertToRaw } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import { gameObj, quizQuestion, quizOptions, gameState } from 'types'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import { useCreateGameObjectMutation } from 'services/portal'
import { useCreateQuizMutation } from 'services/games'
import QuizCell from 'components/QuizCell/QuizCell'
import draftToText from 'utils/draftToText'
import { getError } from 'utils/errors'
import { RootState } from 'store'

const NewQuizPage: FunctionComponent = () => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [name, setName] = useState('')
    const [layout, setLayout] = useState(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState('')
    const initialState: quizQuestion[] = [{ title: EditorState.createEmpty(), answers: ['', ''] }]
    const [questions, setQuestions] = useState(initialState)
    const [createQuiz, response] = useCreateQuizMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const handleCreateQuestion = () => {
        if (questions.length >= 8) {
            setAlert('O número máximo de questões para esse jogo é 8!')
            return
        }
        setQuestions([...questions, { title: EditorState.createEmpty(), answers: ['', ''] }])
    }

    const handleClose = () => {
        setName('')
        setQuestions([{ title: EditorState.createEmpty(), answers: ['', ''] }])
        setLayout(1)
        setOpen(false)
    }

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (serie === ['']) {
            setAlert('Selecione uma série!')
            return
        }
        if (discipline === '') {
            setAlert('Selecione uma disciplina!')
            return
        }
        let questionsJSON: quizQuestion[] = []
        let error = false
        questions.map((item: quizQuestion) => {
            const title = item.title as EditorState
            const content = title.getCurrentContent()
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
        let body: gameState<quizOptions> = {
            name: name,
            layout: layout,
            options: questionsJSON,
        }
        createQuiz(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/quiz/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/quiz/${response?.data?.slug}`,
                disciplina_id: Number(discipline),
                series: serie,
            }
            createGameObject({ token, origin, ...obj })
        }
        response.isError && setAlert(getError(response.error))
    }, [response.isLoading])

    useEffect(() => {
        responsePortal.isSuccess && setOpen(true)
        responsePortal.isError && setAlert(getError(responsePortal.error))
    }, [responsePortal.isLoading])

    return (
        <>
            <SuccessModal open={open} handleClose={handleClose} />
            <BackFAButton />
            <Grid
                container
                marginTop={2}
                alignItems="center"
                justifyContent="center"
                direction="column"
                component="form"
                onSubmit={handleSubmit}
                spacing={2}
                textAlign="center"
            >
                <Grid item>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Quiz</b>
                    </Typography>
                </Grid>
                <Grid
                    item
                    container
                    direction={{ lg: 'row', md: 'column' }}
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item justifyContent="flex-end" display="flex" lg={4} md={12}>
                        <SeriesSelect value={serie} setValue={setSerie} />
                    </Grid>
                    <Grid item lg={4} md={12}>
                        <TextField
                            label="Nome"
                            name="name"
                            variant="outlined"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            sx={{ minWidth: { sm: 290, xs: 260 } }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item justifyContent="flex-start" display="flex" lg={4} md={12}>
                        <DisciplineSelect value={discipline} setValue={setDiscipline} />
                    </Grid>
                </Grid>
                <Grid item container alignItems="flex-start" justifyContent="center" spacing={5}>
                    <Grid item xs={12}>
                        <LayoutSelect value={layout} setValue={setLayout} />
                    </Grid>
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
                    <Grid item xs={12}>
                        <Button
                            onClick={handleCreateQuestion}
                            endIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Adicionar Questão
                        </Button>
                    </Grid>
                    {questions.map((question: quizQuestion, index: number) => {
                        return (
                            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                <QuizCell index={index} value={question} state={questions} setState={setQuestions} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid item>
                    {response.isLoading || responsePortal.isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Button size="large" type="submit" variant="outlined">
                            Salvar
                        </Button>
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default NewQuizPage
