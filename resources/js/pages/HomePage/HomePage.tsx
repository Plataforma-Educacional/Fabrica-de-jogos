import React, { FunctionComponent } from 'react'
import { Grid, Button, Card, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const game_types = [
    { slug: 'anagram', name: 'Anagrama' },
    { slug: 'bloons', name: 'Estoura Balões' },
    { slug: 'cryptogram', name: 'Criptograma' },
    { slug: 'drag-drop', name: 'Arraste e Solte' },
    { slug: 'group-sort', name: 'Agrupamentos' },
    { slug: 'match-up', name: 'Combinação' },
    // { slug: 'memory-game', name: 'Jogo da Memória' },
    { slug: 'paint', name: 'Ateliê Criativo' },
    { slug: 'puzzle', name: 'Quebra-Cabeça' },
    { slug: 'quiz', name: 'Quiz' },
    { slug: 'true-or-false', name: 'Verdadeiro ou Falso' },
    { slug: 'word-search', name: 'Caça-Palavras' },
    { slug: 'wordle', name: 'Organize as Letras' },
]

const HomePage: FunctionComponent = ({}) => {
    const navigate = useNavigate()
    return (
        <Grid container alignItems="center" justifyContent="center" spacing={1} marginTop={3}>
            {game_types.map((type, index) => {
                return (
                    <Grid
                        key={index}
                        item
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                    >
                        <Grid item>
                            <IconButton disableRipple={true} onClick={() => navigate(`/create/${type.slug}`)}>
                                <Card
                                    elevation={5}
                                    sx={{
                                        width: { sm: 250, md: 310 },
                                        height: { sm: 160, md: 200 },
                                        borderRadius: 4.5,
                                    }}
                                >
                                    <img
                                        src={`/storage/games/${type.slug}.png`}
                                        alt={type.name}
                                        width="100%"
                                        height="100%"
                                    />
                                </Card>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => navigate(`/create/${type.slug}`)} variant="outlined">
                                {type.name}
                            </Button>
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default HomePage
