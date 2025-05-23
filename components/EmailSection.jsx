import React from 'react'
import { emails } from '@/utils/SampleData'
import { getColorForEmail } from '@/utils/Helper';

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const EmailSection = ({ setEmailUser, setEmailMessage, setEmailID , emailID}) => {

    return (
        <div className='w-[20vw] p-4 bg-white font-roboto rounded-lg  '>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-gray-800'>Inbox</h2>
            </div>
            <div className='flex flex-col '  >
                {emails.map((email) => (
                    <div
                        key={email.id}
                        className={`flex items-start gap-2 p-3 rounded-2xl cursor-pointer transition-all hover:bg-gray-100 ${email.unread ? 'text-gray-700' : 'text-gray-400'
                            } ${ emailID == email.id && "bg-gray-50" } `}
                        onClick={() => {
                            setEmailUser(email.username);
                            setEmailMessage(email.message);
                            setEmailID(email.id);
                            email.unread = false;
                        }}
                    >
                        <div className={`w-[26px] h-[26px] rounded-full ${getColorForEmail(email.username , email.id)} flex-shrink-0 flex justify-center items-center text-white font-medium`}>
                            {email.username.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='flex justify-between items-baseline'>
                                <h3 className='text-[14px] font-medium'>
                                    {email.username}
                                </h3>
                                <span className='text-[12px] whitespace-nowrap'>
                                    {formatTime(email.timestamp)}
                                </span>
                            </div>
                            <p className='text-[12px] font-medium truncate'>
                                {email.subject}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EmailSection