import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socketService } from "@/lib/services/socketService";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?._id) {
            socketService.connect(user._id);
            setIsConnected(true);

            return () => {
                socketService.disconnect();
                setIsConnected(false);
            };
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socketService, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
