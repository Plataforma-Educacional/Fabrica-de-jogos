import React, { FormEvent, FormEventHandler, FunctionComponent, useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect';
import FormatSelect from 'components/DragNDropFormat/DragNDropFormat';
import BackFAButton from 'components/BackFAButton/BackFAButton';
import SuccessModal from 'components/SuccessModal/SuccessModal';
import SeriesSelect from 'components/SeriesSelect/SeriesSelect';
import LayoutSelect from 'components/LayoutSelect/LayoutSelect';
import { useCreateGameObjectMutation } from 'services/portal';
import { useCreateDragNDropMutation } from 'services/games';
import { getError } from 'utils/errors';
import { RootState } from 'store';
import { gameObj } from 'types';

const NewDragNDropPage: FunctionComponent = ({}) => {
    const { token, origin } = useSelector((state: RootState) => state.user);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [createDragNDrop, response] = useCreateDragNDropMutation();
    const [createGameObject, responsePortal] = useCreateGameObjectMutation();
    const [name, setName] = useState<string>('');
    const [layout, setLayout] = useState<number>(1);
    const [serie, setSerie] = useState<string[]>([]);
    const [discipline, setDiscipline] = useState<string>('');
    const [format, setFormat] = useState<number>(0);

    const handleClose = () => {
        setLayout(1);
        setName('');
        setOpen(false);
    };
    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>): void => {
        event.preventDefault();
        if (serie === ['']) {
            setAlert('Selecione uma série!');
            return;
        }
        if (discipline === '') {
            setAlert('Selecione uma disciplina!');
            return;
        }

        const body = {
            name: name,
            layout: layout,
            options: [format],
        };

        createDragNDrop(body);
    };

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/drag-drop/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/drag-drop/${response?.data?.slug}`,
                disciplina_id: Number(discipline),
                series: serie,
            };
            createGameObject({ origin, token, ...obj });
        }
        response.isError && setAlert(getError(response.error));
    }, [response.isLoading]);

    useEffect(() => {
        responsePortal.isSuccess && setOpen(true);
        responsePortal.isError && setAlert(getError(responsePortal.error));
    }, [responsePortal.isLoading]);
    return (
        <>
            <BackFAButton />
            <SuccessModal open={open} handleClose={handleClose} />
            <Grid
                container
                alignSelf="center"
                alignItems="center"
                justifyContent="center"
                component="form"
                sx={{ marginTop: 8 }}
                onSubmit={handleSubmit}
                spacing={3}
            >
                <Grid item alignSelf="center" textAlign="center" xs={12}>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Arrastar e Soltar</b>
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
                {alert && (
                    <Grid item xs={12}>
                        <Alert
                            severity="warning"
                            onClick={() => {
                                setAlert('');
                            }}
                        >
                            {alert}
                        </Alert>
                    </Grid>
                )}
                <Grid item alignSelf="center" xs={12}>
                    <FormatSelect value={format} setValue={setFormat} />
                </Grid>
                <Grid item alignSelf="center" xs={12}>
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
    );
};

export default NewDragNDropPage;
