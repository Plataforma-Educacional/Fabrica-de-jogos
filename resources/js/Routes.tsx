import React, { FunctionComponent } from 'react';
import { Routes as Router, Route } from 'react-router-dom';

import HomePage from 'pages/HomePage/HomePage';
import GamePage from 'pages/GamePage/GamePage';
import NewQuizPage from 'pages/Quiz/NewQuizPage/NewQuizPage';
import EditQuiz from 'pages/Quiz/EditQuizPage/EditQuizPage';
import NewAnagramPage from 'pages/Anagram/NewAnagramPage/NewAnagramPage';
import EditAnagramPage from 'pages/Anagram/EditAnagramPage/EditAnagramPage';
import NewWordSearchPage from 'pages/WordSearch/NewWordSearchPage/NewWordSearchPage';
import EditWordSearch from 'pages/WordSearch/EditWordSearchPage/EditWordSearch';
import NewTrueOrFalsePage from 'pages/TrueOrFalse/NewTrueOrFalsePage/NewTrueOrFalsePage';
import EditTrueOrFalse from 'pages/TrueOrFalse/EditTrueOrFalsePage/EditTrueOrFalsePage';
import NewMatchUpPage from 'pages/MatchUp/NewMatchUpPage/NewMatchUpPage';
import EditMatchUp from 'pages/MatchUp/EditMatchUpPage/EditMatchUpPage';
import CreateMemorygame from 'pages/Memory/NewMemoryPage/CreateMemory';
import EditMemorygame from 'pages/Memory/EditMemoryPage/UpdateMemory';
import CreateWordle from 'pages/Wordle/NewWordlePage/NewWordlePage';
import EditWordle from 'pages/Wordle/EditWordlePage/EditWordlePage';
import NewGroupSortPage from 'pages/GroupSort/NewGroupSortPage/NewGroupSortPage';
import EditGroupSort from 'pages/GroupSort/EditGroupSortPage/EditGroupSortPage';
import NewBalloonsPage from 'pages/Balloons/NewBalloonPage/NewBalloonsPage';
import EditBalloons from 'pages/Balloons/EditBalloonPage/EditBalloonsPage';
import NewCryptogramPage from 'pages/Cryptogram/NewCryptogramPage/NewCryptogramPage';
import EditCryptogram from 'pages/Cryptogram/EditCryptogramPage/EditCryptogramPage';
import NewDragNDropPage from 'pages/DragNDrop/NewDragNDropPage/NewDragNDropPage';
import EditDragNDrop from 'pages/DragNDrop/EditDragNDropPage/EditDragNDropPage';
import NewPuzzlePage from 'pages/Puzzle/NewPuzzlePage/NewPuzzlePage';
import EditPuzzle from 'pages/Puzzle/EditPuzzlePage/EditPuzzlePage';
import NewPaintPage from 'pages/Paint/NewPaintPage/NewPaintPage';
import EditPaint from 'pages/Paint/EditPaintPage/EditPaintPage';
import UserLayout from 'layouts/UserLayout/UserLayout';

const Routes: FunctionComponent = () => {
    return (
        <Router>
            <Route path="/" element={<UserLayout />}>
                {/* Home Route */}
                <Route index element={<HomePage />} />
                {/* Game Routes */}
                <Route path="/game/:category/:slug" element={<GamePage />} />
                {/* Create Routes */}
                <Route path="create/anagram" element={<NewAnagramPage />} />
                <Route path="create/bloons" element={<NewBalloonsPage />} />
                <Route path="create/cryptogram" element={<NewCryptogramPage />} />
                <Route path="create/drag-drop" element={<NewDragNDropPage />} />
                <Route path="create/group-sort" element={<NewGroupSortPage />} />
                <Route path="create/match-up" element={<NewMatchUpPage />} />
                <Route path="create/memory-game" element={<CreateMemorygame />} />
                <Route path="create/quiz" element={<NewQuizPage />} />
                <Route path="create/true-or-false" element={<NewTrueOrFalsePage />} />
                <Route path="create/word-search" element={<NewWordSearchPage />} />
                <Route path="create/paint" element={<NewPaintPage />} />
                <Route path="create/puzzle" element={<NewPuzzlePage />} />
                <Route path="create/wordle" element={<CreateWordle />} />
                {/* Edition Routes */}
                <Route path="edit/anagram/:slug" element={<EditAnagramPage />} />
                <Route path="edit/bloons/:slug" element={<EditBalloons />} />
                <Route path="edit/cryptogram/:slug" element={<EditCryptogram />} />
                <Route path="edit/drag-drop/:slug" element={<EditDragNDrop />} />
                <Route path="edit/group-sort/:slug" element={<EditGroupSort />} />
                <Route path="edit/match-up/:slug" element={<EditMatchUp />} />
                <Route path="edit/memory-game/:slug" element={<EditMemorygame />} />
                <Route path="edit/quiz/:slug" element={<EditQuiz />} />
                <Route path="edit/true-or-false/:slug" element={<EditTrueOrFalse />} />
                <Route path="edit/word-search/:slug" element={<EditWordSearch />} />
                <Route path="edit/paint/:slug" element={<EditPaint />} />
                <Route path="edit/puzzle/:slug" element={<EditPuzzle />} />
                <Route path="edit/wordle/:slug" element={<EditWordle />} />
            </Route>
        </Router>
    );
};
export default Routes;
