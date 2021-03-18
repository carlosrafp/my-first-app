import { useState } from 'react';
import axios from 'axios';
import useDebouncedPromise from 'components/utils/useDebouncedPromise';

const initialRequestInfo = {
  error: null,
  data: null,
  loading: false,
};

export default function useAPI(config) {
  const [requestInfo, setRequestInfo] = useState(initialRequestInfo);
  const debouncedAxios = useDebouncedPromise(axios, config.debounceDelay);

  async function call(localConfig, updateRequestInfo) {
    let response = null;

    const finalConfig = {
      baseURL: 'http://localhost:5000', // se quiser parar de escrever o caminho inteiro
      updateRequestInfo: (newInfo) => newInfo,
      ...config, // spread da config com localConfig,
      ...localConfig, // assim localConfig pode  receber 'data' por exemplo
    };

    if (finalConfig.isFetchMore) {
      setRequestInfo({
        ...initialRequestInfo, //usa initialState em vez de requestInfo para garantir que request proximos nao misturem dados uns com outros
        data: requestInfo.data,
        loading: true,
      });
    } else if (!finalConfig.quietly) {
      setRequestInfo({
        ...initialRequestInfo, //usa initialState em vez de requestInfo para garantir que request proximos nao misturem dados uns com outros
        loading: true,
      });
    }

    try {
      response = await debouncedAxios(finalConfig); // await eh opcao ao invez de .then(), mas requer async na function
      const newRequestInfo = {
        ...initialRequestInfo, //usa initialState porque loading agora eh falso, assim como no estado inicial
        data: response.data,
      };

      if (response.headers['x-total-count'] !== undefined) {
        newRequestInfo.total = Number.parseInt(
          response.headers['x-total-count'],
          10
        );
      }

      setRequestInfo(
        finalConfig.updateRequestInfo(newRequestInfo, requestInfo)
      );
    } catch (error) {
      setRequestInfo(
        finalConfig.updateRequestInfo(
          {
            ...initialRequestInfo, //usa initialState porque loading agora eh falso, assim como no estado inicial
            error, /// igual a error: error
          },
          requestInfo
        )
      );
    }

    if (config.onCompleted) {
      config.onCompleted(response);
    }
    return response;
  }

  return [call, requestInfo];
}
