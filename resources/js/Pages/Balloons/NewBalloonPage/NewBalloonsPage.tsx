import React, { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Grid, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import { useSelector } from 'react-redux';

import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect';
import RichTextField from 'components/RichTextField/RichTextField';
import BalloonsWords from 'components/BalloonsWords/BalloonsWords';
import SeriesSelect from 'components/SeriesSelect/SeriesSelect';
import LayoutSelect from 'components/LayoutSelect/LayoutSelect';
import SuccessModal from 'components/SuccessModal/SuccessModal';
import BackFAButton from 'components/BackFAButton/BackFAButton';
import { useCreateGameObjectMutation } from 'services/portal';
import { balloonOptions, gameObj, gameState } from 'types';
import { useCreateBalloonsMutation } from 'services/games';
import draftToText from 'utils/draftToText';
import { getError } from 'utils/errors';
import { RootState } from 'store';

export default function NewBalloonsPage({}) {
    const { token, origin } = useSelector((state: RootState) => state.user);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [name, setName] = useState<string>('');
    const [layout, setLayout] = useState<number>(1);
    const [serie, setSerie] = useState<string[]>([]);
    const [discipline, setDiscipline] = useState<string>('');
    const [question, setQuestion] = useState<EditorState>(EditorState.createEmpty());
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
    const [alternatives, setAlternatives] = useState<string[]>(['', '', '', '', '']);
    const [createBalloons, response] = useCreateBalloonsMutation();
    const [createGameObject, responsePortal] = useCreateGameObjectMutation();

    const handleLayout = (event: ChangeEvent<HTMLInputElement>, newLayout: number) => {
        if (newLayout === null) {
            return;
        }
        setLayout(newLayout);
    };
    const handleAnswerChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let ans = [...answers];
        ans[index] = event.target.value;
        setAnswers(ans);
    };
    const handleAddAnswer = () => {
        if (answers.length > 15) {
            return;
        }
        setAnswers([...answers, '']);
    };
    const handleRemoveAnswer = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let ans = [...answers];
        ans.splice(index, 1);
        setAnswers(ans);
    };
    const handleAlternativeChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let alt = [...alternatives];
        alt[index] = event.target.value;
        setAlternatives(alt);
    };
    const handleAddAlternative = () => {
        if (alternatives.length > 15) {
            return;
        }
        setAlternatives([...alternatives, '']);
    };
    const handleRemoveAlternative = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        let alt = [...alternatives];
        alt.splice(index, 1);
        setAlternatives(alt);
    };
    const handleClose = () => {
        setName('');
        setQuestion(EditorState.createEmpty());
        setAnswers(['', '', '', '']);
        setAlternatives(['', '', '', '']);
        setSerie(['']);
        setDiscipline('');
        setLayout(1);
        setOpen(false);
    };
    const seriesChange = (event: SelectChangeEvent<string[]>): void => {
        const value = event.target.value;
        if (value !== null) {
            setSerie(typeof value === 'string' ? value.split(',') : value);
        }
    };
    const disciplineChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value !== null && value !== discipline) {
            setDiscipline(value);
        }
    };
    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (serie === ['']) {
            setAlert('Selecione uma série!');
            return;
        }
        if (discipline === '') {
            setAlert('Selecione uma disciplina!');
            return;
        }
        if (answers.length > alternatives.length) {
            setAlert('É necessário ter mais alternativas erradas do que respostas certas!');
        }
        let textJson = convertToRaw(question.getCurrentContent());
        let markup = draftToText(textJson);
        const questionsJSON: balloonOptions = {
            question: markup,
            answers: answers,
            alternatives: alternatives,
        };
        let body: gameState<balloonOptions> = {
            name: name,
            layout: layout,
            options: questionsJSON,
        };
        createBalloons(body);
    };

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/bloons/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/bloons/${response?.data?.slug}`,
                disciplina_id: Number(discipline),
                series: serie,
            };
            createGameObject({ token, origin, ...obj });
        }
        response.isError && setAlert(getError(response.error));
    }, [response.isLoading]);

    useEffect(() => {
        responsePortal.isSuccess && setOpen(true);
        responsePortal.isError && setAlert(getError(responsePortal.error));
    }, [responsePortal.isLoading]);
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
                        <b>Estoura Balões</b>
                    </Typography>
                </Grid>
                <Grid
                    alignSelf="center"
                    item
                    xl={4}
                    lg={3}
                    md={12}
                    justifyContent={{ lg: 'flex-end', md: 'none' }}
                    display={{ lg: 'flex', md: 'block' }}
                >
                    <SeriesSelect serie={serie} callback={seriesChange} />
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
                        md: 'none',
                    }}
                    display={{ lg: 'flex', md: 'block' }}
                    xl={4}
                    lg={3}
                    md={12}
                >
                    <DisciplineSelect value={discipline} onChange={disciplineChange} />
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <LayoutSelect value={layout} onChange={handleLayout} />
                </Grid>
                <Grid item alignSelf="left" xs={3}>
                    <RichTextField
                        editorState={question}
                        onChange={(value: EditorState) => setQuestion(value)}
                        label={'Enunciado'}
                        maxLength={160}
                    />
                </Grid>
                <Grid item alignSelf="center" lg={12}>
                    <Grid container alignItems="flex-start" justifyContent="center" spacing={3}>
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
                        <Grid item xs={12} sm={6}>
                            <BalloonsWords
                                answers={answers}
                                correct={true}
                                handleItemChange={handleAnswerChange}
                                handleAddItem={handleAddAnswer}
                                handleRemoveItem={handleRemoveAnswer}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <BalloonsWords
                                answers={alternatives}
                                correct={false}
                                handleItemChange={handleAlternativeChange}
                                handleAddItem={handleAddAlternative}
                                handleRemoveItem={handleRemoveAlternative}
                            />
                        </Grid>
                    </Grid>
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
}
