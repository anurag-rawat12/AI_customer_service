'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { ChevronDown, Laugh, MessageSquareText, Zap } from 'lucide-react';
import { getColorForEmail } from '@/utils/Helper';

const MainChat = ({ emailUser = '', emailMessage = '', emailID, handleGemini }) => {
    const [text, setText] = useState('');
    const [isloading, setisloading] = useState(false);
    const textareaRef = useRef(null);
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleSend = async () => {
        try {
            setisloading(true);
            setChatHistory(prev => [...prev, { role: "user", content: text }]);
            setText('');
        } catch (e) {
            console.error("Error in handleGemini:", e);
        } finally {
            setisloading(false);
        }
    };

    return (
        <div className="w-[50vw] max-w-4xl mx-auto p-4 text-gray-800 flex flex-col overflow-hidden justify-start items-start">
            {/* Sender Name */}
            <div className="font-medium text-lg">{emailUser}</div>

            <div className="w-full h-[85vh] flex flex-col justify-between">
                {/* Chat History */}
                <div className="flex flex-col w-full overflow-y-auto mt-4 space-y-4 pr-2">
                    {/* Initial Email Block */}
                    <div className="flex justify-start w-full">
                        <div className="flex-shrink-0">
                            <div
                                className={`h-[26px] w-[26px] rounded-full text-white flex justify-center items-center ${getColorForEmail(emailUser, emailID)}`}
                            >
                                {emailUser?.charAt(0)?.toUpperCase()}
                            </div>
                        </div>
                        <div className="ml-2 bg-gray-100 p-3 rounded-xl text-[15px] max-w-[80%]">
                            {emailMessage}
                        </div>
                    </div>

                    {/* Dynamic Chat Messages */}
                    {chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-3 rounded-xl text-sm max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[45%] 
                                ${message.role === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="flex flex-col p-3 w-full h-fit mt-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <div className="flex gap-2 justify-start items-center mb-2">
                        <MessageSquareText size={18} className="text-gray-500" />
                        <span className="text-gray-800 text-sm font-semibold tracking-tight">
                            Chat
                        </span>
                        <ChevronDown size={18} className="text-gray-500" />
                    </div>

                    <Textarea
                        ref={textareaRef}
                        className="resize-none max-h-[150px] h-[32px] leading-tight py-2 font-sans text-sm text-gray-800 border-none shadow-none rounded-xl w-full placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your reply here..."
                    />

                    <div className="flex justify-between items-center w-full mt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-3 rounded-lg py-2 cursor-pointer">
                            <Zap size={18} className="text-gray-500" />
                            <div className="w-px h-5 bg-gray-300" />
                            <Laugh size={18} className="text-gray-500" />
                        </div>

                        <div className="flex items-center gap-2 rounded-lg py-2 cursor-pointer">
                            {isloading ? (
                                <span className="loader" />
                            ) : (
                                <span
                                    className="text-sm font-medium text-gray-700"
                                    onClick={handleSend}
                                >
                                    Send
                                </span>
                            )}
                            <div className="w-px h-5 bg-gray-300" />
                            <ChevronDown size={16} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainChat;
