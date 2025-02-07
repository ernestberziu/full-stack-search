import { getCodeSandboxHost } from '@codesandbox/utils';
import axios from 'axios';

const codeSandboxHost = getCodeSandboxHost(3001);
const baseURL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : 'http://localhost:3001';

export const api = axios.create({ baseURL });

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error(error);
  }
);
