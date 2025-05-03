import {Configuration, UserApi, AdminApi, AuthApi} from '@mrdew/dewqr-api-generator/src/gen';
import router from '../../router';
import { clearAdminToken, clearUserToken } from '../../utils/jwtUtils';

const baseConfig = new Configuration({
    basePath: 'http://localhost:8080',
});

const userConfig = new Configuration({
    basePath: 'http://localhost:8080',
    baseOptions: {
        validateStatus: (status: number) => {
            if (status === 401) {
                clearUserToken();
                router.push('/user-login');
            }
            return status >= 200 && status < 300;
        },
    },
});
const adminConfig = new Configuration({
    basePath: 'http://localhost:8080',
    baseOptions: {
        validateStatus: (status: number) => {
            if (status === 401) {
                clearAdminToken();
                router.push('/admin-login');
            }
            return status >= 200 && status < 300;
        },
    },
});

export * from '@mrdew/dewqr-api-generator/src/gen/models'
export type {Configuration}
export const userApi = new UserApi(userConfig);
export const adminApi = new AdminApi(adminConfig);
export const authApi = new AuthApi(baseConfig)