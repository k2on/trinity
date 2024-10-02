import { useMutation, useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { queryClient } from './query';

const QUERY_KEY = "auth-token";

export const useGetTokenQuery = () => useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
        const key = "accessToken";
        const token = Platform.OS == "web" ? localStorage.getItem(key) : await getItemAsync(key);
        if (!token) return null;
        return token;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
});

export const useSetTokenMutation = () => useMutation({
    mutationFn: async ({ token }: { token: string }) => {
        const key = "accessToken";
        if (Platform.OS == "web") {
            localStorage.setItem(key, token);
        } else {
            await setItemAsync(key, token);
        }
    },
    onSuccess() {
        queryClient.invalidateQueries([QUERY_KEY]);
    },
});

export const useRemoveTokenMutation = () => useMutation({
    mutationFn: async () => {
        const key = "accessToken";
        if (Platform.OS == "web") {
            localStorage.removeItem(key);
        } else {
            await deleteItemAsync(key);
        }
    },
    onSuccess() {
        queryClient.invalidateQueries([QUERY_KEY]);
    },
})



export const useStore = () => ({
    getToken: {
        useQuery: useGetTokenQuery
    },
    setToken: {
        useMutation: useSetTokenMutation
    },
    removeToken: {
        useMutation: useRemoveTokenMutation
    }
})

export const store = useStore();
