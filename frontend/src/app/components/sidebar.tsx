"use client";

import { useEffect } from "react";
import { X, MessageCircle, SidebarOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  className = "",
  isOpen,
  setIsOpen,
}: SidebarProps) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        (event.target as HTMLElement).closest("[data-sidebar]") === null
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen, setIsOpen]);

  const chatItems = [
    { name: "Name of the chat 1" },
    { name: "Name of the chat 2" },
    { name: "Name of the chat 3" },
    { name: "Name of the chat 4" },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`fixed z-50 transition-all duration-400 ${
          isOpen
            ? "flex justify-end translate-x-2 top-4 translate-x-50"
            : "top-4 left-4"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <X className="h-5 w-5 mx-auto" />
        ) : (
          <SidebarOpen className="h-5 w-5" />
        )}
        <span className="sr-only">{isOpen ? "Close" : "Open"} Menu</span>
      </Button>
      <div
        data-sidebar
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
      >
        <div className="flex h-15 items-center border-b px-6 ">
          <h2 className="text-xl font-bold">Chats</h2>
        </div>

        <nav className="h-full flex-1 overflow-y-auto p-4">
          {chatItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full p-3 mb-2 border-1 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </div>
              <X
                className="h-5 w-5 cursor-pointer"
                onClick={() => {
                  // Remove
                }}
              />
            </div>
          ))}
        </nav>

        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
