"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpIcon,
  CheckIcon,
  UserIcon,
  StarsIcon,
  XIcon,
} from "lucide-react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import Factcheck from "./components/factcheck";

interface Document {
  question: string;
  response: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFactcheckOpen, setIsFactcheckOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!query || isLoading) return;

    const userMessage = { sender: "user", text: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const botMessageIndex = newMessages.length;
    setMessages([...newMessages, { sender: "bot", text: "..." }]);

    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.text }),
      });

      const data = await res.json();

      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        updatedMessages[botMessageIndex] = {
          sender: "bot",
          text: data.response,
        };
        return updatedMessages;
      });

      setDocuments((prevDocuments) => {
        // Prevent duplicates in the documents list
        const isQuestionInDocuments = prevDocuments.some(
          (doc) => doc.question === userMessage.text
        );
        if (isQuestionInDocuments) {
          return prevDocuments; // Return the previous documents if it's a duplicate
        }
        return [
          ...prevDocuments,
          { question: userMessage.text, response: data.response },
        ];
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        updatedMessages[botMessageIndex] = {
          sender: "bot",
          text: "Mi dispiace, si è verificato un errore nella comunicazione con il server.",
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/documents");
      const data = await res.json();
      setDocuments(data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleFactcheck = () => {
    setIsFactcheckOpen(!isFactcheckOpen);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 bg-gradient-to-t from-gray-100 from-10% via-slate-100 via-20% to-slate-50 -mt-px ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="sticky items-center justify-between px-4 py-2 border-b bg-white backdrop-blur">
          <Navbar />
        </header>

        <main
          ref={chatContainerRef}
          className="h-full w-2/3 self-center flex-1 p-2 m-1 border-1 rounded-sm overflow-y-auto shadow-sm "
          style={{
            maxHeight: "calc(100vh - 220px)",
            scrollbarWidth: "none",
          }}
        >
          <div className="w-full h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <h2 className="text-2xl font-semibold mb-2">
                    Benvenuto in DataPizza AI
                  </h2>
                  <p>Fai una domanda per iniziare la conversazione</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 px-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender !== "user" ? (
                      <>
                        <StarsIcon className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                        <div className="p-3 rounded-xl bg-gray-200 text-black max-w-md break-words">
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-xl bg-gray-200 text-black max-w-md break-words">
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <UserIcon className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className="bg-gray backdrop-blur-md">
          <div className="w-full md:w-7/12 lg:w-5/12 xl:w-4/12 mx-auto border border-gray-200 shadow-xl translate-y-2 flex flex-col space-y-2 p-4 rounded-3xl bg-transparent">
            <div className="flex-1 w-full h-full flex flex-col space-y-2">
              <Input
                className="border-0 bg-transparent shadow-none outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 w-full text-base"
                placeholder={isLoading ? "Attendere..." : "Chiedimi qualcosa.."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-2 space-x-2">
                <Button
                  variant="ghost"
                  className="rounded-full bg-white text-black px-4 py-2 hover:bg-gray-200 shadow-md"
                  disabled={isLoading}
                  onClick={toggleFactcheck}
                >
                  <CheckIcon size={20} color="green" />
                </Button>
                <Button
                  className="rounded-full bg-white border-gray hover:bg-gray-200 shadow-md"
                  onClick={handleSend}
                  disabled={isLoading || !query}
                >
                  <ArrowUpIcon
                    size={30}
                    color={isLoading || !query ? "gray" : "black"}
                  />
                </Button>
              </div>
            </div>
          </div>
        </footer>

        {isFactcheckOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-medium">Fact Checker</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFactcheck}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <XIcon size={20} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <Factcheck documents={documents} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
