import React, { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { Button, Grid, TextField, Alert, Typography } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import { useCreateGameObjectMutation } from 'services/portal'
import { useCreateWordSearchMutation } from 'services/games'
import WordTipCell from 'components/WordTipCell/WordTipCell'
import draftToText from 'utils/draftToText'
import { gameObj, wordObj } from 'types'
import { getError } from 'utils/errors'
import { RootState } from 'store'

const initialState: wordObj[] = [
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

const NewWordSearchPage = () => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [words, setWords] = useState(initialState)
    const [name, setName] = useState<string>('')
    const [layout, setLayout] = useState<number>(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState<string>('')
    const [createWordSearch, response] = useCreateWordSearchMutation()
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
        setWords([...initialState])
        setLayout(1)
        setOpen(false)
    }

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>) => {
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
        createWordSearch(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/word-search/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/word-search/${response?.data?.slug}`,
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
                        <b>Caça-Palavras</b>
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
                        <Button onClick={handleAddWord} endIcon={<AddIcon fontSize="small" />} variant="contained">
                            Adicionar Palavra
                        </Button>
                    </Grid>
                    {words.map((item: wordObj, index: number) => {
                        return (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                <WordTipCell index={index} value={item} state={words} setState={setWords} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid item>
                    <Button size="large" type="submit" variant="outlined">
                        Criar
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default NewWordSearchPage
