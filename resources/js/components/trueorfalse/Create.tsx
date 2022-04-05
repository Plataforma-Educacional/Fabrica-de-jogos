import React, {
    ChangeEvent,
    FormEventHandler,
    useEffect,
    useState
} from 'react';
import { Button, TextField, Grid, Alert, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EditorState, convertToRaw } from 'draft-js';
import LayoutPicker from '../_layout/LayoutSelect';
import draftToText from '../../utils/draftToText';
import SuccessDialog from '../_layout/SuccessDialog';
import { useDispatch, useSelector } from 'react-redux';
import FillableSelect from '../_layout/FillableSelect';
import QuestionCard from './layout/QuestionCard';
import Copyright from '../_layout/Copyright';
import BackFAButton from '../_layout/BackFAButton';
import { setOpen, setAlert, setBaseState } from '../../reducers/baseReducer';
import { RootState } from '../../store';
import {
    useCreateTrueOrFalseMutation,
    useCreateGameObjectMutation
} from '../../services/games';
import { gameObj, trueOrFalseQuestion } from '../../types';

const CreateTrueOrFalse = () => {
    const { open, alert, series, disciplinas, token, api_address } =
        useSelector((state: RootState) => state.base);
    const [name, setName] = useState('');
    const [layout, setLayout] = useState(1);
    const [selectedSerie, setSelectedSerie] = useState('');
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const [createTrueOrFalse, response] = useCreateTrueOrFalseMutation();
    const [createGameObject] = useCreateGameObjectMutation();
    const dispatch = useDispatch();
    const questionObj = {
        title: EditorState.createEmpty(),
        answer: false
    };
    const [questions, setQuestions] = useState([questionObj]);
    const handleLayout = (
        event: ChangeEvent<HTMLInputElement>,
        newLayout: number
    ) => {
        if (newLayout === null) {
            return;
        }
        setLayout(newLayout);
    };
    const handleCreateQuestion = () => {
        if (questions.length >= 9) {
            setAlert('O número máximo de questões para esse jogo é 9!');
            return;
        }
        setQuestions([...questions, questionObj]);
    };
    const handleRemoveQuestion = (index: number) => {
        if (index === 0) {
            return;
        }
        let q = [...questions];
        q.splice(index, 1);
        setQuestions(q);
    };
    const handleQuestionTitleChange = (value: EditorState, index: number) => {
        let q = [...questions];
        let question = q[index];
        question.title = value;
        q.splice(index, 1, question);
        setQuestions(q);
    };
    const handleAnswerChange = (
        event: ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        let q = [...questions];
        let question = q[index];
        question.answer = event.target.checked;
        q.splice(index, 1, question);
        setQuestions(q);
    };
    const handleClose = () => {
        setName('');
        setQuestions([{ title: EditorState.createEmpty(), answer: false }]);
        setLayout(1);
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
    const handleSubmit: FormEventHandler = (
        event: React.FormEvent<HTMLInputElement>
    ) => {
        event.preventDefault();
        if (selectedSerie === '') {
            setAlert('Selecione uma série!');
            return;
        }
        if (selectedDiscipline === '') {
            setAlert('Selecione uma disciplina!');
            return;
        }
        let questionsJSON: trueOrFalseQuestion[] = [];
        let error = false;
        questions.map((item: trueOrFalseQuestion) => {
            const title = item.title as EditorState;
            let content = title.getCurrentContent();
            if (content.getPlainText('').length === 0) {
                setAlert('Preencha todos os campos!');
                error = true;
                return;
            }
            let textJson = convertToRaw(content);
            let markup = draftToText(textJson);
            questionsJSON.push({
                answer: item.answer,
                title: markup
            });
        });
        if (error) {
            return;
        }
        let body = {
            name: name,
            layout: layout,
            questions: questionsJSON
        };

        createTrueOrFalse(body);
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
                slug: `/trueorfalse/${response?.data?.slug}`,
                material: `https://www.fabricadejogos.portaleducacional.tec.br/trueorfalse/${response?.data?.slug}`,
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
                            onClick={handleCreateQuestion}
                            endIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Adicionar Questão
                        </Button>
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item align="center" lg={12}>
                        <Grid
                            container
                            alignItems="flex-start"
                            justifyContent="center"
                            spacing={3}
                        >
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
                            {questions.map(
                                (
                                    question: trueOrFalseQuestion,
                                    index: number
                                ) => {
                                    return (
                                        <QuestionCard
                                            key={index}
                                            question={question}
                                            index={index}
                                            handleRemoveQuestion={
                                                handleRemoveQuestion
                                            }
                                            handleQuestionTitleChange={
                                                handleQuestionTitleChange
                                            }
                                            handleAnswerChange={
                                                handleAnswerChange
                                            }
                                        />
                                    );
                                }
                            )}
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

export default CreateTrueOrFalse;