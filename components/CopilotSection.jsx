import { ArrowUp, Send } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ChatSession } from '@google/generative-ai';

const CopilotSection = () => {
    const [click, setClick] = useState("AI");
    const [text, setText] = useState('');
    const [isloading, setisloading] = useState(false);
    const textareaRef = useRef(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [summaries, setSummaries] = useState([]);


    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleGemini = async () => {
        try {
            setisloading(true);

            setChatHistory(prev => [...prev, { role: "user", content: text }]);

            const res = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: text,
                    summaries,
                }),
            });
            setText('');

            const data = await res.json();


            if (data.answer) {
                setChatHistory(prev => [...prev, { role: "assistant", content: data.answer }]);

            }

            if (data.summary) {
                setSummaries(prev => {
                    const updatedSummaries = [...prev.slice(-4), data.summary];
                    return updatedSummaries;
                });
            }

        } catch (e) {
            console.error("Error in handleGemini:", e);
        } finally {
            setisloading(false);
        }
    };

    return (
        <div className="w-[30vw] max-h-[95vh] p-4 flex flex-col justify-between items-start overflow-x-hidden overflow-y-scroll">
            <div className="text-[16px] flex justify-start items-center w-full gap-6">

                <div
                    onClick={() => setClick("AI")}
                    className={`cursor-pointer font-medium relative pb-[5px]
                        ${click === "AI" ? "text-transparent bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text" : "text-gray-500"}
                        after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
                        ${click === "AI" ? "after:bg-gradient-to-r after:from-blue-500 after:to-pink-500" : "after:bg-transparent"}
                    `}
                >
                    AI Copilot
                </div>

                <div
                    onClick={() => setClick("DETAILS")}
                    className={`cursor-pointer font-medium relative pb-[5px]
                        ${click === "DETAILS" ? "text-transparent bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text" : "text-gray-500"}
                        after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
                        ${click === "DETAILS" ? "after:bg-gradient-to-r after:from-blue-500 after:to-pink-500" : "after:bg-transparent"}
                    `}
                >
                    Details
                </div>
            </div>

            <div className='flex flex-col gap-3 w-full'>
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex w-full ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`p-3 rounded-xl text-sm 
          ${chat.role === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: (props) => <h1 className="text-2xl font-bold my-2" {...props} />,
                                    h2: (props) => <h2 className="text-xl font-bold my-2" {...props} />,
                                    h3: (props) => <h3 className="text-lg font-bold my-2" {...props} />,
                                    p: (props) => <p className={`${chat.role === "user" ? "" : "mb-2"}`} {...props} />,
                                    strong: (props) => <strong className="font-bold" {...props} />,
                                    em: (props) => <em className="italic" {...props} />,
                                    code: ({ inline, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        if (!inline && match) {
                                            return (
                                                <SyntaxHighlighter
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        margin: '1rem 0',
                                                    }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            );
                                        }
                                        return (
                                            <code className="bg-gray-200 text-black rounded" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    ul: (props) => <ul className="list-disc pl-6 mb-2" {...props} />,
                                    ol: (props) => <ol className="list-decimal pl-6 mb-2" {...props} />,
                                    blockquote: (props) => (
                                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2" {...props} />
                                    ),
                                    table: (props) => <table className="border-collapse border border-gray-300 w-full my-2" {...props} />,
                                    thead: (props) => <thead className="bg-gray-200" {...props} />,
                                    tbody: (props) => <tbody {...props} />,
                                    tr: (props) => <tr className="border border-gray-300" {...props} />,
                                    th: (props) => <th className="border border-gray-300 px-4 py-2 text-left" {...props} />,
                                    td: (props) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                                }}
                            >
                                {chat.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>


            <div className='h-fit w-full border p-2 border-gray-200 rounded-lg bg-white shadow-sm flex items-center gap-2 mt-4'>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    className="resize-none h-[32px] leading-tight py-1 px-2 font-sans text-sm text-gray-800 border-none shadow-none rounded-md w-full placeholder:text-gray-400 focus:outline-none focus:border-none focus:ring-0"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="ask a question"
                />

                {
                    isloading ?
                        <span className='loader'></span>
                        :
                        <ArrowUp className='text-gray-500 cursor-pointer'
                            onClick={() => handleGemini()}
                        />
                }

            </div>

        </div>
    );
};

export default CopilotSection;
