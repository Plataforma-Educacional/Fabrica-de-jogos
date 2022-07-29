import React, { useEffect } from 'react';
import { Routes as Router, Route } from 'react-router-dom';
import GamePage from './components/_game/GamePage';
import NewQuizPage from './Pages/Quiz/NewQuizPage/NewQuizPage';
import EditQuiz from './Pages/Quiz/EditQuizPage/EditQuizPage';
import NewAnagramPage from './Pages/Anagram/NewAnagramPage/NewAnagramPage';
import EditAnagramPage from './Pages/Anagram/EditAnagramPage/EditAnagramPage';
import NewWordSearchPage from './Pages/WordSearch/NewWordSearchPage/NewWordSearchPage';
import EditWordSearch from './Pages/WordSearch/EditWordSearchPage/EditWordSearch';
import NewTrueOrFalsePage from './Pages/TrueOrFalse/NewTrueOrFalsePage/NewTrueOrFalsePage';
import EditTrueOrFalse from './Pages/TrueOrFalse/EditTrueOrFalsePage/EditTrueOrFalsePage';
import NewMatchUpPage from './Pages/MatchUp/NewMatchUpPage/NewMatchUpPage';
import EditMatchUp from './Pages/MatchUp/EditMatchUpPage/EditMatchUpPage';
import CreateMemorygame from './Pages/Memory/NewMemoryPage/CreateMemory';
import EditMemorygame from './Pages/Memory/EditMemoryPage/UpdateMemory';
import HomePage from './components/_home/HomePage';
import CreateWordle from './Pages/Wordle/NewWordlePage/NewWordlePage';
import EditWordle from './Pages/Wordle/EditWordlePage/EditWordlePage';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { useGetUserInfoQuery } from './services/portal';
import { setBaseState } from './reducers/userReducer';
import NewGroupSortPage from './Pages/GroupSort/NewGroupSortPage/NewGroupSortPage';
import EditGroupSort from './Pages/GroupSort/EditGroupSortPage/EditGroupSortPage';
import NewBalloonsPage from './Pages/Balloons/NewBalloonPage/NewBalloonsPage';
import EditBalloons from './Pages/Balloons/EditBalloonPage/EditBalloonsPage';
import NewCryptogramPage from './Pages/Cryptogram/NewCryptogramPage/NewCryptogramPage';
import EditCryptogram from './Pages/Cryptogram/EditCryptogramPage/EditCryptogramPage';
import NewDragNDropPage from './Pages/DragNDrop/NewDragNDropPage/NewDragNDropPage';
import EditDragNDrop from './Pages/DragNDrop/EditDragNDropPage/EditDragNDropPage';
import NewPuzzlePage from './Pages/Puzzle/NewPuzzlePage/NewPuzzlePage';
import EditPuzzle from './Pages/Puzzle/EditPuzzlePage/EditPuzzlePage';
import NewPaintPage from './Pages/Paint/NewPaintPage/NewPaintPage';
import EditPaint from './Pages/Paint/EditPaintPage/EditPaintPage';

import UserLayout from './Layouts/UserLayout/UserLayout';

const Routes = () => {
    const { token, origin } = useSelector((state: RootState) => state.user);
    const { data, error, isLoading } = useGetUserInfoQuery({ token, origin });
    const dispatch = useDispatch();

    if (error) dispatch(setBaseState());

    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem('token') === null) {
                window.location.href = '/401';
            }
            dispatch(setBaseState());
        }, 500);
    }, []);

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
        <Router>
            {/* Game Routes */}
            <Route path="/game/:category/:slug" element={<GamePage />} />

            <Route path="/" element={<UserLayout />}>
                {/* Home Routes */}
                <Route index element={<HomePage />} />
                <Route path="create/" element={<CreateGamePage />}>
                    <Route path="anagram" element={<NewAnagramPage />} />
                    <Route path="bloons" element={<NewBalloonsPage />} />
                    <Route path="cryptogram" element={<NewCryptogramPage />} />
                    <Route path="drag-drop" element={<NewDragNDropPage />} />
                    <Route path="group-sort" element={<NewGroupSortPage />} />
                    <Route path="match-up" element={<NewMatchUpPage />} />
                    <Route path="memory-game" element={<CreateMemorygame />} />
                    <Route path="quiz" element={<NewQuizPage />} />
                    <Route path="true-or-false" element={<NewTrueOrFalsePage />} />
                    <Route path="word-search" element={<NewWordSearchPage />} />
                    <Route path="paint" element={<NewPaintPage />} />
                    <Route path="puzzle" element={<NewPuzzlePage />} />
                    <Route path="wordle" element={<CreateWordle />} />
                </Route>
                <Route path="edit/" element={<UpdateGamePage />}>
                    <Route path="anagram/:slug" element={<EditAnagramPage />} />
                    <Route path="bloons/:slug" element={<EditBalloons />} />
                    <Route path="cryptogram/:slug" element={<EditCryptogram />} />
                    <Route path="drag-drop/:slug" element={<EditDragNDrop />} />
                    <Route path="group-sort/:slug" element={<EditGroupSort />} />
                    <Route path="match-up/:slug" element={<EditMatchUp />} />
                    <Route path="memory-game/:slug" element={<EditMemorygame />} />
                    <Route path="quiz/:slug" element={<EditQuiz />} />
                    <Route path="true-or-false/:slug" element={<EditTrueOrFalse />} />
                    <Route path="word-search/:slug" element={<EditWordSearch />} />
                    <Route path="paint/:slug" element={<EditPaint />} />
                    <Route path="puzzle/:slug" element={<EditPuzzle />} />
                    <Route path="wordle/:slug" element={<EditWordle />} />
                </Route>
            </Route>
        </Router>
    );
};
export default Routes;
