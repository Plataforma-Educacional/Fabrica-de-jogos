import React, { useEffect, FunctionComponent, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import gameCategories from 'utils/gameCategories'
import { RootState } from 'store'

const GamePage: FunctionComponent = () => {
    const { slug, category } = useParams()
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [searchParams] = useSearchParams()
    const iframe = useRef<HTMLIFrameElement>(null)
    let gameAddress = gameCategories[category as keyof typeof gameCategories]

    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin && event.data.loaded) {
                let url = 'https://fabricadejogos.portaleducacional.tec.br'
                const message = JSON.stringify({
                    user_token: token,
                    origin: origin,
                    game_address: url,
                    slug: slug,
                    aula_id: searchParams.get('aula_id') ?? 0,
                    conteudo_id: searchParams.get('conteudo_id') ?? 0,
                })
                iframe.current?.contentWindow?.postMessage(message, gameAddress)
            }
        })
    }, [])
    return (
        <div>
            <iframe
                ref={iframe}
                src={gameAddress}
                height="100%"
                width="100%"
                allowFullScreen
                style={{
                    position: 'fixed',
                    top: '0px',
                    bottom: '0px',
                    right: '0px',
                    border: 'none',
                    marginTop: '2em',
                    padding: 0,
                    overflow: 'hidden',
                }}
            />
        </div>
    )
}

export default GamePage
