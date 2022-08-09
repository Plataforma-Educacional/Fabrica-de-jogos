import React, { ChangeEvent, FormEventHandler, useEffect, useState, FunctionComponent } from 'react'
import { Alert, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import WordTipCell from 'components/WordTipCell/WordTipCell'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import { useCreateGameObjectMutation } from 'services/portal'
import { useCreateCryptogramMutation } from 'services/games'
import { cryptogramObj, gameObj, wordObj } from 'types'
import AddIcon from '@mui/icons-material/Add'
import draftToText from 'utils/draftToText'
import { getError } from 'utils/errors'

const initialState: cryptogramObj[] = [
    {
        word: '',
        tip: EditorState.createEmpty(),
    },
    {
        word: '',
        tip: EditorState.createEmpty(),
    },
    {
        word: '',
        tip: EditorState.createEmpty(),
    },
]

const NewCryptogramPage: FunctionComponent = () => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [words, setWords] = useState(initialState)
    const [name, setName] = useState<string>('')
    const [layout, setLayout] = useState<number>(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState<string>('')
    const [createCryptogram, response] = useCreateCryptogramMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const handleAddWord = () => {
        if (words.length >= 8) {
            setAlert('O numero máximo de palavras nesse jogo é 8!')
            return
        }
        let p = [...words]
        p.push({
            word: '',
            tip: EditorState.createEmpty(),
        })
        setWords(p)
    }

    const handleClose = () => {
        setName('')
        setWords(initialState)
        setLayout(1)
        setOpen(false)
    }
    const handleSubmit: FormEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (words.length < 3) {
            setAlert('O jogo deve ter no mínimo 3 palavras!')
            return
        }
        if (serie === ['']) {
            setAlert('Selecione uma série!')
            return
        }
        if (discipline === '') {
            setAlert('Selecione uma disciplina!')
            return
        }
        let wordsJSON: wordObj[] = []
        let error = false
        words.map((word: wordObj) => {
            const tip = word.tip as EditorState
            let content = tip.getCurrentContent()
            if (content.getPlainText('').length === 0) {
                setAlert('Preencha todos os campos!')
                error = true
                return
            }
            let textJson = convertToRaw(content)
            let markup = draftToText(textJson)
            wordsJSON.push({
                tip: markup,
                word: word.word,
            })
        })
        if (error) {
            return
        }
        let body = {
            name: name,
            layout: layout,
            options: wordsJSON,
        }
        createCryptogram(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/cryptogram/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/cryptogram/${response?.data?.slug}`,
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
                component="form"
                justifyContent="center"
                onSubmit={handleSubmit}
                sx={{ marginTop: 8 }}
                spacing={3}
            >
                <Grid item alignSelf="center" textAlign="center" xs={12}>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Criptograma</b>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={1} display="flex">
                        <Grid
                            alignSelf="center"
                            item
                            xl={4}
                            lg={3}
                            md={12}
                            justifyContent={{ lg: 'flex-end', md: 'none' }}
                            display={{ lg: 'flex', md: 'block' }}
                        >
                            <SeriesSelect value={serie} setValue={setSerie} />
                        </Grid>
                        <Grid item alignSelf="center" xl={4} lg={3}>
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
                        <Grid
                            alignSelf="center"
                            item
                            justifyContent={{
                                lg: 'flex-start',
                                md: 'none',
                            }}
                            display={{ lg: 'flex', md: 'block' }}
                            xl={4}
                            lg={3}
                            md={12}
                        >
                            <DisciplineSelect value={discipline} setValue={setDiscipline} />
                        </Grid>
                        <Grid item alignSelf="center" xs={12}>
                            <LayoutSelect value={layout} setValue={setLayout} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <Button onClick={handleAddWord} endIcon={<AddIcon fontSize="small" />} variant="contained">
                        Adicionar Palavra
                    </Button>
                </Grid>
                <Grid item alignSelf="center" lg={12}>
                    <Grid container alignItems="flex-start" justifyContent="center" spacing={3}>
                        {alert && (
                            <Grid item alignSelf="center" xs={12}>
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
                        {words.map((item: wordObj, index: number) => {
                            return (
                                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                    <WordTipCell index={index} value={item} state={words} setState={setWords} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
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

export default NewCryptogramPage
