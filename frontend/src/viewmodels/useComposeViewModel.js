import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendLetterApi, fetchExploreUsersApi, fetchInboxApi, fetchSentApi } from '../services/letterApi';
import { useLocation } from 'react-router-dom';

export function useComposeViewModel() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Recipient handling
    const location = useLocation();
    const [selectedRecipient, setSelectedRecipient] = useState(location.state?.recipient || null);
    
    // Search & Recent
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recentPals, setRecentPals] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { currentUser } = useAuth();

    // Fetch recent pen pals from history
    useEffect(() => {
        async function loadRecent() {
            if (!currentUser) return;
            try {
                const token = currentUser.accessToken;
                const [inbox, sent] = await Promise.all([
                    fetchInboxApi(token),
                    fetchSentApi(token)
                ]);

                // Extract unique pals
                const palsMap = new Map();
                
                // From Inbox (Sender info)
                inbox.forEach(l => {
                    if (l.senderId) {
                        palsMap.set(l.senderId, {
                            uid: l.senderId,
                            penName: l.senderName,
                            city: l.senderCity,
                            country: l.senderCountry,
                            latitude: l.senderLat,
                            longitude: l.senderLon
                        });
                    }
                });

                // From Sent (Receiver info)
                sent.forEach(l => {
                    if (l.receiverId) {
                        palsMap.set(l.receiverId, {
                            uid: l.receiverId,
                            penName: l.receiverName,
                            city: l.receiverCity,
                            country: l.receiverCountry,
                            latitude: l.receiverLat,
                            longitude: l.receiverLon
                        });
                    }
                });

                setRecentPals(Array.from(palsMap.values()).slice(0, 5));
            } catch (err) {
                console.warn("Failed to load recent pals:", err);
            }
        }
        loadRecent();
    }, [currentUser]);

    // Handle Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim() || !currentUser) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const token = currentUser.accessToken;
                const allUsers = await fetchExploreUsersApi(token);
                
                const filtered = allUsers.filter(u => 
                    u.penName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.country?.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 8);

                setSearchResults(filtered);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, currentUser]);

    async function submit() {
        if (!content.trim()) return;

        setLoading(true);
        setError('');
        
        try {
            const token = currentUser?.accessToken;
            const recipientId = selectedRecipient?.uid || selectedRecipient?.id;
            
            if (!recipientId) {
                throw new Error("No recipient selected. Please select a pen pal below.");
            }

            await sendLetterApi(token, content, recipientId);
            
            // Artificial delay for 'sealing' feel
            setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 1500);

        } catch (err) {
            console.error("API call failed:", err);
            setError(err.response?.data?.message || err.message || "The archival seal failed to set. Please try again.");
            setLoading(false);
        }
    }

    return {
        content,
        setContent,
        loading,
        success,
        error,
        submit,
        selectedRecipient,
        setSelectedRecipient,
        searchQuery,
        setSearchQuery,
        searchResults,
        recentPals,
        isSearching
    };
}
