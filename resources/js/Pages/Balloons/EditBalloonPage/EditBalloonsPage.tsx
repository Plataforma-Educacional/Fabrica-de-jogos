import React, { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import { useParams } from 'react-router-dom';

import { useUpdateBalloonsMutation, useGetBalloonsBySlugQuery } from 'services/games';
import RichTextField from 'components/RichTextField/RichTextField';
import BalloonsWords from 'components/BalloonsWords/BalloonsWords';
import SuccessModal from 'components/SuccessModal/SuccessModal';
import BackFAButton from 'components/BackFAButton/BackFAButton';
import LayoutSelect from 'components/LayoutSelect/LayoutSelect';
import { balloonOptions, gameState } from 'types';
import draftToText from 'utils/draftToText';
import textToDraft from 'utils/textToDraft';
import { getError } from 'utils/errors';

export default function EditBalloons({}) {
    const { slug } = useParams();
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [layout, setLayout] = useState<number>(1);
    const [question, setQuestion] = useState<EditorState>(EditorState.createEmpty());
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
    const [alternatives, setAlternatives] = useState<string[]>(['', '', '', '', '']);
    const [updateBalloons, response] = useUpdateBalloonsMutation();
    const { data, error, isLoading } = useGetBalloonsBySlugQuery(slug as string);

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
    const handleSubmit: FormEventHandler = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
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
        let body: Partial<gameState<balloonOptions>> = {
            layout: layout,
            options: questionsJSON,
        };
        updateBalloons({ slug, ...body });
    };

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!');
            let deep_copy = JSON.parse(JSON.stringify(data.options));
            setAnswers(deep_copy.answers);
            setAlternatives(deep_copy.alternatives);
            setQuestion(textToDraft(deep_copy.question as string));
            setLayout(data.layout);
        }
        error && setAlert(getError(error));
    }, [isLoading]);

    useEffect(() => {
        response.isSuccess && setOpen(true);
        response.isError && setAlert(getError(response.error));
    }, [response.isLoading]);

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
        );

    return (
        <>
            <SuccessModal open={open} handleClose={() => setOpen(false)} />
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
                <Grid item alignSelf="center" xs={12}>
                    <LayoutSelect callback={handleLayout} selectedLayout={layout} />
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
    );
}
