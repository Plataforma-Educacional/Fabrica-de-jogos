import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, TextField, Grid, Alert, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EditorState, convertToRaw } from 'draft-js';
import LayoutPicker from '../_layout/LayoutSelect';
import draftToText from '../../utils/draftToText';
import SuccessDialog from '../_layout/SuccessDialog';
import { useDispatch, useSelector } from 'react-redux';
import FillableSelect from '../_layout/FillableSelect';
import Page from './layout/Page';
import Copyright from '../_layout/Copyright';
import { RootState } from '../../store';
import BackFAButton from '../_layout/BackFAButton';
import { setOpen, setAlert, setBaseState } from '../../reducers/baseReducer';
import {
    useCreateMatchUpMutation,
    useCreateGameObjectMutation
} from '../../services/games';
import { gameObj, matchUpObj, matchUpPage, matchUpState } from '../../types';

const CreateMatchUp = () => {
    const dispatch = useDispatch();
    const [createMatchUp, response] = useCreateMatchUpMutation();
    const [createGameObject] = useCreateGameObjectMutation();
    const { open, alert, token, api_address } = useSelector(
        (state: RootState) => state.base
    );
    const [name, setName] = useState('');
    const [layout, setLayout] = useState(1);
    const page = [
        {
            word: '',
            meaning: EditorState.createEmpty()
        },
        {
            word: '',
            meaning: EditorState.createEmpty()
        },
        {
            word: '',
            meaning: EditorState.createEmpty()
        },
        {
            word: '',
            meaning: EditorState.createEmpty()
        }
    ];
    const [pages, setPages] = useState([page]);
    const series = useSelector((state: RootState) => state.base.series);
    const [selectedSerie, setSelectedSerie] = useState('');
    const disciplinas = useSelector(
        (state: RootState) => state.base.disciplinas
    );
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const handleCreatePage = () => {
        if (pages.length >= 10) {
            dispatch(
                setAlert('O número máximo de páginas para esse jogo é 10!')
            );
            return;
        }
        setPages([...pages, page]);
    };
    const handleRemovePage = (index: number) => {
        if (pages.length === 1) {
            return;
        }
        let p = [...pages];
        p.splice(index, 1);
        setPages(p);
    };
    const handleWordChange = (
        event: ChangeEvent<HTMLInputElement>,
        index: number,
        i: number
    ) => {
        let p = [...pages];
        let page = p[index];
        let matchUp = page[i];
        matchUp.word = event.target.value;
        page.splice(i, 1, matchUp);
        p.splice(index, 1, page);
        setPages(p);
    };
    const handleMeaningChange = (
        editorState: EditorState,
        index: number,
        i: number
    ) => {
        let p = [...pages];
        let page = p[index];
        let matchUp = page[i];
        matchUp.meaning = editorState;
        page.splice(i, 1, matchUp);
        p.splice(index, 1, page);
        setPages(p);
    };
    const handleLayout = (
        event: ChangeEvent<HTMLInputElement>,
        newLayout: number
    ) => {
        if (newLayout === null) {
            return;
        }
        setLayout(newLayout);
    };
    const handleClose = () => {
        setLayout(1);
        setName('');
        setPages([page]);
        dispatch(setOpen(false));
    };
    const seriesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value !== null && value !== selectedSerie) {
            setSelectedSerie(value);
        }
    };
    const disciplineChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value !== null && value !== selectedDiscipline) {
            setSelectedDiscipline(value);
        }
    };
    const handleSubmit = (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (selectedSerie === '') {
            dispatch(setAlert('Selecione uma série!'));
            return;
        }
        if (selectedDiscipline === '') {
            dispatch(setAlert('Selecione uma disciplina!'));
            return;
        }
        let matchUpsJSON: matchUpPage[] = [];
        let error = false;
        pages.map((page: matchUpPage) => {
            let matchUps: matchUpObj[] = [];
            page.map((matchUp: matchUpObj) => {
                const meanings: EditorState = matchUp.meaning as EditorState;
                let content = meanings.getCurrentContent();
                if (content.getPlainText('').length === 0) {
                    dispatch(setAlert('Preencha todos os campos!'));
                    error = true;
                    return;
                }
                let textJson = convertToRaw(content);
                let markup = draftToText(textJson);
                matchUps.push({
                    meaning: markup,
                    word: matchUp.word
                });
            });
            matchUpsJSON.push(matchUps);
        });
        if (error) {
            return;
        }
        let body: Partial<matchUpState> = {
            name: name,
            layout: layout,
            pages: matchUpsJSON
        };
        createMatchUp(body);
    };
    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem('token') === null) {
                window.location.href = '/401';
            }
            dispatch(setBaseState());
        }, 2000);
    }, []);

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/matchup/${response?.data?.slug}`,
                material: `https://www.fabricadejogos.portaleducacional.tec.br/matchup/${response?.data?.slug}`,
                thumbnail: '',
                disciplina_id: Number(selectedDiscipline),
                series: Number(selectedSerie)
            };
            // @ts-ignore
            createGameObject({ token, api_address, ...obj }).then(() => {
                dispatch(setOpen(true));
            });
        }
    }, [response.isLoading]);

    return (
        <>
            <SuccessDialog open={open} handleClose={handleClose} />
            <BackFAButton />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row'
                }}
            >
                <Grid
                    container
                    component="form"
                    justifyContent="center"
                    alignItems="center"
                    onSubmit={handleSubmit as any}
                    spacing={3}
                >
                    {/* @ts-ignore */}
                    <Grid item align="center" xs={12}>
                        <TextField
                            label="Nome"
                            name="name"
                            variant="outlined"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                            required
                        />
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item align="center" xs={3}>
                        <FillableSelect
                            items={series}
                            name="Ano/Série"
                            value={selectedSerie}
                            callBack={seriesChange}
                        />
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item align="center" xs={3}>
                        <FillableSelect
                            items={disciplinas}
                            name="Componente"
                            value={selectedDiscipline}
                            callBack={disciplineChange}
                        />
                    </Grid>
                    <LayoutPicker
                        handleLayout={handleLayout}
                        selectedLayout={layout}
                    />
                    {/* @ts-ignore */}
                    <Grid item align="center" xs={12}>
                        <Button
                            onClick={handleCreatePage}
                            endIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Adicionar página
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={3}
                            alignItems="flex-start"
                            justifyContent="center"
                        >
                            {alert && (
                                <Grid item xs={12}>
                                    <Alert
                                        severity="warning"
                                        onClick={() => {
                                            dispatch(setAlert(''));
                                        }}
                                    >
                                        {alert}
                                    </Alert>
                                </Grid>
                            )}
                            {pages.map((page: matchUpPage, index: number) => {
                                return (
                                    <Page
                                        key={index}
                                        page={page}
                                        index={index}
                                        handleWordChange={handleWordChange}
                                        handleMeaningChange={
                                            handleMeaningChange
                                        }
                                        handleDelete={handleRemovePage}
                                    />
                                );
                            })}
                        </Grid>
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item align="center" xs={12}>
                        <Button size="large" type="submit" variant="outlined">
                            Criar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Copyright />
        </>
    );
};
export default CreateMatchUp;