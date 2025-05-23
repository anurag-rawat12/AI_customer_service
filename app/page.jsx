'use client';
import CopilotSection from "@/components/CopilotSection";
import EmailSection from "@/components/EmailSection";
import MainChat from "@/components/MainChat";
import { emails } from "@/utils/SampleData";
import { useState } from "react";

export default function Home() {

  const [text, setText] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [emailUser, setEmailUser] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailID, setEmailID] = useState('');



  const handleGemini = async () => {
    try {
      setChatHistory(prev => [...prev, { role: "user", content: text }]);

      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          summaries,
        }),
      });

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
    }
  };

  return (
    <div className="flex flex-row w-full py-2 overflow-hidden ">
      <EmailSection
        setEmailUser={setEmailUser}
        setEmailMessage={setEmailMessage}
        setEmailID={setEmailID}
        emailID={emailID}
      />

      <MainChat
        emailUser={emailUser}
        emailMessage={emailMessage}
        emailID={emailID}
      />

      <CopilotSection 
      />
    </div>
  );
}
