import React, { useState, useEffect, ChangeEvent, FormEventHandler, FunctionComponent } from 'react'
import { Alert, Button, Grid, CircularProgress, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'react-router-dom'

import { useGetAnagramBySlugQuery, useUpdateAnagramMutation } from 'services/games'
import LayoutPicker from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import AnagramCell from 'components/AnagramCell/AnagramCell'
import { getError } from 'utils/errors'

const sliceIntoChunks = (arr: string[], chunkSize: number): string[][] => {
    const res = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize)
        res.push(chunk)
    }
    return res
}

const EditAnagramPage: FunctionComponent = () => {
    const { slug } = useParams()
    const { data, error, isLoading } = useGetAnagramBySlugQuery(slug as string)
    const [updateAnagram, response] = useUpdateAnagramMutation()

    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [layout, setLayout] = useState(1)
    const [pages, setPages] = useState([['', '', '', '']])
    const handleAddWord = () => {
        if (pages.length >= 8) {
            setAlert('O numero máximo de páginas nesse jogo é 8!')
            return
        }
        let p = [...pages]
        p.push(['', '', '', ''])
        setPages(p)
    }
    const handleSubmit: FormEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (pages.length < 1) {
            setAlert('O jogo deve ter no mínimo 1 página!')
            return
        }
        let wordsJson: string[] = []
        pages.map((page) => {
            page.map((item) => {
                wordsJson.push(item)
            })
        })
        const body = {
            layout: layout,
            options: wordsJson,
        }
        updateAnagram({ ...body, slug })
    }

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            setPages(sliceIntoChunks(data.options as string[], 4))
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
            <SuccessModal open={open} handleClose={() => setOpen(false)} />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                component="form"
                onSubmit={handleSubmit}
                spacing={3}
                sx={{ marginTop: 8 }}
            >
                <Grid item alignSelf="center" textAlign="center" xs={12}>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Anagrama</b>
                    </Typography>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <LayoutPicker value={layout} setValue={setLayout} />
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <Button onClick={handleAddWord} endIcon={<AddIcon fontSize="small" />} variant="contained">
                        Adicionar Pagina
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
                        {pages.map((page, index) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <AnagramCell index={index} value={page} state={pages} setState={setPages} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
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

export default EditAnagramPage
