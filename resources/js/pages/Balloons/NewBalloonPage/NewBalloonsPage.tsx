import React, { FormEvent, FormEventHandler, useEffect, useState, FunctionComponent } from 'react'
import { Alert, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import { useSelector } from 'react-redux'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import RichTextField from 'components/RichTextField/RichTextField'
import BalloonCell from 'components/BalloonCell/BalloonCell'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import { useCreateGameObjectMutation } from 'services/portal'
import { balloonOptions, gameObj, gameState } from 'types'
import { useCreateBalloonsMutation } from 'services/games'
import draftToText from 'utils/draftToText'
import { getError } from 'utils/errors'
import { RootState } from 'store'

const NewBalloonsPage: FunctionComponent = ({}) => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [name, setName] = useState<string>('')
    const [layout, setLayout] = useState<number>(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState<string>('')
    const [question, setQuestion] = useState<EditorState>(EditorState.createEmpty())
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', ''])
    const [alternatives, setAlternatives] = useState<string[]>(['', '', '', '', ''])
    const [createBalloons, response] = useCreateBalloonsMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()

    const handleClose = () => {
        setName('')
        setQuestion(EditorState.createEmpty())
        setAnswers(['', '', '', ''])
        setAlternatives(['', '', '', ''])
        setSerie([''])
        setDiscipline('')
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
        if (answers.length > alternatives.length) {
            setAlert('É necessário ter mais alternativas erradas do que respostas certas!')
        }
        if (question.getCurrentContent().getPlainText().length < 10) {
            setAlert('A pergunta deve ter no mínimo 10 caracteres!')
            return
        }
        let textJson = convertToRaw(question.getCurrentContent())
        let markup = draftToText(textJson)
        const questionsJSON: balloonOptions = {
            question: markup,
            answers: answers,
            alternatives: alternatives,
        }
        let body: gameState<balloonOptions> = {
            name: name,
            layout: layout,
            options: questionsJSON,
        }
        createBalloons(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/bloons/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/bloons/${response?.data?.slug}`,
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
                        <b>Estoura Balões</b>
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
                <Grid item container alignItems="center" justifyContent="center" spacing={5}>
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
                </Grid>
                <Grid item>
                    <RichTextField
                        editorState={question}
                        onChange={(value: EditorState) => setQuestion(value)}
                        label={'Enunciado'}
                        maxLength={160}
                    />
                </Grid>
                <Grid item container alignItems="center" justifyContent="center" spacing={5}>
                    <Grid item xs={12} sm={5}>
                        <BalloonCell value={answers} setValue={setAnswers} correct={true} />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <BalloonCell value={alternatives} setValue={setAlternatives} correct={false} />
                    </Grid>
                </Grid>
                <Grid item justifyContent="center">
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

export default NewBalloonsPage
