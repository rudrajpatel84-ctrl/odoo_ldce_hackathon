export const INITIAL_TRIPS = [
  {
    id: "trip-japan-2026",
    userId: "demo-user-1",
    title: "Cherry Blossom Grand Tour",
    description: "A 10-day immersive adventure through neon metropolises, historic shrines, and serene onsens in Tokyo, Kyoto, and Osaka.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-04-02",
    endDate: "2026-04-12",
    totalBudget: 4200,
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
        notes: "Staying in Shinjuku. JR Rail Pass activated at Haneda Airport.",
        activities: [
          {
            id: "act-t1",
            tripStopId: "stop-tokyo",
            title: "Check-in at Hotel Gracery Shinjuku",
            category: "Stay",
            date: "2026-04-02",
            time: "15:00",
            cost: 650,
            notes: "Godzilla head viewing deck on 8th floor",
            isCompleted: true,
            orderIndex: 0
          },
          {
            id: "act-t2",
            tripStopId: "stop-tokyo",
            title: "Omoide Yokocho Yakitori Alley Food Crawl",
            category: "Food",
            date: "2026-04-02",
            time: "19:30",
            cost: 85,
            notes: "Try grilled skewers and local craft beer",
            isCompleted: true,
            orderIndex: 1
          },
          {
            id: "act-t3",
            tripStopId: "stop-tokyo",
            title: "teamLab Planets Immersive Art Museum",
            category: "Sightseeing",
            date: "2026-04-03",
            time: "10:30",
            cost: 60,
            notes: "Water exhibit requires barefoot entry",
            isCompleted: false,
            orderIndex: 2
          },
          {
            id: "act-t4",
            tripStopId: "stop-tokyo",
            title: "Shinkansen Bullet Train to Kyoto (Hikari 509)",
            category: "Transport",
            date: "2026-04-06",
            time: "09:00",
            cost: 140,
            notes: "Right side seats for Mount Fuji view",
            isCompleted: false,
            orderIndex: 3
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
        budgetAllocation: 1400,
        notes: "Traditional Ryokan experience in Gion district.",
        activities: [
          {
            id: "act-k1",
            tripStopId: "stop-kyoto",
            title: "Fushimi Inari Torii Gates Sunrise Hike",
            category: "Sightseeing",
            date: "2026-04-07",
            time: "06:30",
            cost: 0,
            notes: "Early start to beat tour crowds",
            isCompleted: false,
            orderIndex: 0
          },
          {
            id: "act-k2",
            tripStopId: "stop-kyoto",
            title: "Multi-course Kaiseki Dinner at Gion Karyo",
            category: "Food",
            date: "2026-04-07",
            time: "18:30",
            cost: 220,
            notes: "Reservation confirmed. Smart casual dress code.",
            isCompleted: false,
            orderIndex: 1
          },
          {
            id: "act-k3",
            tripStopId: "stop-kyoto",
            title: "Arashiyama Bamboo Grove & Monkey Park",
            category: "Activity",
            date: "2026-04-08",
            time: "11:00",
            cost: 45,
            notes: "Rent bicycles near Saga-Arashiyama station",
            isCompleted: false,
            orderIndex: 2
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
        budgetAllocation: 1000,
        notes: "Gastronomy and nightlife capital.",
        activities: [
          {
            id: "act-o1",
            tripStopId: "stop-osaka",
            title: "Dotonbori Street Food Discovery Tour",
            category: "Food",
            date: "2026-04-09",
            time: "18:00",
            cost: 95,
            notes: "Takoyaki, Okonomiyaki, and Kushikatsu tasting",
            isCompleted: false,
            orderIndex: 0
          },
          {
            id: "act-o2",
            tripStopId: "stop-osaka",
            title: "Osaka Castle & Park Gardens Walk",
            category: "Sightseeing",
            date: "2026-04-10",
            time: "10:00",
            cost: 30,
            notes: "Main tower observation deck",
            isCompleted: false,
            orderIndex: 1
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
    userId: "demo-user-1",
    title: "Italian Riviera & Roman Renaissance",
    description: "From the cliffside villages of Cinque Terre to the historic Colosseum in Rome and Tuscan vineyards.",
    coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-06-10",
    endDate: "2026-06-18",
    totalBudget: 3800,
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
        budgetAllocation: 2000,
        notes: "Trastevere apartment rental.",
        activities: [
          {
            id: "act-r1",
            tripStopId: "stop-rome",
            title: "Colosseum & Roman Forum VIP Access",
            category: "Sightseeing",
            date: "2026-06-11",
            time: "09:30",
            cost: 110,
            notes: "Underground arena pass included",
            isCompleted: false,
            orderIndex: 0
          },
          {
            id: "act-r2",
            tripStopId: "stop-rome",
            title: "Trastevere Evening Pasta & Wine Workshop",
            category: "Food",
            date: "2026-06-12",
            time: "18:00",
            cost: 130,
            notes: "Making fresh cacio e pepe from scratch",
            isCompleted: false,
            orderIndex: 1
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
        budgetAllocation: 1800,
        notes: "Day excursion to Chianti wine valley.",
        activities: [
          {
            id: "act-f1",
            tripStopId: "stop-florence",
            title: "Uffizi Gallery Masterpieces Tour",
            category: "Sightseeing",
            date: "2026-06-15",
            time: "14:00",
            cost: 65,
            notes: "Botticelli's Birth of Venus",
            isCompleted: false,
            orderIndex: 0
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
