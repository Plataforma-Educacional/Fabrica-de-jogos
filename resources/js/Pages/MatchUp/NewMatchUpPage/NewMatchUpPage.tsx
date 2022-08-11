import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Button, TextField, Grid, Alert, CircularProgress, Typography } from '@mui/material'
import { EditorState, convertToRaw } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'

import { gameObj, matchUpObj, matchUpPage, matchUpOptions, gameState } from 'types'
import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import { useCreateGameObjectMutation } from 'services/portal'
import MatchUpCell from 'components/MatchUpCell/MatchUpCell'
import { useCreateMatchUpMutation } from 'services/games'
import draftToText from 'utils/draftToText'
import { getError } from 'utils/errors'
import { RootState } from 'store'

const initialState: matchUpPage[] = [
    [
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
    ],
]

const NewMatchUpPage: FunctionComponent = () => {
    const [createMatchUp, response] = useCreateMatchUpMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [name, setName] = useState<string>('')
    const [layout, setLayout] = useState<number>(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState<string>('')
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [pages, setPages] = useState(initialState)
    const handleCreatePage = () => {
        if (pages.length >= 10) {
            setAlert('O número máximo de páginas para esse jogo é 10!')
            return
        }
        setPages([
            ...pages,
            [
                {
                    word: '',
                    meaning: EditorState.createEmpty(),
                },
                {
                    word: '',
                    meaning: EditorState.createEmpty(),
                },
                {
                    word: '',
                    meaning: EditorState.createEmpty(),
                },
                {
                    word: '',
                    meaning: EditorState.createEmpty(),
                },
            ],
        ])
    }
    const handleClose = () => {
        setLayout(1)
        setName('')
        setPages([...initialState])
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
        let matchUpsJSON: matchUpPage[] = []
        let error = false
        pages.map((page: matchUpPage) => {
            let matchUps: matchUpObj[] = []
            page.map((matchUp: matchUpObj) => {
                const meanings: EditorState = matchUp.meaning as EditorState
                let content = meanings.getCurrentContent()
                if (content.getPlainText('').length === 0) {
                    setAlert('Preencha todos os campos!')
                    error = true
                    return
                }
                let textJson = convertToRaw(content)
                let markup = draftToText(textJson)
                matchUps.push({
                    meaning: markup,
                    word: matchUp.word,
                })
            })
            matchUpsJSON.push(matchUps)
        })
        if (error) {
            return
        }
        let body: Partial<gameState<matchUpOptions>> = {
            name: name,
            layout: layout,
            options: matchUpsJSON,
        }
        createMatchUp(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/match-up/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/match-up/${response?.data?.slug}`,
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
                        <b>Combinação</b>
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
                        <Button onClick={handleCreatePage} endIcon={<AddIcon fontSize="small" />} variant="contained">
                            Adicionar página
                        </Button>
                    </Grid>
                    {pages.map((page: matchUpPage, index: number) => {
                        return (
                            <Grid key={index} item alignSelf="center" xs={12} md={6}>
                                <MatchUpCell index={index} value={page} state={pages} setState={setPages} />
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
export default NewMatchUpPage
