import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import GroupSortCell from 'components/GroupSortCell/GroupSortCell'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import { gameObj, gameState, groupSortOptions } from 'types'
import { useCreateGameObjectMutation } from 'services/portal'
import { useCreateGroupSortMutation } from 'services/games'
import { getError } from 'utils/errors'
import { RootState } from 'store'

const NewGroupSortPage: FunctionComponent = ({}) => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [name, setName] = useState<string>('')
    const [layout, setLayout] = useState<number>(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')
    const [groups, setGroups] = useState<groupSortOptions>([
        { title: '', items: ['', ''] },
        { title: '', items: ['', ''] },
    ])
    const [createGroupSort, response] = useCreateGroupSortMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const handleClose = () => {
        setName('')
        setLayout(1)
        setOpen(false)
        setAlert('')
        setGroups([
            { title: '', items: ['', ''] },
            { title: '', items: ['', ''] },
        ])
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
        if (groups[0].items.length === 0 || groups[1].items.length === 0) {
            setAlert('Adicione ao menos um item em cada grupo!')
            return
        }

        const body: gameState<groupSortOptions> = {
            name: name,
            layout: layout,
            options: groups,
        }
        createGroupSort(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/group-sort/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/group-sort/${response?.data?.slug}`,
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
                    {groups.map((group, index) => {
                        return (
                            <Grid key={index} item xs={12} md={6} lg={4}>
                                <GroupSortCell index={index} value={group} state={groups} setState={setGroups} />
                            </Grid>
                        )
                    })}
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

export default NewGroupSortPage
