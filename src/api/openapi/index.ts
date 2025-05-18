import {Configuration, UserApi, AdminApi, AuthApi} from '@mrcylmz/dewqr-api-generator/dist/gen';
import router from '../../router';
import { clearJWTToken } from '../../utils/jwtUtils';
import {DEW_QR_API_URL} from '../../config'
const baseConfig = new Configuration({
    basePath: DEW_QR_API_URL,
});

const userConfig = new Configuration({
    basePath: DEW_QR_API_URL,
    baseOptions: {
        validateStatus: (status: number) => {
            if (status === 401) {
                clearJWTToken();
                router.push('/user-login');
            }
            return status >= 200 && status < 300;
        },
    },
});
const adminConfig = new Configuration({
    basePath: DEW_QR_API_URL,
    baseOptions: {
        validateStatus: (status: number) => {
            if (status === 401) {
                clearJWTToken();
                router.push('/admin-login');
            }
            return status >= 200 && status < 300;
        },
    },
});

export * from '@mrcylmz/dewqr-api-generator/dist/gen/models'
export type {Configuration}
export const userApi = new UserApi(userConfig);
export const adminApi = new AdminApi(adminConfig);
export const authApi = new AuthApi(baseConfig)