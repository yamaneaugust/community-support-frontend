import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageCircle, Shield, MapPin, Phone, CheckCircle, Send, AlertCircle } from 'lucide-react';

const API_URL = 'https://community-support-backend.onrender.com/api';

const INITIAL_RESOURCES = [
  {
    id: 1,
    name: "SNUG Street Outreach",
    type: ["violence-prevention", "youth"],
    location: "Bronx, NY",
    description: "Street outreach program providing conflict mediation and violence interruption services.",
    phone: "(718) 555-0100",
    verified: true
  },
  {
    id: 2,
    name: "Trauma Recovery Center",
    type: ["trauma", "victims"],
    location: "Brooklyn, NY",
    description: "Free trauma-focused therapy for gun violence survivors and family members.",
    phone: "(718) 555-0200",
    verified: true
  },
  {
    id: 3,
    name: "Safe Haven Housing",
    type: ["housing"],
    location: "Queens, NY",
    description: "Emergency and transitional housing for those displaced by community violence.",
    phone: "(718) 555-0300",
    verified: true
  }
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Services' },
  { value: 'trauma', label: 'Trauma Therapy' },
  { value: 'housing', label: 'Housing' },
  { value: 'legal', label: 'Legal Aid' },
  { value: 'violence-prevention', label: 'Violence Prevention' },
  { value: 'youth', label: 'Youth Programs' },
  { value: 'victims', label: 'Victim Services' }
];

export default function CommunitySupportHub() {
  const [activeTab, setActiveTab] = useState('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatContext, setChatContext] = useState({ step: 'initial' });
  const messagesEndRef = useRef(null);
  const [formData, setFormData] = useState({
    supportType: '',
    location: '',
    situation: '',
    urgency: 'soon',
    contact: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/resources`);
        const data = await response.json();
        
        if (data.success) {
          setResources(data.data);
          setFilteredResources(data.data);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources(INITIAL_RESOURCES);
        setFilteredResources(INITIAL_RESOURCES);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(r => r.type && r.type.includes(activeFilter));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query) ||
        (r.type && r.type.some(t => t.includes(query)))
      );
    }
    
    setFilteredResources(filtered);
  }, [searchQuery, activeFilter, resources]);

  useEffect(() => {
    if (activeTab === 'chatbot' && messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: "Hello! I'm here to help connect you with local support services. Can you tell me what kind of help you're looking for?",
        options: [
          "Trauma therapy",
          "Housing assistance",
          "Legal help",
          "Violence prevention programs",
          "Youth services"
        ]
      }]);
    }
  }, [activeTab, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatOption = (option) => {
    setMessages(prev => [...prev, { type: 'user', text: option }]);
    setChatContext({ step: 'location', selectedService: option });
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "Great! What's your location or zip code? This helps me find resources near you."
      }]);
    }, 500);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setChatInput('');
    
    setTimeout(() => {
      if (chatContext.step === 'location') {
        const matched = resources.filter(r =>
          r.location.toLowerCase().includes(userMessage.toLowerCase()) ||
          userMessage.toLowerCase().includes(r.location.toLowerCase().split(',')[0])
        ).slice(0, 3);
        
        if (matched.length > 0) {
          let response = "I found these verified organizations in your area:\n\n";
          matched.forEach(r => {
            response += `📍 ${r.name}\n${r.description}\n📞 ${r.phone}\n\n`;
          });
          response += "Would you like more information?";
          
          setMessages(prev => [...prev, {
            type: 'bot',
            text: response,
            options: ["Show more resources", "Start over", "Submit help request"]
          }]);
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: "I couldn't find resources in that area. Could you provide your city or state?",
            options: ["New York", "California", "Illinois", "Pennsylvania"]
          }]);
        }
        setChatContext({ step: 'results' });
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "I'm here to help. Could you tell me more about what you need?",
          options: ["Find resources", "Emergency help", "Talk to someone"]
        }]);
      }
    }, 800);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.supportType || !formData.location) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setFormLoading(true);
      
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormSubmitted(true);
        setFormData({
          supportType: '',
          location: '',
          situation: '',
          urgency: 'soon',
          contact: ''
        });
      } else {
        alert('Error submitting request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-500 text-white px-6 py-4 rounded-xl mb-6 text-center font-semibold shadow-xl">
          🆘 In immediate danger? Call 911 | National Crisis Line: 988 | Crisis Text Line: Text HOME to 741741
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Community Support Hub
          </h1>
          <p className="text-xl text-gray-600">
            Verified resources for gun violence survivors, families, and communities
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-5 mb-6 shadow-xl">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'resources'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <Search size={20} />
              Find Resources
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'chatbot'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <MessageCircle size={20} />
              Get Help Now
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'request'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <Shield size={20} />
              Request Support
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          {activeTab === 'resources' && (
            <div>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by organization name, service type, or location..."
                  className="w-full px-6 py-4 pr-12 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600" size={24} />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {FILTER_OPTIONS.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                      activeFilter === filter.value
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100 border-2 border-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="mt-4 text-gray-600">Loading resources...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map(resource => (
                      <div
                        key={resource.id || resource._id}
                        className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                      >
                        <h3 className="text-purple-600 font-bold text-lg mb-2 flex items-center gap-2">
                          {resource.verified && <CheckCircle size={20} className="text-green-500" />}
                          {resource.name}
                        </h3>
                        <p className="text-gray-600 mb-3 text-sm leading-relaxed">{resource.description}</p>
                        <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
                          <MapPin size={16} />
                          <span className="text-sm">{resource.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
                          <Phone size={16} />
                          <span className="text-sm">{resource.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resource.type && resource.type.map(t => (
                            <span key={t} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {t.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredResources.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No resources found matching your search.</p>
                      <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Support Assistant</h2>
              <div className="bg-white rounded-xl border-2 border-gray-200 h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${msg.type === 'user' ? 'bg-gray-200 text-gray-900' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'} px-5 py-3 rounded-2xl`}>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                        {msg.options && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleChatOption(opt)}
                                className="px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50 transition-all border-2 border-purple-300"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t-2 border-gray-200 flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'request' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Anonymous Support Request</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-lg mb-6">
                <p className="font-semibold text-gray-900">🔒 Your Privacy Matters</p>
                <p className="text-gray-700 mt-2">This form is completely anonymous. No identifying information is required.</p>
              </div>

              {formSubmitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold text-green-800 mb-3">✓ Request Submitted</h3>
                  <p className="text-gray-700 mb-6">We've routed your request to local partners. Check the Resources tab for immediate options.</p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      What kind of support do you need? *
                    </label>
                    <select
                      value={formData.supportType}
                      onChange={(e) => setFormData({...formData, supportType: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                    >
                      <option value="">Select a type...</option>
                      <option value="trauma">Trauma counseling or therapy</option>
                      <option value="housing">Housing assistance</option>
                      <option value="legal">Legal aid</option>
                      <option value="financial">Financial assistance</option>
                      <option value="safety">Safety planning</option>
                      <option value="peer">Peer support group</option>
                      <option value="medical">Medical care</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Your Location (City/Neighborhood) *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., Brooklyn, NY"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Tell us about your situation (Optional)
                    </label>
                    <textarea
                      value={formData.situation}
                      onChange={(e) => setFormData({...formData, situation: e.target.value})}
                      placeholder="Share as much or as little as you're comfortable with..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      How urgent is your need?
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                    >
                      <option value="immediate">Immediate (within 24 hours)</option>
                      <option value="soon">Soon (within a week)</option>
                      <option value="planning">Planning ahead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Preferred Contact Method (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      placeholder="Phone, email, or leave blank"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Only provide if you want a follow-up.
                    </p>
                  </div>

                  <button
                    onClick={handleFormSubmit}
                    disabled={formLoading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}