import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export const UserProfile: React.FC = () => {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Error parsing user", e);
            }
        }
    }, []);

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center">
                    <Icon icon="lucide:user" className="text-text-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors border-none bg-transparent">
            <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-text leading-tight">{user.username}</p>
                    <p className="text-xs text-text-muted leading-tight">{user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-primary font-bold">{user.username.charAt(0).toUpperCase()}</span>
                </div>
        </div>
    );
};
