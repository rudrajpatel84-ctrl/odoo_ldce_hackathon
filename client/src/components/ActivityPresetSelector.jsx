import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Plus,
  Check,
  Search,
  Compass,
  Clock,
  DollarSign,
  MapPin,
  Flame,
  Globe2
} from 'lucide-react';
import { CATEGORY_CONFIG } from './ActivityCard';

export const CURATED_PRESETS_BY_CITY = {
  'Ahmedabad': [
    {
      title: 'Sabarmati Ashram & Riverfront Peace Walk',
      category: 'Culture',
      cost: 200,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Historic headquarters of Mahatma Gandhi overlooking the Sabarmati River.'
    },
    {
      title: 'Adalaj Stepwell Architectural Marvel',
      category: 'Sightseeing',
      cost: 300,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: '5-storey deep 15th-century subterranean Solanki-style carved stepwell.'
    },
    {
      title: 'Old City Heritage Walk & Pols',
      category: 'Culture',
      cost: 500,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: 'Guided walk through historic wooden-carved Pol neighborhoods and havelis.'
    },
    {
      title: 'Manek Chowk Night Food Market Tour',
      category: 'Food & Dining',
      cost: 800,
      durationHours: 2.5,
      timeSlot: 'Night',
      locationNotes: 'Bustling night food hub for chocolate cheese sandwiches, Gwalior dosa, and Ashrafi kulfi.'
    },
    {
      title: 'Sabarmati Riverfront Promenade Cycling',
      category: 'Adventure',
      cost: 350,
      durationHours: 1.5,
      timeSlot: 'Evening',
      locationNotes: 'Dedicated waterfront promenade with sunset skyline views and rental bikes.'
    }
  ],
  'Daman': [
    {
      title: 'Moti Daman & St. Jerome Fort Exploration',
      category: 'Sightseeing',
      cost: 150,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: '16th-century Portuguese fortress walls with colonial cannons facing the Arabian Sea.'
    },
    {
      title: 'Jampore Beach Parasailing & Water Sports',
      category: 'Adventure',
      cost: 1800,
      durationHours: 3.5,
      timeSlot: 'Afternoon',
      locationNotes: 'Tranquil black-sand beach with jet-skiing, ATV riding, and parasailing.'
    },
    {
      title: 'Devka Beach Sunset & Seaside Seafood Feast',
      category: 'Food & Dining',
      cost: 1600,
      durationHours: 2.5,
      timeSlot: 'Evening',
      locationNotes: 'Coastal seafood shacks serving fresh pomfret fry and prawn curry by the sea.'
    },
    {
      title: 'Church of Bom Jesus & Baroque Chapels',
      category: 'Culture',
      cost: 100,
      durationHours: 1.5,
      timeSlot: 'Morning',
      locationNotes: 'Exquisite Portuguese gilded altars and Rosewood carvings.'
    }
  ],
  'Surat': [
    {
      title: 'Surat Castle (Old Fort) by Tapi River',
      category: 'Sightseeing',
      cost: 200,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: '16th-century defense fortress built against Portuguese marauders.'
    },
    {
      title: 'Chowk Bazaar Surati Locho & Food Tasting',
      category: 'Food & Dining',
      cost: 650,
      durationHours: 2.5,
      timeSlot: 'Evening',
      locationNotes: 'Savor piping hot Surati Locho, Sev Khamani, and cold coco shakes.'
    },
    {
      title: 'Dumas Beach Black Sand Sunset Walk',
      category: 'Relaxation',
      cost: 100,
      durationHours: 2,
      timeSlot: 'Evening',
      locationNotes: 'Mystical black-sand beach famous for spicy bhajiya and sea breeze.'
    }
  ],
  'Tokyo': [
    {
      title: 'Fushimi Inari Torii Sunrise Walk',
      category: 'Sightseeing',
      cost: 0,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Early morning hike to beat the crowds before 7:00 AM.'
    },
    {
      title: 'Tsukiji Outer Market Gourmet Food Tour',
      category: 'Food & Dining',
      cost: 75,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Sample authentic bluefin sashimi, tamagoyaki, and matcha gelato.'
    },
    {
      title: 'teamLab Planets Immersive Digital Art',
      category: 'Culture',
      cost: 42,
      durationHours: 2,
      timeSlot: 'Afternoon',
      locationNotes: 'Toyosu water and light exhibit. Rolled up pants required.'
    },
    {
      title: 'Shibuya Crossing & Sky Rooftop Observatory',
      category: 'Sightseeing',
      cost: 25,
      durationHours: 1.5,
      timeSlot: 'Evening',
      locationNotes: 'Sunset view over Mount Fuji and the busiest intersection on earth.'
    },
    {
      title: 'Shinjuku Omoide Yokocho Yakitori Alleys',
      category: 'Food & Dining',
      cost: 60,
      durationHours: 2.5,
      timeSlot: 'Night',
      locationNotes: 'Atmospheric lantern-lit alleyways with artisan grilled skewers.'
    },
    {
      title: 'Akihabara VR & Retro Arcade Experience',
      category: 'Adventure',
      cost: 45,
      durationHours: 2,
      timeSlot: 'Afternoon',
      locationNotes: 'Classic 80s/90s gaming relics and modern VR simulator booths.'
    },
    {
      title: 'Shinjuku Gyoen National Garden Zen Walk',
      category: 'Relaxation',
      cost: 10,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: 'Serene Japanese traditional landscaped garden with ponds and tea houses.'
    }
  ],
  'Kyoto': [
    {
      title: 'Fushimi Inari Torii Gates Sunrise Hike',
      category: 'Sightseeing',
      cost: 0,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: 'Hike through 10,000 vibrant vermilion gates up Mount Inari.'
    },
    {
      title: 'Traditional Matcha Tea Ceremony in Gion',
      category: 'Culture',
      cost: 65,
      durationHours: 1.5,
      timeSlot: 'Afternoon',
      locationNotes: 'Learn ancient Zen tea preparation from a certified tea master.'
    },
    {
      title: 'Arashiyama Bamboo Grove & Monkey Park Hike',
      category: 'Relaxation',
      cost: 30,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: 'Towering green bamboo stalks and panoramic hilltop viewpoint.'
    },
    {
      title: 'Multi-Course Kaiseki Dinner at Gion Karyo',
      category: 'Food & Dining',
      cost: 180,
      durationHours: 2.5,
      timeSlot: 'Evening',
      locationNotes: 'Seasonal Michelin-grade tasting dishes with pairing sake.'
    },
    {
      title: 'Kinkaku-ji (Golden Pavilion) Reflection Visit',
      category: 'Culture',
      cost: 15,
      durationHours: 1.5,
      timeSlot: 'Morning',
      locationNotes: 'Zen Buddhist temple with two top floors covered in pure gold leaf.'
    }
  ],
  'Osaka': [
    {
      title: 'Dotonbori Street Food Discovery Tour',
      category: 'Food & Dining',
      cost: 65,
      durationHours: 2.5,
      timeSlot: 'Evening',
      locationNotes: 'Taste piping hot takoyaki, savory okonomiyaki, and kushikatsu by the canal.'
    },
    {
      title: 'Osaka Castle & Park Gardens Walk',
      category: 'Sightseeing',
      cost: 20,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: 'Historic samurai stone walls, moats, and top-floor observation deck.'
    },
    {
      title: 'Spa World Natural Onsen & Relaxation Baths',
      category: 'Relaxation',
      cost: 35,
      durationHours: 3,
      timeSlot: 'Afternoon',
      locationNotes: 'Geothermal hot spring mineral pools in Shinsekai district.'
    },
    {
      title: 'Universal Studios Japan Super Nintendo World',
      category: 'Adventure',
      cost: 95,
      durationHours: 6,
      timeSlot: 'Morning',
      locationNotes: 'Interactive Mario Kart ride, Bowser castle, and power-up bands.'
    }
  ],
  'Rome': [
    {
      title: 'Colosseum & Roman Forum VIP Floor Access',
      category: 'Sightseeing',
      cost: 110,
      durationHours: 3.5,
      timeSlot: 'Morning',
      locationNotes: 'Gladiator arena floor entrance and ancient imperial palace ruins.'
    },
    {
      title: 'Trastevere Handmade Pasta & Chianti Masterclass',
      category: 'Food & Dining',
      cost: 95,
      durationHours: 3,
      timeSlot: 'Evening',
      locationNotes: 'Hand-rolling fettuccine and cacio e pepe from scratch with chef.'
    },
    {
      title: 'Vatican Museums & Sistine Chapel Early Entry',
      category: 'Culture',
      cost: 85,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: 'Michelangelo ceiling frescoes before standard public admission.'
    },
    {
      title: 'Villa Borghese Sunset Electric Bike Tour',
      category: 'Adventure',
      cost: 45,
      durationHours: 2,
      timeSlot: 'Afternoon',
      locationNotes: 'Pincio Terrace panoramic view over St. Peter Basilica dome.'
    },
    {
      title: 'Trevi Fountain & Spanish Steps Gelato Stroll',
      category: 'Relaxation',
      cost: 15,
      durationHours: 1.5,
      timeSlot: 'Night',
      locationNotes: 'Coin toss tradition and artisanal pistachio & hazelnut gelato.'
    }
  ],
  'Florence': [
    {
      title: 'Uffizi Gallery Masterpieces Guided Tour',
      category: 'Culture',
      cost: 75,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Direct entry to Botticelli, Leonardo da Vinci, and Caravaggio rooms.'
    },
    {
      title: 'Brunelleschi Duomo Dome 463-Step Climb',
      category: 'Sightseeing',
      cost: 40,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: 'Panoramic view over Florence red-tiled terracotta rooftops.'
    },
    {
      title: 'Chianti Vineyard Sunset Wine Tasting & Dinner',
      category: 'Food & Dining',
      cost: 130,
      durationHours: 4.5,
      timeSlot: 'Evening',
      locationNotes: 'Tuscan hills estate with cellar tour, olive oil, and sangiovese wines.'
    },
    {
      title: 'Boboli Gardens Renaissance Sculpture Walk',
      category: 'Relaxation',
      cost: 25,
      durationHours: 2,
      timeSlot: 'Afternoon',
      locationNotes: 'Medici family grand gardens with grottoes and cypress avenues.'
    }
  ],
  'Paris': [
    {
      title: 'Eiffel Tower Summit Access & Champagne Toast',
      category: 'Sightseeing',
      cost: 70,
      durationHours: 2,
      timeSlot: 'Evening',
      locationNotes: 'Top observation floor 276 meters above the Champ de Mars.'
    },
    {
      title: 'Louvre Museum Mona Lisa & Antiquities Tour',
      category: 'Culture',
      cost: 65,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: 'Guided skip-the-line highlights in the world largest art palace.'
    },
    {
      title: 'Montmartre Artists Square & Sacré-Cœur Stroll',
      category: 'Culture',
      cost: 20,
      durationHours: 2.5,
      timeSlot: 'Afternoon',
      locationNotes: 'Bohemian cafes, portrait painters, and hillside view over Paris.'
    },
    {
      title: 'Seine River Gourmet Sunset Dinner Cruise',
      category: 'Food & Dining',
      cost: 120,
      durationHours: 2.5,
      timeSlot: 'Evening',
      locationNotes: 'Glass canopy boat with 3-course French dinner and illuminated bridges.'
    },
    {
      title: 'Luxembourg Gardens Afternoon Reading & Coffee',
      category: 'Relaxation',
      cost: 12,
      durationHours: 1.5,
      timeSlot: 'Afternoon',
      locationNotes: 'Historic green park chairs near the Medici Fountain.'
    }
  ],
  'New York': [
    {
      title: 'Summit One Vanderbilt Skyline Glass Experience',
      category: 'Sightseeing',
      cost: 52,
      durationHours: 2,
      timeSlot: 'Afternoon',
      locationNotes: 'Reflective mirror rooms and levitation glass skyboxes at Grand Central.'
    },
    {
      title: 'Chelsea Market & High Line Gastronomy Tour',
      category: 'Food & Dining',
      cost: 75,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Artisan tacos, lobster rolls, and elevated park stroll to Hudson Yards.'
    },
    {
      title: 'Central Park Bicycle Safari & Strawberry Fields',
      category: 'Adventure',
      cost: 35,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: 'Explore Bethesda Terrace, Bow Bridge, and Ramble pathways.'
    },
    {
      title: 'Broadway Musical Evening Performance',
      category: 'Culture',
      cost: 140,
      durationHours: 3,
      timeSlot: 'Evening',
      locationNotes: 'World-class theater production in Times Square.'
    }
  ],
  'Barcelona': [
    {
      title: 'Sagrada Família Towers Architecture Guided Tour',
      category: 'Culture',
      cost: 55,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Gaudí masterwork with Nativity facade and stained glass light.'
    },
    {
      title: 'Park Güell Mosaic Serpent Bench Sunrise',
      category: 'Sightseeing',
      cost: 20,
      durationHours: 2,
      timeSlot: 'Morning',
      locationNotes: 'Monumental zone panoramic viewpoint overlooking the Mediterranean.'
    },
    {
      title: 'Gothic Quarter Tapas & Sangria Crawl',
      category: 'Food & Dining',
      cost: 70,
      durationHours: 3,
      timeSlot: 'Evening',
      locationNotes: 'Historic taverns tasting Jamón Ibérico, patatas bravas, and Rioja wines.'
    },
    {
      title: 'Barceloneta Beach Sunset Paddleboarding',
      category: 'Adventure',
      cost: 40,
      durationHours: 2,
      timeSlot: 'Evening',
      locationNotes: 'Calm evening waters along the city coast with paddle instructor.'
    }
  ],
  'Global': [
    {
      title: 'Historic Old Town Heritage Walking Tour',
      category: 'Sightseeing',
      cost: 25,
      durationHours: 2.5,
      timeSlot: 'Morning',
      locationNotes: 'Discover city landmarks, hidden courtyards, and local folklore.'
    },
    {
      title: 'Local Farm-to-Table Gastronomy & Wine Tasting',
      category: 'Food & Dining',
      cost: 85,
      durationHours: 3,
      timeSlot: 'Evening',
      locationNotes: 'Authentic regional ingredients and wine pairing with local hosts.'
    },
    {
      title: 'National Museum & Royal Art Gallery Tour',
      category: 'Culture',
      cost: 35,
      durationHours: 2.5,
      timeSlot: 'Afternoon',
      locationNotes: 'Treasures, archaeological artifacts, and historic paintings.'
    },
    {
      title: 'Scenic Mountain Viewpoint Panorama Hike',
      category: 'Adventure',
      cost: 15,
      durationHours: 3,
      timeSlot: 'Morning',
      locationNotes: 'Panoramic scenic overlook overlooking valleys and coastline.'
    },
    {
      title: 'Thermal Wellness Spa & Massage Sanctuary',
      category: 'Relaxation',
      cost: 75,
      durationHours: 2.5,
      timeSlot: 'Afternoon',
      locationNotes: 'Revitalizing sauna, hydrotherapy baths, and herbal tea lounge.'
    }
  ]
};

export function ActivityPresetSelector({
  isOpen,
  onClose,
  cityName = 'Tokyo',
  currency = 'USD',
  onAddActivity,
  onAddMultipleActivities
}) {
  const [selectedCity, setSelectedCity] = useState(cityName || 'Tokyo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedIds, setAddedIds] = useState({});

  if (!isOpen) return null;

  const availableCities = Object.keys(CURATED_PRESETS_BY_CITY);
  
  // Find matching city key or fallback
  const normalizedCity = availableCities.find(
    c => c.toLowerCase() === selectedCity.toLowerCase()
  ) || 'Tokyo';

  const rawPresets = CURATED_PRESETS_BY_CITY[normalizedCity] || CURATED_PRESETS_BY_CITY['Global'];

  const filteredPresets = rawPresets.filter(preset => {
    const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.locationNotes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSingle = (preset, idx) => {
    const presetKey = `${normalizedCity}-${idx}-${preset.title}`;
    setAddedIds(prev => ({ ...prev, [presetKey]: true }));
    onAddActivity({
      title: preset.title,
      category: preset.category,
      cost: preset.cost,
      durationHours: preset.durationHours,
      timeSlot: preset.timeSlot,
      isBooked: false,
      locationNotes: preset.locationNotes
    });
  };

  const handleAddAll = () => {
    if (filteredPresets.length === 0) return;
    if (onAddMultipleActivities) {
      onAddMultipleActivities(filteredPresets.map(p => ({ ...p, isBooked: false })));
    } else {
      filteredPresets.forEach(p => onAddActivity({ ...p, isBooked: false }));
    }
    onClose();
  };

  const categories = ['All', 'Sightseeing', 'Food & Dining', 'Culture', 'Adventure', 'Relaxation'];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '95%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 56, 0.95))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                1-Click Curated Experiences
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Instant popular activities and guided adventures for <strong>{selectedCity}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* City Filter Pills */}
        <div
          style={{
            padding: '0.85rem 1.5rem 0.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe2 size={13} /> Destination:
          </span>
          {availableCities.map(city => {
            const isCurrent = normalizedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: isCurrent ? 'linear-gradient(135deg, #38bdf8, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
                  border: isCurrent ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isCurrent ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div style={{ padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={`Search experiences in ${selectedCity}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#38bdf8' : 'var(--text-muted)'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets List */}
        <div
          className="modal-body custom-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.5rem 1.5rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {filteredPresets.length > 0 ? (
            filteredPresets.map((preset, idx) => {
              const presetKey = `${normalizedCity}-${idx}-${preset.title}`;
              const isAdded = Boolean(addedIds[presetKey]);
              const catMeta = CATEGORY_CONFIG[preset.category] || {
                color: '#38bdf8',
                bg: 'rgba(56, 189, 248, 0.12)',
                border: 'rgba(56, 189, 248, 0.3)'
              };

              return (
                <div
                  key={idx}
                  className="glass-card animate-fade-in"
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: isAdded ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-full)',
                          background: catMeta.bg,
                          border: `1px solid ${catMeta.border}`,
                          color: catMeta.color
                        }}
                      >
                        {preset.category}
                      </span>

                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {preset.durationHours}h • {preset.timeSlot}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 600, margin: '0 0 3px 0' }}>
                      {preset.title}
                    </h4>

                    {preset.locationNotes && (
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                        {preset.locationNotes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: preset.cost > 0 ? '#38bdf8' : '#34d399'
                      }}
                    >
                      {preset.cost > 0 ? `$${preset.cost}` : 'Free'}
                    </span>

                    <button
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddSingle(preset, idx)}
                      className={`btn btn-sm ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '6px'
                      }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={12} color="#10b981" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus size={12} />
                          <span>Add 1-Click</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.85rem' }}>No curated experiences found matching your query.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="modal-footer"
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredPresets.length}</strong> curated activities
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
              Done
            </button>
            {filteredPresets.length > 0 && (
              <button
                type="button"
                onClick={handleAddAll}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Flame size={14} />
                <span>Add All Recommended ({filteredPresets.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
