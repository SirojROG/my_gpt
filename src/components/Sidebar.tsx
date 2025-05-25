
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash, Brain, Moon, Sun } from "lucide-react";
import { ChatSession } from "@/types/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onCreateNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Sidebar = ({ 
  open, 
  sessions, 
  currentSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  isDarkMode,
  onToggleDarkMode
}: SidebarProps) => {
  const isMobile = useIsMobile();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
      <aside 
        className={cn(
          "bg-sidebar border-r flex flex-col w-[280px] transition-all duration-300",
          isMobile ? (open ? "translate-x-0" : "-translate-x-full") : "",
          isMobile ? "fixed left-0 top-0 bottom-0 z-50" : (open ? "flex" : "hidden md:flex")
        )}
      >
        <div className="p-4">
          <Button 
            onClick={onCreateNewSession}
            variant="default" 
            className="w-full flex items-center gap-2 animate-fade-in"
          >
            <MessageSquare className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sessions.length > 0 ? (
            <div className="space-y-1 p-2">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center group hover:bg-sidebar-accent transition-colors duration-200",
                    currentSessionId === session.id 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div 
                    className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer" 
                    onClick={() => onSelectSession(session.id)}
                  >
                    <Brain className="h-4 w-4 flex-shrink-0" />
                    <div className="truncate flex-1">{session.title}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">
                      {formatDate(session.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-10 text-center text-muted-foreground">
              <p>No chat history yet</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 items-center justify-center w-full transition-all duration-300 hover:bg-accent"
              onClick={onToggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/25 z-40 animate-fade-in"
          onClick={() => onSelectSession(currentSessionId)}
        />
      )}
    </>
  );
};

export default Sidebar;
