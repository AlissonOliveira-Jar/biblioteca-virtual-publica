import { FaUserCircle } from 'react-icons/fa';

interface UserAvatarProps {
    avatarUrl?: string | null;
    username: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    level?: number;
    showLevel?: boolean;
}

const UserAvatar = ({
                        avatarUrl,
                        username,
                        size = 'md',
                        level,
                        showLevel = false
                    }: UserAvatarProps) => {

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-32 h-32'
    };

    const iconSizeClasses = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-5xl',
        xl: 'text-8xl'
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative ${sizeClasses[size]}`}>
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-full h-full rounded-full object-cover border-4 border-purple-500 shadow-lg"
                    />
                ) : (
                    <FaUserCircle className={`w-full h-full text-gray-400 ${iconSizeClasses[size]}`} />
                )}
            </div>

            {showLevel && level !== undefined && (
                <div className="text-center">
                    <p className="text-white font-semibold text-sm">{username}</p>
                    <p className="text-purple-400 text-xs font-bold">Nível {level}</p>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;