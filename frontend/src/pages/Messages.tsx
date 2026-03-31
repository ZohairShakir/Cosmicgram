import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, Phone, Video, Info, Smile, Image, Mic, Shield } from "lucide-react";
import { mockConversations } from "@/data/mockMessages";
import { currentUser } from "@/data/mockUsers";

const Messages = () => {
  const [activeConv, setActiveConv] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(activeConv.messages);
  const [showConvList, setShowConvList] = useState(true);

  const handleSend = () => {
    if (!messageText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        senderId: currentUser.id,
        text: messageText.trim(),
        timestamp: "Just now",
        isRead: false,
      },
    ]);
    setMessageText("");
  };

  const selectConv = (conv: typeof activeConv) => {
    setActiveConv(conv);
    setMessages(conv.messages);
    setShowConvList(false);
  };

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden h-[calc(100vh-120px)] lg:h-[calc(100vh-40px)] flex">
      {/* Conversation List */}
      <div className={`w-full md:w-[340px] border-r border-border flex flex-col ${!showConvList && "hidden md:flex"}`}>
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">{currentUser.username}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-secondary rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConv(conv)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-secondary/60 transition-colors ${
                activeConv.id === conv.id ? "bg-secondary" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.avatar} alt={conv.username} className="w-12 h-12 rounded-full object-cover" />
                {conv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-sm font-semibold block truncate">{conv.displayName}</span>
                <span className={`text-xs truncate block ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {conv.lastMessage}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${showConvList && "hidden md:flex"}`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-3">
            <button className="md:hidden mr-1 text-muted-foreground" onClick={() => setShowConvList(true)}>
              ←
            </button>
            <div className="relative">
              <img src={activeConv.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              {activeConv.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />}
            </div>
            <div>
              <span className="text-sm font-semibold">{activeConv.displayName}</span>
              <span className="text-xs text-muted-foreground block">{activeConv.isOnline ? "Active now" : "Offline"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Phone className="h-5 w-5 cursor-pointer" />
            <Video className="h-5 w-5 cursor-pointer" />
            <Info className="h-5 w-5 cursor-pointer" />
          </div>
        </div>

        {/* AI Safety Notice */}
        <div className="flex items-center justify-center gap-1 py-1.5 bg-primary/5 text-xs text-primary">
          <Shield className="h-3 w-3" />
          <span>Messages are AI-monitored for safety</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isOwn = msg.senderId === currentUser.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  isOwn ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-[10px] mt-1 block ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
            <Smile className="h-5 w-5 text-muted-foreground cursor-pointer" />
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <Image className="h-5 w-5 text-muted-foreground cursor-pointer" />
            <Mic className="h-5 w-5 text-muted-foreground cursor-pointer" />
            {messageText && (
              <button onClick={handleSend}>
                <Send className="h-5 w-5 text-primary" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
