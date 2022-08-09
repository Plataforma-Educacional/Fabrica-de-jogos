import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useGetPuzzleBySlugQuery, useUpdatePuzzleMutation } from 'services/games'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import LayoutPicker from 'components/LayoutSelect/LayoutSelect'
import PiecesSelect from 'components/PiecesSelect/PiecesSelect'
import ImageSelect from 'components/PuzzleSelect/PuzzleSelect'
import { getError } from 'utils/errors'

const EditPuzzlePage: FunctionComponent = ({}) => {
    const { slug } = useParams()
    const { data, error, isLoading } = useGetPuzzleBySlugQuery(slug as string)
    const [updatePuzzle, response] = useUpdatePuzzleMutation()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [layout, setLayout] = useState<number>(1)
    const [image, setImage] = useState(0)
    const [pieces, setPieces] = useState<number>(2)

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>): void => {
        event.preventDefault()

        const body = {
            layout: layout,
            options: [pieces, image],
        }

        updatePuzzle({ slug, ...body })
    }
    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            setPieces(data.options[0])
            setImage(data.options[1])
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
                        <b>Quebra-Cabeça</b>
                    </Typography>
                </Grid>
                <LayoutPicker value={layout} setValue={setLayout} />
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
                        <Grid item alignSelf="center" xs={12}>
                            <PiecesSelect value={pieces} setValue={setPieces} />
                        </Grid>
                        <Grid item alignSelf="center" xs={12}>
                            <ImageSelect value={image} setValue={setImage} />
                        </Grid>
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

export default EditPuzzlePage
