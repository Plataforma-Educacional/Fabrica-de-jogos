import React from 'react'
import { BrowserRouter, Routes as Router, Route } from 'react-router-dom'
import GamePage from './components/_game/GamePage'
import CreateQuiz from './components/quiz/Create'
import EditQuiz from './components/quiz/Edit'
import CreateAnagram from './components/anagram/Create'
import EditAnagram from './components/anagram/Edit'
import CreateWordSearch from './components/word-search/Create'
import EditWordSearch from './components/word-search/Edit'
import CreateTrueOrFalse from './components/true-or-false/Create'
import EditTrueOrFalse from './components/true-or-false/Edit'
import CreateMatchUp from './components/match-up/Create'
import EditMatchUp from './components/match-up/Edit'
import CreateMemorygame from './components/memory-game/Create'
import EditMemorygame from './components/memory-game/Edit'
import HomePage from './components/_home/HomePage'
import CreateWordle from './components/wordle/Create'
import EditWordle from './components/wordle/Edit'
import CreateGroupSort from './components/group-sort/Create'
import EditGroupSort from './components/group-sort/Edit'
import CreateBalloons from './components/balloons/Create'
import EditBalloons from './components/balloons/Edit'
import CreateCryptogram from './components/cryptogram/Create'
import EditCryptogram from './components/cryptogram/Edit'
import CreateDragNDrop from './components/drag-drop/Create'
import EditDragNDrop from './components/drag-drop/Edit'
import CreatePuzzle from './components/puzzle/Create'
import EditPuzzle from './components/puzzle/Edit'
import CreatePaint from './components/paint/Create'
import EditPaint from './components/paint/Edit'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import UserLayout from './layouts/UserLayout/UserLayout'

function Routes() {
    return (
        <Router>
            <UserLayout>
                {/* Home Route */}
                <Route path="/" element={<HomePage />} />
                {/* Create Routes */}
                <Route path="/create/anagram" element={<CreateAnagram />} />
                <Route path="/create/bloons" element={<CreateBalloons />} />
                <Route
                    path="/create/cryptogram"
                    element={<CreateCryptogram />}
                />
                <Route path="/create/drag-drop" element={<CreateDragNDrop />} />
                <Route
                    path="/create/group-sort"
                    element={<CreateGroupSort />}
                />
                <Route path="/create/match-up" element={<CreateMatchUp />} />
                <Route
                    path="/create/memory-game"
                    element={<CreateMemorygame />}
                />
                <Route path="/create/quiz" element={<CreateQuiz />} />
                <Route
                    path="/create/true-or-false"
                    element={<CreateTrueOrFalse />}
                />
                <Route
                    path="/create/word-search"
                    element={<CreateWordSearch />}
                />
                <Route path="/create/paint" element={<CreatePaint />} />
                <Route path="/create/puzzle" element={<CreatePuzzle />} />
                <Route path="/create/wordle" element={<CreateWordle />} />
                {/* Edit Routes */}
                <Route path="/edit/anagram/:slug" element={<EditAnagram />} />
                <Route path="/edit/bloons/:slug" element={<EditBalloons />} />
                <Route
                    path="/edit/cryptogram/:slug"
                    element={<EditCryptogram />}
                />
                <Route
                    path="/edit/drag-drop/:slug"
                    element={<EditDragNDrop />}
                />
                <Route
                    path="/edit/group-sort/:slug"
                    element={<EditGroupSort />}
                />
                <Route path="/edit/match-up/:slug" element={<EditMatchUp />} />
                <Route
                    path="/edit/memory-game/:slug"
                    element={<EditMemorygame />}
                />
                <Route path="/edit/quiz/:slug" element={<EditQuiz />} />
                <Route
                    path="/edit/true-or-false/:slug"
                    element={<EditTrueOrFalse />}
                />
                <Route
                    path="/edit/word-search/:slug"
                    element={<EditWordSearch />}
                />
                <Route path="/edit/paint/:slug" element={<EditPaint />} />
                <Route path="/edit/puzzle/:slug" element={<EditPuzzle />} />
                <Route path="/edit/wordle/:slug" element={<EditWordle />} />
            </UserLayout>
            {/* Game Routes */}
            <Route path="/game/:category/:slug" element={<GamePage />} />
        </Router>
    )
}
export default Routes
