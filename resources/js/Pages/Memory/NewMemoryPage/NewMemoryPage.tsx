import React, { ChangeEvent, FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Grid, Button, CircularProgress, Alert, TextField, Typography } from '@mui/material'
import 'react-image-crop/dist/ReactCrop.css'
import { useSelector } from 'react-redux'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import { useCreateGameObjectMutation } from 'services/portal'
import ImageEditor from 'components/ImageEditor/ImageEditor'
import { useCreateMemoryGameMutation } from 'services/games'
import GridSelect from 'components/GridSelect/GridSelect'
import { getError } from 'utils/errors'
import { RootState } from 'store'
import { gameObj } from 'types'

const NewMemoryPage: FunctionComponent = () => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [createMemoryGame, response] = useCreateMemoryGameMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [images, setImages] = useState<Blob[]>([new Blob(), new Blob()])
    const [size, setSize] = useState(2)
    const [name, setName] = useState('')
    const [layout, setLayout] = useState(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState('')

    const handleSize = (event: ChangeEvent<HTMLInputElement>, newSize: number) => {
        if (newSize === null) {
            return
        }
        setSize(newSize)
        if (newSize < images.length) {
            images.splice(newSize - 1, images.length - newSize)
        } else if (newSize > images.length) {
            let img = [...images]
            for (let i = 0; i < newSize - images.length; i++) {
                img.push(new Blob())
            }
            setImages(img)
        }
    }

    const updateImage = (newImage: Blob, index: number) => {
        let i = [...images]
        i.splice(index, 1, newImage)
        setImages(i)
    }

    const handleClose = () => {
        setName('')
        setLayout(1)
        setSerie([])
        setDiscipline('')
        setSize(2)
        setImages([new Blob(), new Blob()])
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
        const data = new FormData()
        images.map((image: Blob) => {
            data.append('options[]', image)
        })
        data.append('name', name)
        data.append('layout', layout.toString())

        createMemoryGame(data)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/memory-game/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/memory-game/${response?.data?.slug}`,
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
                        <b>Jogo da Memória</b>
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
                            sm={12}
                            xs={12}
                            justifyContent={{ lg: 'flex-end', xs: 'none' }}
                            display={{ lg: 'flex', xs: '' }}
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
                                xs: 'none',
                            }}
                            display={{ lg: 'flex', xs: '' }}
                            xl={4}
                            lg={3}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <DisciplineSelect value={discipline} setValue={setDiscipline} />
                        </Grid>
                        <Grid item alignSelf="center" xs={12}>
                            <LayoutSelect value={layout} setValue={setLayout} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <GridSelect size={size} handleSize={handleSize} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="flex-start" justifyContent="center" spacing={2}>
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
                        {images.map((image: Blob, index: number) => {
                            return <ImageEditor key={index} image={image} index={index} callback={updateImage} />
                        })}
                    </Grid>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    {response.isLoading || responsePortal.isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Button size="large" type="submit" variant="outlined">
                            Criar
                        </Button>
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default NewMemoryPage
