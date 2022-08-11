import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { Button, Grid, Alert, CircularProgress, Typography } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'react-router-dom'

import { useUpdateWordSearchMutation, useGetWordSearchBySlugQuery } from 'services/games'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import LayoutPicker from 'components/LayoutSelect/LayoutSelect'
import WordTipCell from 'components/WordTipCell/WordTipCell'
import draftToText from 'utils/draftToText'
import textToDraft from 'utils/textToDraft'
import { getError } from 'utils/errors'
import { wordObj } from 'types'

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

const EditWordSearch = () => {
    const { slug } = useParams()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [words, setWords] = useState(initialState)
    const [layout, setLayout] = useState(1)
    const { data, error, isLoading } = useGetWordSearchBySlugQuery(slug as string)
    const [updateWordSearch, response] = useUpdateWordSearchMutation()

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

    const handleSubmit: FormEventHandler = (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (words.length < 3) {
            setAlert('O jogo deve ter no mínimo 3 palavras!')
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
            layout: layout,
            options: wordsJSON,
        }
        updateWordSearch({ slug, ...body })
    }

    const formatTips = (raw: wordObj[]): wordObj[] => {
        raw.map((word: wordObj) => {
            if (typeof word.tip !== 'string') {
                return
            }
            word.tip = textToDraft(word.tip)
        })
        return raw
    }

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            let deep_copy = JSON.parse(JSON.stringify(data.options))
            setWords(formatTips(deep_copy))
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
                        <b>Caça-Palavras</b>
                    </Typography>
                </Grid>
                <LayoutPicker value={layout} setValue={setLayout} />
                <Grid item xs={12}>
                    <Button onClick={handleAddWord} endIcon={<AddIcon fontSize="small" />} variant="contained">
                        Adicionar Palavra
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
                        {words.map((item: wordObj, index: number) => {
                            return (
                                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                    <WordTipCell index={index} value={item} state={words} setState={setWords} />
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

export default EditWordSearch
