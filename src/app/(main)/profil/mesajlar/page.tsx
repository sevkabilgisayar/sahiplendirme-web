'use client';

import { useState, useEffect } from 'react';
import { Send, Search, Phone, MoreVertical, Check, CheckCheck, Ban, Flag, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [myUserId, setMyUserId] = useState<string>('');

  useEffect(() => {
    // get user id
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.user) setMyUserId(data.user.id);
    });
    
    // get conversations
    fetch('/api/messages').then(r => r.json()).then(data => {
      if (data.success) {
        let convs = data.conversations || [];
        const searchParams = new URLSearchParams(window.location.search);
        const toUserId = searchParams.get('to');
        const listingId = searchParams.get('listingId');

        if (toUserId) {
          const existing = convs.find((c: any) => c.id === toUserId);
          if (!existing && listingId) {
            // Fetch listing info to get target user details
            fetch(`/api/listings/${listingId}`).then(r => r.json()).then(lData => {
              const l = lData.listing;
              if (l && (l.user || l.contactName)) {
                const newConv = {
                  id: toUserId,
                  name: l.contactName ? l.contactName : (l.user ? `${l.user.firstName} ${l.user.lastName}` : 'İsimsiz'),
                  avatar: l.user?.avatar || (l.contactName ? l.contactName.charAt(0) : 'U'),
                  lastMsg: 'Sohbete başlayın...',
                  time: 'Şimdi',
                  listingName: `${l.name || 'İlan'} - ${l.breed || ''}`,
                  unread: 0,
                  online: true,
                  draftListingId: listingId // Store for the first message
                };
                setConversations(prev => [newConv, ...prev]);
                setActiveChat(toUserId);
              }
            });
          } else {
            setActiveChat(toUserId);
          }
        } else if (convs.length > 0) {
          setActiveChat(convs[0].id);
        }
        
        setConversations(convs);
      }
    });
  }, []);

  useEffect(() => {
    let intervalId: any;
    
    const fetchMessages = () => {
      if (activeChat) {
        fetch(`/api/messages/${activeChat}`).then(r => r.json()).then(data => {
          if (data.success) setMessages(data.messages);
        });
      }
    };

    if (activeChat) {
      fetchMessages(); // initial fetch
      // Kısa aralıklı polling ile "gerçek zamanlı (real-time)" simülasyonu
      intervalId = setInterval(fetchMessages, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeChat]);

  const activeConv = conversations.find(c => c.id === activeChat);
  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.listingName && c.listingName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSend = async () => {
    if (!messageText.trim() || !activeChat) return;
    
    const textToSend = messageText;
    setMessageText('');

    // Optimistic UI update
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, senderId: myUserId, content: textToSend, createdAt: new Date().toISOString(), isRead: false }]);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const listingId = activeConv?.draftListingId || searchParams.get('listingId');
      
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeChat,
          content: textToSend,
          listingId: listingId || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        // replace temp message with real one
        setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold font-display mb-6">Mesajlar</h1>

        <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>

          {/* Left: Conversation List */}
          <div className={`w-full sm:w-80 lg:w-96 border-r border-[var(--border)] flex flex-col flex-shrink-0 ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input type="text" placeholder="Konuşma ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((conv) => (
                <button key={conv.id} onClick={() => setActiveChat(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--surface-secondary)] transition-colors border-b border-[var(--border-subtle)] ${
                    activeChat === conv.id ? 'bg-[var(--surface-secondary)]' : ''
                  }`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-lg">
                      {conv.avatar}
                    </div>
                    {conv.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--surface)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">{conv.name}</span>
                      <span className="text-xs text-[var(--foreground-muted)] flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] truncate">{conv.lastMsg}</p>
                    <p className="text-[10px] text-[var(--brand-primary)] truncate mt-0.5">{conv.listingName}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Chat Area */}
          <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
                  <button onClick={() => setActiveChat(null)} className="sm:hidden text-[var(--foreground-muted)]">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center font-bold">
                      {activeConv.avatar}
                    </div>
                    {activeConv.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[var(--surface)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{activeConv.name}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {activeConv.online ? '● Çevrimiçi' : 'Son görülme: ' + activeConv.time}
                      {' · '}{activeConv.listingName}
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full hover:bg-[var(--surface-secondary)] flex items-center justify-center">
                      <MoreVertical size={18} className="text-[var(--foreground-muted)]" />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-10 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg z-10 py-1">
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--surface-secondary)] transition-colors">
                          <Phone size={14} /> Telefonu Gör
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--surface-secondary)] transition-colors text-red-500">
                          <Ban size={14} /> Engelle
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--surface-secondary)] transition-colors text-red-500">
                          <Flag size={14} /> Şikayet Et
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-center text-xs text-[var(--foreground-muted)] py-2">Bugün</div>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === myUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.senderId === myUserId
                          ? 'bg-[var(--brand-primary)] text-white rounded-br-md'
                          : 'bg-[var(--surface-secondary)] text-[var(--foreground)] rounded-bl-md'
                      }`}>
                        <p>{msg.content}</p>
                        <div className={`flex items-center gap-1 justify-end mt-1 ${msg.senderId === myUserId ? 'text-white/70' : 'text-[var(--foreground-muted)]'}`}>
                          <span className="text-[10px]">
                            {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.senderId === myUserId && (
                            msg.isRead ? <CheckCheck size={12} /> : <Check size={12} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[var(--border)]">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Mesaj yazın..." value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" />
                    <Button variant="gradient" className="h-11 w-11 p-0" onClick={handleSend}>
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-bold font-display mb-2">Mesajlarınız</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">Bir konuşma seçerek mesajlaşmaya başlayın.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
