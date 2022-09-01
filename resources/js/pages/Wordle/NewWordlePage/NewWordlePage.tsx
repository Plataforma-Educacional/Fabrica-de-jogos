import React, { useState, useEffect, FormEvent, FormEventHandler } from 'react'
import { Alert, Button, Grid, TextField, Typography, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import { useCreateGameObjectMutation } from 'services/portal'
import { useCreateWordleMutation } from 'services/games'
import { getError } from 'utils/errors'
import { RootState } from 'store'
import { gameObj } from 'types'

const NewWordlePage = () => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [createWordle, response] = useCreateWordleMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const [name, setName] = useState<string>('')
    const [layout, setLayout] = useState<number>(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState<string>('')
    const [word, setWord] = useState<string>('')

    const handleClose = () => {
        setWord('')
        setLayout(1)
        setName('')
        setOpen(false)
    }

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>): void => {
        event.preventDefault()
        if (serie === ['']) {
            setAlert('Selecione uma série!')
            return
        }
        if (discipline === '') {
            setAlert('Selecione uma disciplina!')
            return
        }
        const body = {
            name: name,
            layout: layout,
            options: [word],
        }
        createWordle(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/wordle/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/wordle/${response?.data?.slug}`,
                disciplina_id: Number(discipline),
                series: serie,
            }
            createGameObject({ origin, token, ...obj })
        }
        response.isError && setAlert(getError(response.error))
    }, [response.isLoading])

    useEffect(() => {
        responsePortal.isSuccess && setOpen(true)
        responsePortal.isError && setAlert(getError(responsePortal.error))
    }, [responsePortal.isLoading])

    return (
        <>
            <BackFAButton />
            <SuccessModal open={open} handleClose={handleClose} />
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
                        <b>Organize as Letras</b>
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
                        <TextField
                            label="Palavra"
                            name="word"
                            variant="outlined"
                            value={word}
                            onChange={(event) => setWord(event.target.value)}
                            required
                        />
                    </Grid>
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

export default NewWordlePage
