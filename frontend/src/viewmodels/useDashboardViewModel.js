import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchInboxApi, fetchSentApi, fetchInTransitApi } from '../services/letterApi';

export function useDashboardViewModel() {
    const { currentUser } = useAuth();
    const token = currentUser?.accessToken;

    const inboxQuery = useQuery({
        queryKey: ['inbox', token],
        queryFn: () => fetchInboxApi(token),
        enabled: !!token,
    });

    const sentQuery = useQuery({
        queryKey: ['sent', token],
        queryFn: () => fetchSentApi(token),
        enabled: !!token,
    });

    const transitQuery = useQuery({
        queryKey: ['inTransit', token],
        queryFn: () => fetchInTransitApi(token),
        enabled: !!token,
    });

    return {
        inTransit: transitQuery.data || [],
        delivered: inboxQuery.data || [],
        sentItems: sentQuery.data || [],
        loading: inboxQuery.isLoading || sentQuery.isLoading || transitQuery.isLoading,
        backendAvailable: true,
        refresh: () => {
            inboxQuery.refetch();
            sentQuery.refetch();
            transitQuery.refetch();
        },
    };
}
