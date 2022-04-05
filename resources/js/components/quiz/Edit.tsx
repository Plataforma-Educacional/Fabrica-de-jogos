import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Grid, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EditorState, convertToRaw } from 'draft-js';
import LayoutPicker from '../_layout/LayoutSelect';
import draftToText from '../../utils/draftToText';
import SuccessDialog from '../_layout/SuccessDialog';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QuestionCard from './layout/QuestionCard';
import Copyright from '../_layout/Copyright';
import { Box } from '@mui/system';
import { setOpen, setAlert, setBaseState } from '../../reducers/baseReducer';
import { RootState } from '../../store';
import {
    useUpdateQuizMutation,
    useGetQuizBySlugQuery
} from '../../services/games';
import { quizQuestion as questionObj, quizQuestion } from '../../types';
import textToDraft from '../../utils/textToDraft';

const EditQuiz = () => {
    const { slug } = useParams();
    const { open, alert } = useSelector((state: RootState) => state.base);
    const [name, setName] = useState('');
    const [layout, setLayout] = useState(1);
    const dispatch = useDispatch();
    const questionObj: quizQuestion = {
        title: EditorState.createEmpty(),
        answers: ['', '']
    };
    const [questions, setQuestions] = useState([questionObj]);
    const [updateQuiz, response] = useUpdateQuizMutation();
    const { data, error, isLoading } = useGetQuizBySlugQuery(slug as string);
    const handleCreateQuestion = () => {
        if (questions.length >= 9) {
            setAlert('O número máximo de questões para esse jogo é 9!');
            return;
        }
        setQuestions([...questions, questionObj]);
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
    const handleRemoveQuestion = (index: number) => {
        if (index === 0) {
            return;
        }
        let q = [...questions];
        q.splice(index, 1);
        setQuestions(q);
    };
    const handleCreateAnswer = (index: number) => {
        let q = [...questions];
        let question = questions[index];
        if (question.answers.length === 5) {
            return;
        }
        question.answers.push('');
        q.splice(index, 1, question);
        setQuestions(q);
    };
    const handleRemoveAnswer = (index: number, i: number) => {
        let q = [...questions];
        let question = questions[index];
        if (question.answers.length === 2) {
            return;
        }
        question.answers.splice(i, 1);
        q.splice(index, 1, question);
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
        index: number,
        i: number
    ) => {
        let q = [...questions];
        let question = questions[index];
        question.answers[i] = event.target.value;
        q.splice(index, 1, question);
        setQuestions(q);
    };
    const handleSubmit = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        let questionsJSON: quizQuestion[] = [];
        let error = false;
        questions.map((item: quizQuestion) => {
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
                answers: item.answers,
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
        updateQuiz({ slug, ...body });
    };

    const formatQuestions = (raw: questionObj[]) => {
        raw.map((question) => {
            if (typeof question.title !== 'string') {
                return;
            }
            question.title = textToDraft(question.title);
        });
        return raw;
    };

    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem('token') === null) {
                // window.location.href = '/401';
            }
            dispatch(setBaseState());
        }, 2000);
    }, []);

    useEffect(() => {
        if (data) {
            data.approved_at &&
                setAlert(
                    'Esse jogo já foi aprovado, logo não pode mais ser editado!'
                );
            let deep_copy = JSON.parse(JSON.stringify(data.questions));
            setQuestions(formatQuestions(deep_copy));
            setName(data.name);
            setLayout(data.layout);
        }
        error && dispatch(setAlert(error));
    }, [isLoading]);

    useEffect(() => {
        response.isSuccess && dispatch(setOpen(true));
        response.isError && dispatch(setAlert(response.error));
    }, [response.isLoading]);

    return (
        <>
            <SuccessDialog
                open={open}
                handleClose={() => {
                    dispatch(setOpen(false));
                }}
            />
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
                    <LayoutPicker
                        handleLayout={handleLayout}
                        selectedLayout={layout}
                    />
                    {/* @ts-ignore*/}
                    <Grid item align="center" xs={12}>
                        <Button
                            onClick={handleCreateQuestion}
                            endIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Adicionar Questão
                        </Button>
                    </Grid>
                    {/* @ts-ignore*/}
                    <Grid item align="center" xs={12}>
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
                                (question: quizQuestion, index: number) => {
                                    return (
                                        <QuestionCard
                                            key={index}
                                            question={question}
                                            index={index}
                                            handleCreateAnswer={
                                                handleCreateAnswer
                                            }
                                            handleAnswerChange={
                                                handleAnswerChange
                                            }
                                            handleRemoveAnswer={
                                                handleRemoveAnswer
                                            }
                                            handleQuestionTitleChange={
                                                handleQuestionTitleChange
                                            }
                                            handleRemoveQuestion={
                                                handleRemoveQuestion
                                            }
                                        />
                                    );
                                }
                            )}
                        </Grid>
                    </Grid>
                    {/* @ts-ignore*/}
                    <Grid item align="center" xs={12}>
                        <Button
                            size="large"
                            type="submit"
                            variant="outlined"
                            disabled={!!data?.approved_at}
                        >
                            Salvar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Copyright />
        </>
    );
};
export default EditQuiz;