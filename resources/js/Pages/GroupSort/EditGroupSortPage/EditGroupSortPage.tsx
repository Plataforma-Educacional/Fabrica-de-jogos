import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useUpdateGroupSortMutation, useGetGroupSortBySlugQuery } from 'services/games'
import GroupSortCell from 'components/GroupSortCell/GroupSortCell'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import { gameState, groupSortOptions } from 'types'
import { getError } from 'utils/errors'

const EditGroupSortPage: FunctionComponent = ({}) => {
    const { slug } = useParams()
    const { data, error, isLoading } = useGetGroupSortBySlugQuery(slug as string)
    const [updateGroupSort, response] = useUpdateGroupSortMutation()
    const [layout, setLayout] = useState<number>(1)
    const [open, setOpen] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')
    const [groups, setGroups] = useState<groupSortOptions>([
        { title: '', items: ['', ''] },
        { title: '', items: ['', ''] },
    ])

    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (groups[0].items.length === 0 || groups[1].items.length === 0) {
            setAlert('Adicione ao menos um item em cada grupo!')
            return
        }

        const body: Partial<gameState<groupSortOptions>> = {
            layout: layout,
            options: groups,
        }
        updateGroupSort({ slug, ...body })
    }

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!')
            let deep_copy = JSON.parse(JSON.stringify(data.options))
            setGroups(deep_copy)
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
                        <b>Agrupamentos</b>
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
                    {groups.map((group, index) => {
                        return (
                            <Grid key={index} item xs={12} md={6} lg={4}>
                                <GroupSortCell index={index} value={group} state={groups} setState={setGroups} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid item>
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

export default EditGroupSortPage
