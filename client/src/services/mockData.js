export const INITIAL_TRIPS = [
  {
    id: "trip-japan-2026",
    userId: "user-demo-1",
    title: "Japan Golden Route: Cherry Blossom Voyage",
    description: "A 10-day immersive adventure through neon metropolises, historic shrines, culinary hotspots, and serene bamboo forests in Tokyo, Kyoto, and Osaka.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-04-02",
    endDate: "2026-04-12",
    totalBudget: 4500,
    currency: "USD",
    isPublic: true,
    shareToken: "gt-share-japan-sakura-8821",
    createdAt: "2026-01-15T10:00:00Z",
    stops: [
      {
        id: "stop-tokyo",
        tripId: "trip-japan-2026",
        cityName: "Tokyo",
        country: "Japan",
        arrivalDate: "2026-04-02",
        departureDate: "2026-04-06",
        orderIndex: 0,
        budgetAllocation: 1800,
        notes: "Staying in Shinjuku. JR Rail Pass activated at Haneda Airport. Fast-paced metropolis leg.",
        activities: [
          {
            id: "act-t1",
            title: "Tsukiji Outer Market Gourmet Seafood Tour",
            category: "Food & Dining",
            cost: 85,
            durationHours: 2.5,
            timeSlot: "Morning",
            isBooked: true,
            locationNotes: "Meeting at Tsukiji Station Exit 1. Sample fresh sashimi, tamagoyaki, and A5 wagyu skewers."
          },
          {
            id: "act-t2",
            title: "teamLab Planets Immersive Digital Art",
            category: "Culture",
            cost: 42,
            durationHours: 2,
            timeSlot: "Afternoon",
            isBooked: true,
            locationNotes: "Toyosu district. Barefoot water exhibit, bring shorts or rollable pants."
          },
          {
            id: "act-t3",
            title: "Shibuya Sky Sunset Observation Deck & Crossing",
            category: "Sightseeing",
            cost: 25,
            durationHours: 1.5,
            timeSlot: "Evening",
            isBooked: false,
            locationNotes: "Rooftop deck 229m above Shibuya Crossing. Book timed sunset slot at 17:30."
          },
          {
            id: "act-t4",
            title: "Omoide Yokocho & Golden Gai Izakaya Walk",
            category: "Food & Dining",
            cost: 70,
            durationHours: 3,
            timeSlot: "Night",
            isBooked: false,
            locationNotes: "Shinjuku alleys. Cash-only micro bars with authentic yakitori and local sake."
          },
          {
            id: "act-t5",
            title: "Akihabara VR & Retro Arcade Experience",
            category: "Adventure",
            cost: 50,
            durationHours: 2,
            timeSlot: "Afternoon",
            isBooked: false,
            locationNotes: "Radio Kaikan and Super Potato arcade gaming floors."
          }
        ]
      },
      {
        id: "stop-kyoto",
        tripId: "trip-japan-2026",
        cityName: "Kyoto",
        country: "Japan",
        arrivalDate: "2026-04-06",
        departureDate: "2026-04-09",
        orderIndex: 1,
        budgetAllocation: 1500,
        notes: "Traditional Ryokan experience in Gion district. Cultural heart of Japan.",
        activities: [
          {
            id: "act-k1",
            title: "Fushimi Inari Torii Gates Sunrise Hike",
            category: "Sightseeing",
            cost: 0,
            durationHours: 2.5,
            timeSlot: "Morning",
            isBooked: true,
            locationNotes: "Start before 06:30 AM to hike the 10,000 vermilion torii gates without tourist crowds."
          },
          {
            id: "act-k2",
            title: "Traditional Match Tea Ceremony in Gion",
            category: "Culture",
            cost: 65,
            durationHours: 1.5,
            timeSlot: "Afternoon",
            isBooked: true,
            locationNotes: "Historic teahouse near Yasaka Shrine. Kimono rental optional."
          },
          {
            id: "act-k3",
            title: "Arashiyama Bamboo Grove & Tenryu-ji Temple",
            category: "Relaxation",
            cost: 30,
            durationHours: 3,
            timeSlot: "Morning",
            isBooked: false,
            locationNotes: "Rent bicycles at Saga-Arashiyama Station to explore the river and grove."
          },
          {
            id: "act-k4",
            title: "Multi-course Kaiseki Dinner at Gion Karyo",
            category: "Food & Dining",
            cost: 180,
            durationHours: 2.5,
            timeSlot: "Evening",
            isBooked: true,
            locationNotes: "Seasonal Michelin-grade tasting menu. Reservation confirmed for 19:00."
          }
        ]
      },
      {
        id: "stop-osaka",
        tripId: "trip-japan-2026",
        cityName: "Osaka",
        country: "Japan",
        arrivalDate: "2026-04-09",
        departureDate: "2026-04-12",
        orderIndex: 2,
        budgetAllocation: 1200,
        notes: "Gastronomy and nightlife capital. Tennoji & Dotonbori base.",
        activities: [
          {
            id: "act-o1",
            title: "Dotonbori Street Food Discovery Tour",
            category: "Food & Dining",
            cost: 65,
            durationHours: 2.5,
            timeSlot: "Evening",
            isBooked: true,
            locationNotes: "Taste freshly made takoyaki, okonomiyaki, and kushikatsu by the canal."
          },
          {
            id: "act-o2",
            title: "Osaka Castle Park & Keep Observation Walk",
            category: "Sightseeing",
            cost: 20,
            durationHours: 2,
            timeSlot: "Morning",
            isBooked: false,
            locationNotes: "Main tower 8th-floor panoramic view of Osaka skyline."
          },
          {
            id: "act-o3",
            title: "Spa World Natural Onsen & Relaxation Baths",
            category: "Relaxation",
            cost: 35,
            durationHours: 3,
            timeSlot: "Afternoon",
            isBooked: false,
            locationNotes: "Shinsekai district. European and Asian-themed hot springs."
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-1", tripId: "trip-japan-2026", title: "Hotel Gracery Shinjuku", category: "Stay", amount: 650, date: "2026-04-02", paidBy: "Demo User" },
      { id: "exp-2", tripId: "trip-japan-2026", title: "Shinjuku Yakitori Dinner", category: "Food", amount: 85, date: "2026-04-02", paidBy: "Demo User" },
      { id: "exp-3", tripId: "trip-japan-2026", title: "Suica IC Card Top-up", category: "Transport", amount: 50, date: "2026-04-03", paidBy: "Demo User" }
    ]
  },
  {
    id: "trip-italy-2026",
    userId: "user-demo-1",
    title: "Italian Renaissance & Tuscan Romance",
    description: "From ancient Roman monuments and Trastevere culinary workshop to the Uffizi Gallery masterpieces in Florence.",
    coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-06-10",
    endDate: "2026-06-18",
    totalBudget: 4200,
    currency: "EUR",
    isPublic: true,
    shareToken: "gt-share-italy-coast-3391",
    createdAt: "2026-01-20T14:30:00Z",
    stops: [
      {
        id: "stop-rome",
        tripId: "trip-italy-2026",
        cityName: "Rome",
        country: "Italy",
        arrivalDate: "2026-06-10",
        departureDate: "2026-06-14",
        orderIndex: 0,
        budgetAllocation: 2200,
        notes: "Trastevere boutique apartment rental. Historic center excursions.",
        activities: [
          {
            id: "act-r1",
            title: "Colosseum & Roman Forum VIP Arena Floor Access",
            category: "Sightseeing",
            cost: 110,
            durationHours: 3.5,
            timeSlot: "Morning",
            isBooked: true,
            locationNotes: "Skip-the-line gladiator gate entrance. Bring ID and water bottle."
          },
          {
            id: "act-r2",
            title: "Trastevere Handmade Pasta & Chianti Masterclass",
            category: "Food & Dining",
            cost: 95,
            durationHours: 3,
            timeSlot: "Evening",
            isBooked: true,
            locationNotes: "Cooking school on Via della Lungaretta. Hand-rolling tagliatelle and cacio e pepe."
          },
          {
            id: "act-r3",
            title: "Vatican Museums & Sistine Chapel Early Entry",
            category: "Culture",
            cost: 85,
            durationHours: 3,
            timeSlot: "Morning",
            isBooked: false,
            locationNotes: "Strict dress code: shoulders and knees covered."
          },
          {
            id: "act-r4",
            title: "Villa Borghese Sunset Electric Bike Tour",
            category: "Adventure",
            cost: 45,
            durationHours: 2,
            timeSlot: "Afternoon",
            isBooked: false,
            locationNotes: "Piazza del Popolo meeting point. Ride through the gardens to Pincio Terrace."
          }
        ]
      },
      {
        id: "stop-florence",
        tripId: "trip-italy-2026",
        cityName: "Florence",
        country: "Italy",
        arrivalDate: "2026-06-14",
        departureDate: "2026-06-18",
        orderIndex: 1,
        budgetAllocation: 2000,
        notes: "Art capital of the world. Day excursion planned for Chianti wine country.",
        activities: [
          {
            id: "act-f1",
            title: "Uffizi Gallery Masterpieces Guided Tour",
            category: "Culture",
            cost: 75,
            durationHours: 2.5,
            timeSlot: "Morning",
            isBooked: true,
            locationNotes: "Direct entry to see Botticelli's Birth of Venus and Da Vinci rooms."
          },
          {
            id: "act-f2",
            title: "Duomo Dome Brunelleschi Climb & Bell Tower",
            category: "Sightseeing",
            cost: 40,
            durationHours: 2,
            timeSlot: "Afternoon",
            isBooked: false,
            locationNotes: "463 steps to the cupola summit. Incredible panorama over Tuscany."
          },
          {
            id: "act-f3",
            title: "Chianti Hills Vineyard Sunset Wine Tasting & Dinner",
            category: "Food & Dining",
            cost: 130,
            durationHours: 4.5,
            timeSlot: "Evening",
            isBooked: true,
            locationNotes: "Roundtrip shuttle from Santa Maria Novella station. 4 wine pairings."
          },
          {
            id: "act-f4",
            title: "Boboli Gardens & Pitti Palace Stroll",
            category: "Relaxation",
            cost: 25,
            durationHours: 2,
            timeSlot: "Afternoon",
            isBooked: false,
            locationNotes: "Renaissance sculpture park with shade trees and fountain views."
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-i1", tripId: "trip-italy-2026", title: "Rome Airbnb Deposit", category: "Stay", amount: 780, date: "2026-05-01", paidBy: "Demo User" }
    ]
  }
];

export const TEMPLATE_TRIPS = [
  {
    title: "Tokyo to Osaka Food & Shrine Expedition",
    description: "Classic 7-day transit between Tokyo neon, Kyoto zen temples, and Osaka street food.",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    totalBudget: 3200,
    currency: "USD",
    durationDays: 7,
    stops: [
      { cityName: "Tokyo", country: "Japan", days: 3, budgetAllocation: 1400 },
      { cityName: "Kyoto", country: "Japan", days: 2, budgetAllocation: 1000 },
      { cityName: "Osaka", country: "Japan", days: 2, budgetAllocation: 800 }
    ]
  },
  {
    title: "Amalfi Coast & Southern Italy Summer",
    description: "Coastal bliss along Positano, Capri boat cruise, and ancient Pompeii explorations.",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    totalBudget: 4500,
    currency: "EUR",
    durationDays: 8,
    stops: [
      { cityName: "Naples", country: "Italy", days: 2, budgetAllocation: 900 },
      { cityName: "Sorrento & Amalfi", country: "Italy", days: 4, budgetAllocation: 2400 },
      { cityName: "Capri", country: "Italy", days: 2, budgetAllocation: 1200 }
    ]
  },
  {
    title: "Iceland Ring Road & Northern Lights",
    description: "Waterfalls, black sand beaches, geothermal hot springs, and glacier hikes.",
    coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    totalBudget: 3900,
    currency: "USD",
    durationDays: 6,
    stops: [
      { cityName: "Reykjavik", country: "Iceland", days: 2, budgetAllocation: 1200 },
      { cityName: "Vik & South Coast", country: "Iceland", days: 2, budgetAllocation: 1500 },
      { cityName: "Golden Circle", country: "Iceland", days: 2, budgetAllocation: 1200 }
    ]
  }
];
