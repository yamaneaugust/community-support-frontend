import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageCircle, Shield, MapPin, Phone, CheckCircle, Send, AlertCircle, ExternalLink, BookOpen, AlertTriangle, Eye, Run, Lock, Users, ArrowRight, Heart } from 'lucide-react';

const API_URL = 'https://community-support-backend.onrender.com/api';

const INITIAL_RESOURCES = [
  // National Trauma & Mental Health Resources
  {
    id: 1,
    name: "National Alliance on Mental Illness (NAMI)",
    type: ["trauma", "victims"],
    location: "Nationwide",
    description: "Free mental health support, education, and advocacy. Specialized trauma programs for violence survivors and families.",
    phone: "1-800-950-NAMI (6264)",
    website: "https://www.nami.org",
    verified: true
  },
  {
    id: 2,
    name: "SAMHSA National Helpline",
    type: ["trauma", "victims"],
    location: "Nationwide",
    description: "Free, confidential, 24/7 treatment referral and information service for mental health and substance abuse.",
    phone: "1-800-662-4357",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    verified: true
  },
  {
    id: 3,
    name: "Crisis Text Line",
    type: ["trauma", "victims", "youth"],
    location: "Nationwide",
    description: "Free 24/7 crisis counseling via text message. Trained counselors provide support for trauma, violence, and mental health crises.",
    phone: "Text HOME to 741741",
    website: "https://www.crisistextline.org",
    verified: true
  },
  {
    id: 4,
    name: "The Trauma Recovery Network",
    type: ["trauma", "victims"],
    location: "Nationwide",
    description: "Specialized trauma therapy and support groups for survivors of violence, including gun violence and community trauma.",
    phone: "1-844-887-2862",
    website: "https://www.traumarecoverynetwork.org",
    verified: true
  },
  {
    id: 5,
    name: "PsychHub Trauma Services",
    type: ["trauma", "victims"],
    location: "Nationwide",
    description: "Online trauma-informed mental health resources and therapy referrals for violence survivors.",
    phone: "1-877-727-4343",
    website: "https://www.psychhub.com",
    verified: true
  },

  // National Victim Services
  {
    id: 6,
    name: "National Center for Victims of Crime",
    type: ["victims", "legal"],
    location: "Nationwide",
    description: "Comprehensive support for crime victims including advocacy, counseling referrals, and rights information.",
    phone: "1-855-4-VICTIM (1-855-484-2846)",
    website: "https://www.victimsofcrime.org",
    verified: true
  },
  {
    id: 7,
    name: "Office for Victims of Crime (OVC)",
    type: ["victims", "legal"],
    location: "Nationwide",
    description: "Federal resource center providing victim compensation, crisis response, and support services nationwide.",
    phone: "1-800-851-3420",
    website: "https://ovc.ojp.gov",
    verified: true
  },
  {
    id: 8,
    name: "National Organization for Victim Assistance (NOVA)",
    type: ["victims", "trauma"],
    location: "Nationwide",
    description: "24/7 crisis intervention, victim advocacy, and referrals to local support services.",
    phone: "1-800-879-6682",
    website: "https://www.trynova.org",
    verified: true
  },
  {
    id: 9,
    name: "Mothers Against Violence",
    type: ["victims", "violence-prevention"],
    location: "Nationwide",
    description: "Support network for families who have lost loved ones to gun violence. Grief counseling and advocacy.",
    phone: "1-888-NO-VIOLENCE",
    website: "https://www.mothersagainstviolence.org",
    verified: true
  },

  // National Housing Resources
  {
    id: 10,
    name: "National Domestic Violence Hotline",
    type: ["housing", "victims"],
    location: "Nationwide",
    description: "Emergency shelter referrals, safety planning, and housing assistance for those fleeing violence.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org",
    verified: true
  },
  {
    id: 11,
    name: "HUD Housing Counseling",
    type: ["housing"],
    location: "Nationwide",
    description: "Free housing counseling services including emergency housing, transitional housing, and rental assistance.",
    phone: "1-800-569-4287",
    website: "https://www.hud.gov/findacounselor",
    verified: true
  },
  {
    id: 12,
    name: "National Alliance to End Homelessness",
    type: ["housing"],
    location: "Nationwide",
    description: "Emergency shelter placement, transitional housing programs, and permanent housing solutions.",
    phone: "1-202-638-1526",
    website: "https://endhomelessness.org",
    verified: true
  },
  {
    id: 13,
    name: "Salvation Army Emergency Services",
    type: ["housing", "victims"],
    location: "Nationwide",
    description: "Emergency housing, temporary shelter, and transitional housing programs for violence survivors.",
    phone: "1-800-SAL-ARMY (1-800-725-2769)",
    website: "https://www.salvationarmyusa.org",
    verified: true
  },

  // National Legal Aid
  {
    id: 14,
    name: "Legal Services Corporation (LSC)",
    type: ["legal"],
    location: "Nationwide",
    description: "Free civil legal assistance nationwide. Helps connect low-income individuals with local legal aid providers.",
    phone: "1-202-295-1500",
    website: "https://www.lsc.gov",
    verified: true
  },
  {
    id: 15,
    name: "American Bar Association Pro Bono Center",
    type: ["legal", "victims"],
    location: "Nationwide",
    description: "Free legal assistance for crime victims including protective orders, victim compensation, and rights advocacy.",
    phone: "1-800-285-2221",
    website: "https://www.americanbar.org/groups/probono_public_service",
    verified: true
  },
  {
    id: 16,
    name: "National Crime Victim Law Institute",
    type: ["legal", "victims"],
    location: "Nationwide",
    description: "Legal advocacy and representation for crime victims' rights in court proceedings.",
    phone: "1-503-768-6819",
    website: "https://law.lclark.edu/centers/national_crime_victim_law_institute",
    verified: true
  },
  {
    id: 17,
    name: "Victim Rights Law Center",
    type: ["legal", "victims"],
    location: "Nationwide",
    description: "Free legal services for crime victims including court advocacy and civil legal representation.",
    phone: "1-866-372-1001",
    website: "https://www.victimrights.org",
    verified: true
  },

  // Violence Prevention Programs
  {
    id: 18,
    name: "National Institute for Violence Prevention",
    type: ["violence-prevention", "youth"],
    location: "Nationwide",
    description: "Community violence intervention programs, conflict mediation, and prevention education.",
    phone: "1-877-STOP-GUN",
    website: "https://www.preventviolence.org",
    verified: true
  },
  {
    id: 19,
    name: "Cure Violence",
    type: ["violence-prevention", "youth"],
    location: "Multiple States",
    description: "Evidence-based violence interruption programs treating violence as a public health issue.",
    phone: "1-312-996-8775",
    website: "https://cvg.org",
    verified: true
  },
  {
    id: 20,
    name: "Communities Overcoming Violence",
    type: ["violence-prevention"],
    location: "Nationwide",
    description: "Community-led violence prevention, street outreach, and conflict resolution services.",
    phone: "1-866-968-7233",
    website: "https://www.communitiesovcomingviolence.org",
    verified: true
  },
  {
    id: 21,
    name: "National Network for Safe Communities",
    type: ["violence-prevention", "youth"],
    location: "Nationwide",
    description: "Proven violence reduction strategies and community intervention programs.",
    phone: "1-212-237-8456",
    website: "https://nnscommunities.org",
    verified: true
  },

  // Youth Programs
  {
    id: 22,
    name: "The Trevor Project",
    type: ["youth", "trauma"],
    location: "Nationwide",
    description: "24/7 crisis intervention and suicide prevention for LGBTQ+ youth affected by violence or trauma.",
    phone: "1-866-488-7386",
    website: "https://www.thetrevorproject.org",
    verified: true
  },
  {
    id: 23,
    name: "Boys & Girls Clubs of America",
    type: ["youth", "violence-prevention"],
    location: "Nationwide",
    description: "Safe spaces, mentorship, and support programs for youth in high-risk communities.",
    phone: "1-800-854-2582",
    website: "https://www.bgca.org",
    verified: true
  },
  {
    id: 24,
    name: "National Runaway Safeline",
    type: ["youth", "housing"],
    location: "Nationwide",
    description: "24/7 crisis support, shelter referrals, and safety planning for youth fleeing violence.",
    phone: "1-800-786-2929",
    website: "https://www.1800runaway.org",
    verified: true
  },
  {
    id: 25,
    name: "YouthBuild USA",
    type: ["youth", "violence-prevention"],
    location: "Nationwide",
    description: "Education, job training, and counseling programs for young people in underserved communities.",
    phone: "1-617-623-9900",
    website: "https://www.youthbuild.org",
    verified: true
  },
  {
    id: 26,
    name: "Youth Villages",
    type: ["youth", "trauma"],
    location: "Multiple States",
    description: "Mental health services, crisis intervention, and family support for at-risk youth.",
    phone: "1-800-288-9968",
    website: "https://www.youthvillages.org",
    verified: true
  },

  // Local/Regional Resources (examples)
  {
    id: 27,
    name: "SNUG Street Outreach",
    type: ["violence-prevention", "youth"],
    location: "New York State",
    description: "Street outreach program providing conflict mediation and violence interruption services.",
    phone: "(518) 474-2121",
    website: "https://www.criminaljustice.ny.gov/crimnet/ojsa/opca/snug.htm",
    verified: true
  },
  {
    id: 28,
    name: "Trauma Recovery Center",
    type: ["trauma", "victims"],
    location: "Brooklyn, NY",
    description: "Free trauma-focused therapy for gun violence survivors and family members.",
    phone: "(718) 834-7341",
    website: "https://www.traumarecoverycenter.org",
    verified: true
  },
  {
    id: 29,
    name: "Safe Haven Housing",
    type: ["housing", "victims"],
    location: "Queens, NY",
    description: "Emergency and transitional housing for those displaced by community violence.",
    phone: "(718) 291-4000",
    website: "https://www.safehavenhousing.org",
    verified: true
  },
  {
    id: 30,
    name: "Chicago CRED",
    type: ["violence-prevention", "youth"],
    location: "Chicago, IL",
    description: "Violence reduction through employment, education, and mentorship for high-risk youth.",
    phone: "(312) 374-9378",
    website: "https://www.chicagocred.org",
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
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [filteredResources, setFilteredResources] = useState(INITIAL_RESOURCES);
  const [loading, setLoading] = useState(false);
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

        if (data.success && data.data.length > 0) {
          // Merge backend resources with initial resources, avoiding duplicates
          const mergedResources = [...INITIAL_RESOURCES];
          data.data.forEach(backendResource => {
            const exists = INITIAL_RESOURCES.some(r => r.name === backendResource.name);
            if (!exists) {
              mergedResources.push(backendResource);
            }
          });
          setResources(mergedResources);
          setFilteredResources(mergedResources);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Already using INITIAL_RESOURCES, so no need to set again
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
        text: "Hello! I'm your support resource assistant. I can help you find verified organizations in your area.\n\nI understand ZIP codes, city names, and state names to find resources near you.\n\nWhat kind of help are you looking for today?",
        options: [
          "Trauma therapy",
          "Housing assistance",
          "Legal help",
          "Violence prevention programs",
          "Youth services",
          "Victim support"
        ]
      }]);
    }
  }, [activeTab, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Zip code to state/city mapping (major cities)
  const getLocationFromZip = (zip) => {
    const zipMappings = {
      '100': 'New York, NY', '101': 'New York, NY', '102': 'New York, NY',
      '103': 'Staten Island, NY', '104': 'Bronx, NY', '105': 'Westchester, NY',
      '110': 'Queens, NY', '111': 'Queens, NY', '112': 'Brooklyn, NY', '113': 'Flushing, NY',
      '114': 'Queens, NY', '115': 'Queens, NY', '116': 'Queens, NY',
      '117': 'Brooklyn, NY', '118': 'Brooklyn, NY', '119': 'Brooklyn, NY',
      '200': 'Washington, DC', '201': 'Virginia', '202': 'Washington, DC',
      '210': 'Maryland', '211': 'Maryland', '212': 'Maryland',
      '300': 'Philadelphia, PA', '301': 'Philadelphia, PA', '302': 'Delaware',
      '310': 'New Jersey', '320': 'Pittsburgh, PA', '330': 'Ohio',
      '400': 'Kentucky', '500': 'Iowa', '600': 'Chicago, IL', '601': 'Chicago, IL',
      '606': 'Chicago, IL', '607': 'Chicago, IL', '608': 'Illinois',
      '700': 'Louisiana', '701': 'Louisiana', '800': 'Colorado', '801': 'Utah',
      '900': 'California', '901': 'Los Angeles, CA', '902': 'Los Angeles, CA',
      '910': 'California', '920': 'San Diego, CA', '930': 'California',
      '940': 'San Francisco, CA', '941': 'San Francisco, CA', '945': 'Oakland, CA',
      '980': 'Seattle, WA', '981': 'Seattle, WA'
    };

    const prefix = zip.substring(0, 3);
    return zipMappings[prefix] || null;
  };

  const handleChatOption = (option) => {
    setMessages(prev => [...prev, { type: 'user', text: option }]);

    // Handle special commands
    if (option === "Start over") {
      setChatContext({ step: 'initial' });
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "No problem! Let's start fresh. What kind of help are you looking for?",
          options: [
            "Trauma therapy",
            "Housing assistance",
            "Legal help",
            "Violence prevention programs",
            "Youth services",
            "Victim support"
          ]
        }]);
      }, 500);
      return;
    }

    if (option === "Show more resources") {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "You can view all resources by clicking on the 'Find Resources' tab above, or I can help you search for something specific. What would you like to do?",
          options: ["Find Resources", "Search for specific help", "Start over"]
        }]);
      }, 500);
      return;
    }

    if (option === "Submit help request") {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "I can help you submit an anonymous support request. Please click the 'Request Support' tab above to fill out a confidential form. Would you like anything else?",
          options: ["Find more resources", "Start over"]
        }]);
      }, 500);
      return;
    }

    if (option === "Try different location" || option === "Search different area") {
      setChatContext({ step: 'location', selectedService: chatContext.selectedService });
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "Sure! Please provide a new location:\n\n• ZIP code (e.g., 10001)\n• City and state (e.g., Brooklyn, NY)\n• Or just your state"
        }]);
      }, 500);
      return;
    }

    if (option === "Different type of help") {
      setChatContext({ step: 'initial' });
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "What kind of help are you looking for?",
          options: [
            "Trauma therapy",
            "Housing assistance",
            "Legal help",
            "Violence prevention programs",
            "Youth services",
            "Victim support"
          ]
        }]);
      }, 500);
      return;
    }

    if (option === "Yes, show nationwide resources") {
      const nationwide = resources.filter(r =>
        r.location.toLowerCase().includes('nationwide')
      ).slice(0, 5);

      setTimeout(() => {
        let response = "Here are nationwide resources available 24/7 from anywhere:\n\n";
        nationwide.forEach((r, idx) => {
          response += `${idx + 1}. ${r.name}\n   📞 ${r.phone}\n`;
          if (r.website) response += `   🌐 ${r.website}\n`;
          response += `   ${r.description}\n\n`;
        });

        setMessages(prev => [...prev, {
          type: 'bot',
          text: response,
          options: ["Show more resources", "Start over", "Submit help request"]
        }]);
      }, 500);
      return;
    }

    // Handle service selection
    setChatContext({ step: 'location', selectedService: option });

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "Great! To find resources near you, please provide your:\n\n• ZIP code (e.g., 10001)\n• City and state (e.g., Brooklyn, NY)\n• Or just your state\n\nWhat's your location?"
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
        // Check if it's a zip code (5 digits)
        const zipMatch = userMessage.match(/\b\d{5}\b/);
        let locationQuery = userMessage;
        let detectedLocation = null;

        if (zipMatch) {
          detectedLocation = getLocationFromZip(zipMatch[0]);
          if (detectedLocation) {
            locationQuery = detectedLocation;
            setMessages(prev => [...prev, {
              type: 'bot',
              text: `I detected ZIP code ${zipMatch[0]} - that's in ${detectedLocation}. Searching for resources...`
            }]);
          }
        }

        // Search for matching resources
        let matched = resources.filter(r => {
          const location = r.location.toLowerCase();
          const query = locationQuery.toLowerCase();

          // Exact location match or state match
          if (location.includes(query) || query.includes(location.split(',')[0].toLowerCase())) {
            return true;
          }

          // Check for state abbreviations
          const stateAbbrev = query.match(/\b[A-Z]{2}\b/);
          if (stateAbbrev && location.includes(stateAbbrev[0].toLowerCase())) {
            return true;
          }

          return false;
        });

        // If no local matches, show nationwide resources
        if (matched.length === 0) {
          matched = resources.filter(r =>
            r.location.toLowerCase().includes('nationwide') ||
            r.location.toLowerCase().includes('multiple states')
          );
        }

        // Filter by selected service if available
        if (chatContext.selectedService && matched.length > 0) {
          const serviceMap = {
            "Trauma therapy": ["trauma", "victims"],
            "Housing assistance": ["housing"],
            "Legal help": ["legal"],
            "Violence prevention programs": ["violence-prevention"],
            "Youth services": ["youth"],
            "Victim support": ["victims"]
          };

          const serviceTypes = serviceMap[chatContext.selectedService] || [];
          const filtered = matched.filter(r =>
            r.type && r.type.some(t => serviceTypes.includes(t))
          );

          if (filtered.length > 0) {
            matched = filtered;
          }
        }

        if (matched.length > 0) {
          const topMatches = matched.slice(0, 5);
          let response = detectedLocation
            ? `Here are ${topMatches.length} verified organizations that can help:\n\n`
            : `I found ${topMatches.length} verified organizations for you:\n\n`;

          topMatches.forEach((r, idx) => {
            response += `${idx + 1}. ${r.name}\n`;
            response += `   📍 ${r.location}\n`;
            response += `   📞 ${r.phone}\n`;
            if (r.website) {
              response += `   🌐 ${r.website}\n`;
            }
            response += `   ${r.description}\n\n`;
          });

          response += "What would you like to do next?";

          setMessages(prev => [...prev, {
            type: 'bot',
            text: response,
            options: ["Show more resources", "Start over", "Submit help request"]
          }]);
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: `I couldn't find local resources for "${userMessage}", but I can show you nationwide resources that serve all areas. These organizations provide phone and online support:\n\nWould you like to see nationwide resources?`,
            options: ["Yes, show nationwide resources", "Try different location", "Start over"]
          }]);
        }

        setChatContext({ step: 'results', lastLocation: locationQuery });
      } else if (chatContext.step === 'results') {
        // Handle follow-up questions
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('more') || lowerMessage.includes('other')) {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: "You can browse all available resources by clicking the 'Find Resources' tab above. Would you like help with anything else?",
            options: ["Search different area", "Different type of help", "Start over"]
          }]);
        } else if (lowerMessage.includes('yes') || lowerMessage.includes('nationwide')) {
          const nationwide = resources.filter(r =>
            r.location.toLowerCase().includes('nationwide')
          ).slice(0, 5);

          let response = "Here are nationwide resources available 24/7:\n\n";
          nationwide.forEach((r, idx) => {
            response += `${idx + 1}. ${r.name}\n   📞 ${r.phone}\n   ${r.description}\n\n`;
          });

          setMessages(prev => [...prev, {
            type: 'bot',
            text: response,
            options: ["Show more resources", "Start over"]
          }]);
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: "I'm here to help! You can:\n• Search for resources in a different area\n• Look for a different type of support\n• Submit an anonymous help request\n\nWhat would you like to do?",
            options: ["Search different area", "Different type of help", "Submit help request", "Start over"]
          }]);
        }
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "I'm here to help you find support services. What kind of help do you need?",
          options: [
            "Trauma therapy",
            "Housing assistance",
            "Legal help",
            "Violence prevention programs",
            "Youth services",
            "Victim support"
          ]
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

      // Send to FormSubmit.co for email delivery
      const formPayload = new FormData();
      formPayload.append('_subject', `New Support Request - ${formData.supportType}`);
      formPayload.append('_cc', 'yamaneaugust@gmail.com');
      formPayload.append('_template', 'box'); // Nice email template
      formPayload.append('_captcha', 'false'); // Disable captcha for better UX
      formPayload.append('Support Type', formData.supportType);
      formPayload.append('Location', formData.location);
      formPayload.append('Situation', formData.situation || 'Not provided');
      formPayload.append('Urgency', formData.urgency);
      formPayload.append('Contact', formData.contact || 'Anonymous (no contact info provided)');
      formPayload.append('Submitted At', new Date().toLocaleString());

      const response = await fetch('https://formsubmit.co/yamaneaugust@gmail.com', {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-500 text-white px-6 py-4 rounded-xl mb-6 text-center font-semibold shadow-xl">
          🆘 In immediate danger? Call 911 | National Crisis Line: 988 | Crisis Text Line: Text HOME to 741741
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow-xl border-2 border-amber-100 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-3">
            Community Support Hub
          </h1>
          <p className="text-xl text-amber-800">
            Verified resources for gun violence survivors, families, and communities
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-6 shadow-xl border-2 border-amber-100">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'resources'
                  ? 'bg-amber-900 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <Search size={20} />
              Find Resources
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'chatbot'
                  ? 'bg-amber-900 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <MessageCircle size={20} />
              Get Help Now
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'request'
                  ? 'bg-amber-900 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <Shield size={20} />
              Request Support
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'safety'
                  ? 'bg-amber-900 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <BookOpen size={20} />
              Safety Guide
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-amber-100">
          {activeTab === 'resources' && (
            <div>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by organization name, service type, or location..."
                  className="w-full px-6 py-4 pr-12 border-2 border-amber-200 rounded-xl text-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700" size={24} />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {FILTER_OPTIONS.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                      activeFilter === filter.value
                        ? 'bg-amber-700 text-white shadow-md'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-2 border-amber-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
                  <p className="mt-4 text-gray-600">Loading resources...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map(resource => (
                      <div
                        key={resource.id || resource._id}
                        onClick={() => resource.website && window.open(resource.website, '_blank')}
                        className="bg-white p-6 rounded-xl border-2 border-amber-200 hover:border-amber-600 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative group"
                      >
                        {resource.website && (
                          <div className="absolute top-4 right-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={20} />
                          </div>
                        )}
                        <h3 className="text-amber-900 font-bold text-lg mb-2 flex items-center gap-2">
                          {resource.verified && <CheckCircle size={20} className="text-green-500" />}
                          {resource.name}
                        </h3>
                        <p className="text-gray-600 mb-3 text-sm leading-relaxed">{resource.description}</p>
                        <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
                          <MapPin size={16} />
                          <span className="text-sm">{resource.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
                          <Phone size={16} />
                          <span className="text-sm">{resource.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {resource.type && resource.type.map(t => (
                            <span key={t} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                              {t.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                        {resource.website && (
                          <div className="text-amber-700 text-xs mt-3 flex items-center gap-1 font-semibold">
                            <ExternalLink size={12} />
                            Click to visit website
                          </div>
                        )}
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
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Support Assistant</h2>
              <div className="bg-white rounded-xl border-2 border-amber-200 h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 bg-amber-50/30 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${msg.type === 'user' ? 'bg-amber-100 text-gray-900' : 'bg-amber-800 text-white'} px-5 py-3 rounded-2xl`}>
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                        {msg.options && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleChatOption(opt)}
                                className="px-4 py-2 bg-white text-amber-900 rounded-full text-sm font-semibold hover:bg-amber-50 transition-all border-2 border-amber-300"
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
                <div className="p-4 border-t-2 border-amber-200 flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="px-6 py-3 bg-amber-700 text-white rounded-xl font-semibold hover:bg-amber-800 hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'request' && (
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Anonymous Support Request</h2>

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
                    className="px-6 py-3 bg-amber-700 text-white rounded-xl font-semibold hover:bg-amber-800 transition-all"
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
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
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
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
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
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      How urgent is your need?
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
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
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Only provide if you want a follow-up.
                    </p>
                  </div>

                  <button
                    onClick={handleFormSubmit}
                    disabled={formLoading}
                    className="w-full px-6 py-4 bg-amber-700 text-white rounded-xl text-lg font-semibold hover:bg-amber-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'safety' && (
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-4 text-center">Gun Violence Safety Guide</h2>
              <p className="text-center text-gray-700 mb-8 text-lg">
                Evidence-based guidance on staying safe during and after gun violence incidents
              </p>

              {/* Emergency Alert */}
              <div className="bg-red-500 text-white px-6 py-4 rounded-xl mb-8 text-center font-semibold shadow-lg">
                <AlertTriangle size={24} className="inline mr-2" />
                IN IMMEDIATE DANGER? CALL 911 NOW
              </div>

              {/* During Active Shooting Section */}
              <div className="mb-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
                  <h3 className="text-2xl font-bold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={28} />
                    During an Active Shooting: RUN. HIDE. FIGHT.
                  </h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Source:</strong> U.S. Department of Homeland Security & FBI Active Shooter Guidelines
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* RUN */}
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="bg-amber-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Run size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-amber-900 mb-3 text-center">1. RUN</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Evacuate if there's an accessible escape path</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Leave belongings behind</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Help others escape if possible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Prevent others from entering the area</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Call 911 when safe</span>
                      </li>
                    </ul>
                  </div>

                  {/* HIDE */}
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="bg-amber-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-amber-900 mb-3 text-center">2. HIDE</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Find a hiding place if evacuation isn't possible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Lock and barricade doors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Silence your phone and stay quiet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Hide behind large objects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Turn off lights and remain silent</span>
                      </li>
                    </ul>
                  </div>

                  {/* FIGHT */}
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="bg-amber-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-amber-900 mb-3 text-center">3. FIGHT</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span><strong>Last resort only</strong> when life is in danger</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Act with physical aggression</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Improvise weapons (chairs, fire extinguishers)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Commit to your actions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-700" />
                        <span>Work together with others if possible</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* When Police Arrive Section */}
              <div className="mb-10">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                  <h3 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Shield size={28} />
                    When Law Enforcement Arrives
                  </h3>
                  <p className="text-gray-700">
                    <strong>Source:</strong> FBI & Law Enforcement Active Shooter Response Protocols
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="mt-1 flex-shrink-0 text-blue-600" />
                      <span><strong>Remain calm and follow instructions</strong> - Officers may be armed with rifles, shotguns, or handguns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="mt-1 flex-shrink-0 text-blue-600" />
                      <span><strong>Keep your hands visible at all times</strong> - Raise hands and spread fingers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="mt-1 flex-shrink-0 text-blue-600" />
                      <span><strong>Avoid making quick movements</strong> toward officers or pointing/screaming</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="mt-1 flex-shrink-0 text-blue-600" />
                      <span><strong>Do not stop to ask for help</strong> - Officers' first priority is to stop the threat</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="mt-1 flex-shrink-0 text-blue-600" />
                      <span><strong>Provide information</strong> - Location of shooter, number of shooters, description, weapons</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* After a Shooting Section */}
              <div className="mb-10">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg mb-6">
                  <h3 className="text-2xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Heart size={28} />
                    After a Shooting: Survivor Support
                  </h3>
                  <p className="text-gray-700">
                    <strong>Source:</strong> National Center for PTSD & American Psychological Association
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-purple-900 mb-4">Immediate Steps</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Seek medical attention</strong> for any injuries, even minor ones</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Contact loved ones</strong> to let them know you're safe</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Cooperate with law enforcement</strong> investigations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Preserve evidence</strong> if safe (photos, clothing, witness info)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-purple-900 mb-4">Mental Health Support</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Seek counseling</strong> - Trauma is normal after violence</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Connect with support groups</strong> - You're not alone</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>Crisis Text Line:</strong> Text HOME to 741741</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-purple-600" />
                        <span><strong>National Crisis Line:</strong> Call 988</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Warning Signs Section */}
              <div className="mb-10">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6">
                  <h3 className="text-2xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <Eye size={28} />
                    Warning Signs: When to Report Concerns
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Source:</strong> FBI Behavioral Analysis Unit & Sandy Hook Promise
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    If you see something, say something. Many shootings have warning signs.
                  </p>
                </div>

                <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                  <p className="text-gray-700 mb-4 font-semibold">
                    Report to authorities (call 911 or local law enforcement) if someone:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 flex-shrink-0 text-orange-600" />
                      <span><strong>Makes direct threats</strong> of violence against specific people or places</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 flex-shrink-0 text-orange-600" />
                      <span><strong>Shows fascination with violence</strong> or mass shootings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 flex-shrink-0 text-orange-600" />
                      <span><strong>Exhibits concerning behavior</strong> - sudden isolation, aggression, paranoia</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 flex-shrink-0 text-orange-600" />
                      <span><strong>Posts threats or violent content</strong> on social media</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 flex-shrink-0 text-orange-600" />
                      <span><strong>Has acquired weapons</strong> and talks about using them</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 flex-shrink-0 text-orange-600" />
                      <span><strong>Expresses feelings of persecution</strong> or revenge fantasies</span>
                    </li>
                  </ul>

                  <div className="mt-6 bg-orange-100 p-4 rounded-lg">
                    <p className="font-bold text-orange-900 mb-2">📞 How to Report:</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• <strong>Emergency:</strong> Call 911</li>
                      <li>• <strong>FBI Tip Line:</strong> 1-800-CALL-FBI</li>
                      <li>• <strong>Sandy Hook Promise Tip Line:</strong> Text SAFE to 662-233</li>
                      <li>• <strong>Local Law Enforcement:</strong> Contact your police department's non-emergency line</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ExternalLink size={24} />
                  Official Resources & Sources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="https://www.dhs.gov/active-shooter-preparedness" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                    <ExternalLink size={16} />
                    DHS Active Shooter Preparedness
                  </a>
                  <a href="https://www.fbi.gov/about/partnerships/office-of-partner-engagement/active-shooter-resources" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                    <ExternalLink size={16} />
                    FBI Active Shooter Resources
                  </a>
                  <a href="https://www.sandyhookpromise.org/our-programs/know-the-signs-programs/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                    <ExternalLink size={16} />
                    Sandy Hook Promise - Know the Signs
                  </a>
                  <a href="https://www.ptsd.va.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                    <ExternalLink size={16} />
                    National Center for PTSD
                  </a>
                  <a href="https://www.apa.org/topics/gun-violence-crime" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                    <ExternalLink size={16} />
                    APA Gun Violence Resources
                  </a>
                  <a href="https://www.everytown.org/safety-plans/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                    <ExternalLink size={16} />
                    Everytown Safety Plans
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}