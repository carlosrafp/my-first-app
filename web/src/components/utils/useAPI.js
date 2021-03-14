import { useState } from 'react';
import axios from 'axios';

const initialState = {
    error: null,
    data: null,
    loading: false
};

export default function useAPI(config) {
    const [requestInfo, setRequestInfo] = useState(initialState);

    async function call(localConfig) {
        setRequestInfo({
            ...initialState, //usa initialState em vez de requestInfo para garantir que request proximos nao misturem dados uns com outros
            loading: true
        });
        let response = null;
        try {
            response = await axios({
                // baseUrl: 'http://localhost:5000', // se quiser parar de escrever o caminho inteiro  
                ...config,  // spread da config com localConfig,
                ...localConfig // assim localConfig pode  receber 'data' por exemplo
            }); // await eh opcao ao invez de .then(), mas requer async na function
            setRequestInfo({
                ...initialState, //usa initialState porque loading agora eh falso, assim como no estado inicial
                data: response.data
            });
        }
        catch (error) {
            setRequestInfo({
                ...initialState, //usa initialState porque loading agora eh falso, assim como no estado inicial
                error /// igual a error: error
            });
        }

        if (config.onCompleted) {
            config.onCompleted(response);

        }

    }

    return [
        call,
        requestInfo
    ];
}

