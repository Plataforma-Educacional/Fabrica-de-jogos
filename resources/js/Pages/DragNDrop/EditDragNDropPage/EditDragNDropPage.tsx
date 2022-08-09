import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useGetDragNDropBySlugQuery, useUpdateDragNDropMutation } from 'services/games'
import FormatSelect from 'components/DragNDropFormat/DragNDropFormat'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import LayoutPicker from 'components/LayoutSelect/LayoutSelect'
import { getError } from 'utils/errors'

const EditDragNDrop: FunctionComponent = ({}) => {
    const { slug } = useParams()
    const { data, error, isLoading } = useGetDragNDropBySlugQuery(slug as string)
    const [updateDragNDrop, response] = useUpdateDragNDropMutation()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [layout, setLayout] = useState<number>(1)
    const [format, setFormat] = useState<number>(0)

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>): void => {
        event.preventDefault()

        const body = {
            layout: layout,
            options: [format],
        }

        updateDragNDrop({ slug, ...body })
    }
    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            setFormat(Number(data.options))
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
                component="form"
                onSubmit={handleSubmit}
                sx={{ marginTop: 8 }}
                spacing={3}
            >
                <Grid item alignSelf="center" textAlign="center" xs={12}>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Arrasta e Solta</b>
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
                        <FormatSelect value={format} setValue={setFormat} />
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

export default EditDragNDrop
