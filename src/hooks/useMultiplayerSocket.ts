import { useState, useEffect, useRef, useCallback } from 'react';
import { getSessionToken, getWebSocketUrl } from '../api';

export interface ChatMessage {
    id: string;
    channel: 'global' | 'party' | 'whisper' | 'system';
    sender_id?: string;
    sender_name: string;
    text: string;
    timestamp: number;
}

export interface RoomPlayer {
    id: string;
    name: string;
    character_class: string;
}

export interface PartyMember {
    id: string;
    name: string;
    character_class: string;
    location_id: string;
    is_leader: boolean;
    is_online: boolean;
}

export interface PartyInfo {
    id: string;
    leader_id: string;
    members: PartyMember[];
}

export interface PartyInvite {
    from_player_id: string;
    from_player_name: string;
    party_id: string;
}

export interface OnlinePlayer {
    id: string;
    name: string;
    character_class: string;
    location_id: string;
    party_id?: string;
}

interface UseMultiplayerSocketProps {
    playerId: string;
    currentLocationId?: string;
    onSystemMessage?: (msg: string) => void;
    onRoomEvent?: (event: any) => void;
}

export const useMultiplayerSocket = ({
    playerId,
    currentLocationId,
    onSystemMessage,
    onRoomEvent
}: UseMultiplayerSocketProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [roomPlayers, setRoomPlayers] = useState<RoomPlayer[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [party, setParty] = useState<PartyInfo | null>(null);
    const [pendingInvite, setPendingInvite] = useState<PartyInvite | null>(null);
    const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
    
    const socketRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<number | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const isUnmountedRef = useRef(false);

    const appendMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
        const fullMsg: ChatMessage = {
            ...msg,
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        };
        setChatMessages(prev => [...prev.slice(-150), fullMsg]);
    }, []);

    useEffect(() => {
        isUnmountedRef.current = false;
        if (!playerId) {
            setIsConnected(false);
            setRoomPlayers([]);
            setParty(null);
            setPendingInvite(null);
            return;
        }

        const connectSocket = () => {
            if (isUnmountedRef.current) return;
            
            // If already open or connecting, do not recreate
            if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
                return;
            }

            const token = getSessionToken() || '';
            const wsUrl = getWebSocketUrl(playerId, token);
            console.log('[Multiplayer WS] Connecting to:', wsUrl);

            try {
                const ws = new WebSocket(wsUrl);
                socketRef.current = ws;

                ws.onopen = () => {
                    if (isUnmountedRef.current) {
                        ws.close();
                        return;
                    }
                    console.log('[Multiplayer WS] Connected successfully!');
                    setIsConnected(true);

                    // Start 20s heartbeat
                    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
                    pingIntervalRef.current = window.setInterval(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'PING' }));
                        }
                    }, 20000);
                };

                ws.onmessage = (event) => {
                    if (isUnmountedRef.current) return;
                    try {
                        const data = JSON.parse(event.data);
                        const eventType = data.event || data.type;

                        if (eventType === 'PONG') {
                            return; // Heartbeat ack
                        }

                        console.log('[Multiplayer WS] Message received:', data);

                        if (eventType === 'SYSTEM_EVENT') {
                            if (data.subtype === 'CONNECTED_SUCCESS') {
                                if (data.present_players) {
                                    setRoomPlayers(data.present_players);
                                }
                                if (data.party) {
                                    setParty(data.party);
                                }
                                if (data.online_players) {
                                    setOnlinePlayers(data.online_players);
                                }
                                appendMessage({
                                    channel: 'system',
                                    sender_name: 'NETWORK',
                                    text: data.message,
                                    timestamp: Date.now()
                                });
                                if (onSystemMessage && data.message) {
                                    onSystemMessage(data.message);
                                }
                            } else if (data.subtype === 'ONLINE_PLAYERS_LIST') {
                                if (data.online_players) {
                                    setOnlinePlayers(data.online_players);
                                }
                            } else if (data.subtype === 'PARTY_ERROR') {
                                appendMessage({
                                    channel: 'system',
                                    sender_name: 'SYSTEM',
                                    text: data.message,
                                    timestamp: Date.now()
                                });
                            }
                        } else if (eventType === 'ROOM_EVENT') {
                            if (data.subtype === 'PLAYER_JOINED_ROOM') {
                                setRoomPlayers(prev => {
                                    if (prev.some(p => p.id === data.player_id)) return prev;
                                    return [...prev, {
                                        id: data.player_id,
                                        name: data.player_name,
                                        character_class: data.character_class || 'adventurer'
                                    }];
                                });
                            } else if (data.subtype === 'PLAYER_LEFT_ROOM') {
                                setRoomPlayers(prev => prev.filter(p => p.id !== data.player_id));
                            } else if (data.subtype === 'PRESENCE_SYNC') {
                                if (data.present_players) {
                                    setRoomPlayers(data.present_players);
                                }
                            }
                            if (onRoomEvent) onRoomEvent(data);
                        } else if (eventType === 'PARTY_EVENT') {
                            if (data.subtype === 'PARTY_UPDATE' || data.subtype === 'PARTY_CREATED') {
                                setParty(data.party);
                                if (data.message) {
                                    appendMessage({
                                        channel: 'system',
                                        sender_name: 'PARTY',
                                        text: data.message,
                                        timestamp: Date.now()
                                    });
                                }
                            } else if (data.subtype === 'INVITE_RECEIVED') {
                                setPendingInvite({
                                    from_player_id: data.from_player_id,
                                    from_player_name: data.from_player_name,
                                    party_id: data.party_id
                                });
                                appendMessage({
                                    channel: 'system',
                                    sender_name: 'PARTY',
                                    text: `${data.from_player_name} invited you to join their party! Check the Group tab.`,
                                    timestamp: Date.now()
                                });
                            } else if (data.subtype === 'INVITE_DECLINED' || data.subtype === 'INVITE_SENT_RESULT' || data.subtype === 'ACCEPT_RESULT') {
                                appendMessage({
                                    channel: 'system',
                                    sender_name: 'PARTY',
                                    text: data.message,
                                    timestamp: Date.now()
                                });
                            } else if (data.subtype === 'PARTY_LEFT') {
                                setParty(null);
                                setPendingInvite(null);
                                appendMessage({
                                    channel: 'system',
                                    sender_name: 'PARTY',
                                    text: data.message || 'You left the party.',
                                    timestamp: Date.now()
                                });
                            }
                        } else if (eventType === 'CHAT_MESSAGE') {
                            if (data.subtype === 'PARTY') {
                                appendMessage({
                                    channel: 'party',
                                    sender_id: data.sender_id,
                                    sender_name: data.sender_name,
                                    text: data.text,
                                    timestamp: data.timestamp ? data.timestamp * 1000 : Date.now()
                                });
                            } else if (data.subtype === 'SHOUT') {
                                appendMessage({
                                    channel: 'global',
                                    sender_id: data.sender_id,
                                    sender_name: data.sender_name,
                                    text: data.text,
                                    timestamp: data.timestamp ? data.timestamp * 1000 : Date.now()
                                });
                            } else if (data.subtype === 'WHISPER_RECEIVED') {
                                appendMessage({
                                    channel: 'whisper',
                                    sender_id: data.sender_id,
                                    sender_name: data.sender_name,
                                    text: data.text,
                                    timestamp: Date.now()
                                });
                            } else if (data.subtype === 'WHISPER_SENT') {
                                appendMessage({
                                    channel: 'whisper',
                                    sender_name: `To ${data.target_name}`,
                                    text: data.text,
                                    timestamp: Date.now()
                                });
                            } else if (data.subtype === 'WHISPER_FAILED') {
                                appendMessage({
                                    channel: 'system',
                                    sender_name: 'SYSTEM',
                                    text: data.message,
                                    timestamp: Date.now()
                                });
                            }
                        }
                    } catch (e) {
                        console.error('[Multiplayer WS] Failed to parse websocket message', e);
                    }
                };

                ws.onclose = (event) => {
                    console.log('[Multiplayer WS] Closed:', event.code, event.reason);
                    if (isUnmountedRef.current) return;
                    setIsConnected(false);
                    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
                    
                    // Reconnect after 3s
                    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = window.setTimeout(() => {
                        if (!isUnmountedRef.current) {
                            connectSocket();
                        }
                    }, 3000);
                };

                ws.onerror = (err) => {
                    console.error('[Multiplayer WS] Error:', err);
                };

            } catch (err) {
                console.error('[Multiplayer WS] Connection error:', err);
                setIsConnected(false);
            }
        };

        connectSocket();

        return () => {
            isUnmountedRef.current = true;
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, [playerId]);

    // Send location sync when location changes
    useEffect(() => {
        if (currentLocationId && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'LOCATION_UPDATE',
                location_id: currentLocationId
            }));
        }
    }, [currentLocationId]);

    const sendParty = useCallback((text: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'CHAT_PARTY',
                text: text
            }));
        }
    }, []);

    const sendShout = useCallback((text: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'CHAT_SHOUT',
                text: text
            }));
            appendMessage({
                channel: 'global',
                sender_name: 'You',
                text: text,
                timestamp: Date.now()
            });
        }
    }, [appendMessage]);

    const sendWhisper = useCallback((targetName: string, text: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'CHAT_WHISPER',
                target: targetName,
                text: text
            }));
        }
    }, []);

    const createParty = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'PARTY_CREATE' }));
        }
    }, []);

    const inviteToParty = useCallback((targetName: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'PARTY_INVITE',
                target_name: targetName
            }));
        }
    }, []);

    const acceptPartyInvite = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'PARTY_ACCEPT' }));
            setPendingInvite(null);
        }
    }, []);

    const declinePartyInvite = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'PARTY_DECLINE' }));
            setPendingInvite(null);
        }
    }, []);

    const leaveParty = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'PARTY_LEAVE' }));
        }
    }, []);

    const kickFromParty = useCallback((targetId: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'PARTY_KICK',
                target_id: targetId
            }));
        }
    }, []);

    const refreshOnlinePlayers = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'GET_ONLINE_PLAYERS' }));
        }
    }, []);

    return {
        isConnected,
        roomPlayers,
        chatMessages,
        party,
        pendingInvite,
        onlinePlayers,
        sendParty,
        sendShout,
        sendWhisper,
        createParty,
        inviteToParty,
        acceptPartyInvite,
        declinePartyInvite,
        leaveParty,
        kickFromParty,
        refreshOnlinePlayers
    };
};
