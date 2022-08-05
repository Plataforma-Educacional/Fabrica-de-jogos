import React, { FormEventHandler, FunctionComponent, useEffect, useState } from 'react';
import { Button, Grid, Alert, CircularProgress, Typography } from '@mui/material';
import { EditorState, convertToRaw } from 'draft-js';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';

import { useUpdateMatchUpMutation, useGetMatchUpBySlugQuery } from 'services/games';
import LayoutPicker from 'components/LayoutSelect/LayoutSelect';
import SuccessModal from 'components/SuccessModal/SuccessModal';
import MatchUpCell from 'components/MatchUpCell/MatchUpCell';
import textToDraft from 'utils/textToDraft';
import draftToText from 'utils/draftToText';
import { getError } from 'utils/errors';
import { matchUpPage } from 'types';

const initialState: matchUpPage[] = [
    [
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
        {
            word: '',
            meaning: EditorState.createEmpty(),
        },
    ],
];

const EditMatchUpPage: FunctionComponent = () => {
    const { slug } = useParams();
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [layout, setLayout] = useState(1);
    const [pages, setPages] = useState(initialState);
    const { data, error, isLoading } = useGetMatchUpBySlugQuery(slug as string);
    const [updateMatchUp, response] = useUpdateMatchUpMutation();
    const formatPages = (raw: matchUpPage[]) => {
        raw.map((page) => {
            page.map((matchup) => {
                if (typeof matchup.meaning !== 'string') {
                    return;
                }
                matchup.meaning = textToDraft(matchup.meaning);
            });
        });
        return raw;
    };
    const handleCreatePage = () => {
        if (pages.length >= 10) {
            setAlert('O número máximo de páginas para esse jogo é 10!');
            return;
        }
        setPages([...pages, ...initialState]);
    };

    const handleSubmit: FormEventHandler = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        let matchUpsJSON: matchUpPage[] = [];
        let error = false;
        pages.map((page: matchUpPage) => {
            let matchUps: matchUpPage = [];
            page.map((matchUp) => {
                const meaning = matchUp.meaning as EditorState;
                let content = meaning.getCurrentContent();
                if (content.getPlainText('').length === 0) {
                    setAlert('Preencha todos os campos!');
                    error = true;
                    return;
                }
                let textJson = convertToRaw(content);
                let markup = draftToText(textJson);
                matchUps.push({
                    meaning: markup,
                    word: matchUp.word,
                });
            });
            matchUpsJSON.push(matchUps);
        });
        if (error) {
            return;
        }
        let body = {
            layout: layout,
            options: matchUpsJSON,
        };
        updateMatchUp({ ...body, slug });
    };

    useEffect(() => {
        if (data) {
            data.approved_at && setAlert('Esse jogo já foi aprovado, logo não pode mais ser editado!');
            let deep_copy = JSON.parse(JSON.stringify(data.options));
            setPages(formatPages(deep_copy));
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
            <Grid item alignSelf="center" textAlign="center" sx={{ marginTop: 8 }} xs={12}>
                <Typography color="primary" variant="h2" component="h2">
                    <b>Combinação</b>
                </Typography>
            </Grid>
            <Grid container component="form" justifyContent="center" onSubmit={handleSubmit} spacing={3}>
                <LayoutPicker value={layout} setValue={setLayout} />
                <Grid item alignSelf="center" xs={12}>
                    <Button onClick={handleCreatePage} endIcon={<AddIcon fontSize="small" />} variant="contained">
                        Adicionar página
                    </Button>
                </Grid>
                <Grid item alignSelf="center" xs={12}>
                    <Grid container spacing={3} alignItems="flex-start" justifyContent="center">
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
                        {pages.map((page: matchUpPage, index: number) => {
                            return (
                                <Grid key={index} item alignSelf="center" xs={12} md={6} lg={4}>
                                    <MatchUpCell index={index} value={page} state={pages} setState={setPages} />
                                </Grid>
                            );
                        })}
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
    );
};

export default EditMatchUpPage;
