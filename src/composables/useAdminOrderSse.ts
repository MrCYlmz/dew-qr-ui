import { onMounted, onUnmounted, ref } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { DEW_QR_API_URL } from '../config';
import { getJWTToken } from '../utils/jwtUtils';
import { orderKey } from '../api/key';

export function useAdminOrderSse() {
    const queryClient = useQueryClient();
    const eventSource = ref<EventSource | null>(null);
    const isConnected = ref(false);

    const connect = () => {
        const token = getJWTToken();
        if (!token) {
            console.warn('No JWT token available for SSE connection');
            return;
        }

        const url = `${DEW_QR_API_URL}/v1/admin/sse/orders?token=${encodeURIComponent(token)}`;

        eventSource.value = new EventSource(url);

        eventSource.value.onopen = () => {
            console.log('Admin SSE connection established');
            isConnected.value = true;
        };

        eventSource.value.onerror = (error) => {
            console.error('Admin SSE connection error:', error);
            isConnected.value = false;

            eventSource.value?.close();
            eventSource.value = null;

            setTimeout(() => {
                console.log('Attempting SSE reconnection...');
                connect();
            }, 5000);
        };

        eventSource.value.addEventListener('connected', (event) => {
            console.log('SSE connected event:', event.data);
        });

        eventSource.value.addEventListener('ORDER_CREATED', (event) => {
            console.log('Order created:', event.data);
            invalidateOrderQueries();
        });

        eventSource.value.addEventListener('ORDER_UPDATED', (event) => {
            console.log('Order updated:', event.data);
            invalidateOrderQueries();
        });

        eventSource.value.addEventListener('ORDER_DELETED', (event) => {
            console.log('Order deleted:', event.data);
            invalidateOrderQueries();
        });
    };

    const invalidateOrderQueries = () => {
        queryClient.invalidateQueries({ queryKey: orderKey() });
    };

    const disconnect = () => {
        if (eventSource.value) {
            eventSource.value.close();
            eventSource.value = null;
            isConnected.value = false;
            console.log('Admin SSE connection closed');
        }
    };

    onMounted(() => {
        connect();
    });

    onUnmounted(() => {
        disconnect();
    });

    return {
        isConnected,
        reconnect: connect,
        disconnect
    };
}
