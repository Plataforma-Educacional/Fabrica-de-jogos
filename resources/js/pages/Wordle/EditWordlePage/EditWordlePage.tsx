import React, { FormEventHandler, useEffect, useState } from 'react'
import { Button, Grid, Alert, CircularProgress, Typography, TextField } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useUpdateWordleMutation, useGetWordleBySlugQuery } from 'services/games'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import { getError } from 'utils/errors'

const EditWordSearch = () => {
    const { slug } = useParams()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [word, setWord] = useState('')
    const [layout, setLayout] = useState(1)
    const { data, error, isLoading } = useGetWordleBySlugQuery(slug as string)
    const [updateWordle, response] = useUpdateWordleMutation()

    const handleSubmit: FormEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        let body = {
            layout: layout,
            options: [word],
        }
        updateWordle({ slug, ...body })
    }

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            setWord(data.options[0])
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

export default EditWordSearch
