import React, { ChangeEvent, FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Grid, Button, CircularProgress, Alert, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import 'react-image-crop/dist/ReactCrop.css'

import { useUpdateMemoryGameMutation, useGetMemoryGameBySlugQuery } from 'services/games'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import ImageEditor from 'components/ImageEditor/ImageEditor'
import GridSelect from 'components/GridSelect/GridSelect'
import { getError } from 'utils/errors'
import fetchBlob from 'utils/fetchBlob'

const EditMemoryPage: FunctionComponent = () => {
    const { slug } = useParams()
    const [updateMemoryGame, response] = useUpdateMemoryGameMutation()
    const { data, error, isLoading } = useGetMemoryGameBySlugQuery(slug as string)
    const [open, setOpen] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')
    const [images, setImages] = useState<Blob[]>([new Blob(), new Blob()])
    const [size, setSize] = useState<number>(2)
    const [layout, setLayout] = useState<number>(1)

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

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        const data = new FormData()
        images.map((image: Blob) => {
            data.append('options[]', image)
        })
        data.append('layout', layout.toString())
        updateMemoryGame({ slug, data })
    }

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            setImages(fetchBlob(data.options as string[]))
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
                <Grid item alignSelf="center" xs={12}>
                    <LayoutSelect value={layout} setValue={setLayout} />
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <GridSelect size={size} handleSize={handleSize} />
                </Grid>
                <Grid item xs={12}>
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
                        {images.map((image: Blob, index: number) => {
                            return <ImageEditor key={index} image={image} index={index} callback={updateImage} />
                        })}
                    </Grid>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    {response.isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Button size="large" type="submit" variant="outlined" disabled={Boolean(data?.approved_at)}>
                            Salvar
                        </Button>
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default EditMemoryPage
