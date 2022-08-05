import React, { useEffect, FunctionComponent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import gameCategories from 'utils/gameCategories';
import { RootState } from 'store';

const GamePage: FunctionComponent = () => {
    const { slug, category } = useParams();
    const { token, origin } = useSelector((state: RootState) => state.user);
    const [searchParams] = useSearchParams();
    let gameAddress = gameCategories[category as keyof typeof gameCategories];

    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) {
                const data = event.data;
                if (data.loaded) {
                    let game_address = 'https://fabricadejogos.portaleducacional.tec.br';
                    let iframe: HTMLIFrameElement = document.getElementById('frame') as HTMLIFrameElement;
                    const message = JSON.stringify({
                        user_token: token,
                        origin: origin,
                        game_address: game_address,
                        slug: slug,
                        aula_id: searchParams.get('aula_id') ?? 0,
                        conteudo_id: searchParams.get('conteudo_id') ?? 0,
                    });
                    // @ts-ignore
                    iframe.contentWindow.postMessage(message, '*');
                }
            }
        });
    }, []);
    return (
        <div>
            <iframe
                id="frame"
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
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden',
                    zIndex: 999999,
                }}
            />
        </div>
    );
};

export default GamePage;
