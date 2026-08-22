const { EXCHANGE_RATES_BASE_USD } = require("./currencyController");

const DESTINATION_RECOMMENDATIONS = {
  ahmedabad: {
    city: "Ahmedabad",
    country: "India",
    tagline: "India's First UNESCO World Heritage City & Culinary Capital",
    bestSeason: "October to March (Pleasant dry winter)",
    currency: "INR",
    weatherTip: "Comfortable cotton clothing for heritage walks; pleasant breezy evenings by the riverfront.",
    culinaryHighlights: ["Manek Chowk Night Market", "Gujarati Thali at Agashiye", "Surati Locho & Fafda-Jalebi", "Ashrafi Kulfi"],
    activities: [
      {
        title: "Sabarmati Ashram & Peace Walk",
        category: "Culture",
        cost: 200,
        durationHours: 2.5,
        timeSlot: "Morning",
        locationNotes: "Historic headquarters of Mahatma Gandhi overlooking the Sabarmati River."
      },
      {
        title: "Adalaj Stepwell Architectural Marvel",
        category: "Sightseeing",
        cost: 300,
        durationHours: 2,
        timeSlot: "Morning",
        locationNotes: "5-storey deep 15th-century subterranean Solanki-style carved stepwell."
      },
      {
        title: "Old City Heritage Walk & Pols",
        category: "Culture",
        cost: 500,
        durationHours: 3,
        timeSlot: "Morning",
        locationNotes: "Guided walk through historic wooden-carved Pol neighborhoods and havelis."
      },
      {
        title: "Manek Chowk Street Food Odyssey",
        category: "Food & Dining",
        cost: 800,
        durationHours: 2.5,
        timeSlot: "Night",
        locationNotes: "Jewelry market transforms at 9 PM into a bustling night food hub for chocolate sandwiches & Gwalior dosa."
      },
      {
        title: "Sabarmati Riverfront Sunset Cycling",
        category: "Adventure",
        cost: 350,
        durationHours: 1.5,
        timeSlot: "Evening",
        locationNotes: "Dedicated waterfront promenade with sunset skyline views and rental bikes."
      },
      {
        title: "Calico Museum of Textiles Tour",
        category: "Culture",
        cost: 400,
        durationHours: 2.5,
        timeSlot: "Afternoon",
        locationNotes: "World-renowned repository of rare handwoven Indian historic fabrics."
      }
    ]
  },
  daman: {
    city: "Daman",
    country: "India",
    tagline: "Portuguese Coastal Haven on the Arabian Sea",
    bestSeason: "October to April (Breezy coastal weather)",
    currency: "INR",
    weatherTip: "Beachwear, sunglasses, and light evening jackets for breezy seaside dinners.",
    culinaryHighlights: ["Fresh Arabian Sea Pomfret Fry", "Portuguese Style Prawn Balchão", "Local Cashew Feni", "Devka Beach Chaat"],
    activities: [
      {
        title: "Moti Daman Fort & Lighthouse Exploration",
        category: "Sightseeing",
        cost: 150,
        durationHours: 3,
        timeSlot: "Morning",
        locationNotes: "16th-century Portuguese fortress walls with colonial cannons and ocean panoramas."
      },
      {
        title: "Church of Bom Jesus & Chapel of Our Lady of Rosary",
        category: "Culture",
        cost: 100,
        durationHours: 1.5,
        timeSlot: "Morning",
        locationNotes: "Exquisite Portuguese baroque gilded altars and Rosewood carvings."
      },
      {
        title: "Jampore Beach Parasailing & Water Sports",
        category: "Adventure",
        cost: 1800,
        durationHours: 3.5,
        timeSlot: "Afternoon",
        locationNotes: "Tranquil black-sand beach with jet-skiing, ATV riding, and parasailing."
      },
      {
        title: "Devka Beach Sunset & Seaside Seafood Feast",
        category: "Food & Dining",
        cost: 1600,
        durationHours: 2.5,
        timeSlot: "Evening",
        locationNotes: "Coastal shacks serving fresh catch of the day with live ocean soundscape."
      },
      {
        title: "Mirasol Lake Garden Pedal Boating & Leisure Walk",
        category: "Relaxation",
        cost: 300,
        durationHours: 2,
        timeSlot: "Afternoon",
        locationNotes: "Man-made lake surrounded by lush green islands, fountains, and bridges."
      }
    ]
  },
  surat: {
    city: "Surat",
    country: "India",
    tagline: "The Diamond City of Textiles & Street Food Heaven",
    bestSeason: "October to March",
    currency: "INR",
    weatherTip: "Comfortable shoes for textile market walks and empty stomach for food streets!",
    culinaryHighlights: ["Surati Locho with spicy chutneys", "Ghari Sweet Pastry", "Undhiyu & Puri", "Ponk Vada"],
    activities: [
      {
        title: "Surat Castle (Old Fort) by Tapi River",
        category: "Sightseeing",
        cost: 200,
        durationHours: 2,
        timeSlot: "Morning",
        locationNotes: "16th-century defense fortress built against Portuguese marauders."
      },
      {
        title: "Dumas Beach Black Sand Sunset Walk",
        category: "Relaxation",
        cost: 100,
        durationHours: 2,
        timeSlot: "Evening",
        locationNotes: "Mystical black-sand beach famous for spicy bhajiya and sea breeze."
      },
      {
        title: "Chowk Bazaar Street Food Crawl",
        category: "Food & Dining",
        cost: 650,
        durationHours: 2.5,
        timeSlot: "Evening",
        locationNotes: "Savor piping hot Surati Locho, Sev Khamani, and cold coco shakes."
      },
      {
        title: "Gopi Talav Heritage Lake Garden",
        category: "Relaxation",
        cost: 150,
        durationHours: 1.5,
        timeSlot: "Afternoon",
        locationNotes: "Refurbished urban lake with water laser shows and musical fountain."
      }
    ]
  },
  tokyo: {
    city: "Tokyo",
    country: "Japan",
    tagline: "Cyberpunk Metropoles & Ancient Shinto Shrines",
    bestSeason: "March-May (Cherry Blossoms) & Sept-Nov (Autumn Foliage)",
    currency: "JPY",
    weatherTip: "Layered clothing and slip-on shoes for frequent temple visits.",
    culinaryHighlights: ["Tonkotsu Ramen in Shinjuku", "Tsukiji Fresh Bluefin Sashimi", "Yakitori in Omoide Yokocho", "Matcha Parfaits in Asakusa"],
    activities: [
      {
        title: "Senso-ji Temple & Nakamise Street",
        category: "Culture",
        cost: 500,
        durationHours: 2.5,
        timeSlot: "Morning",
        locationNotes: "Oldest Buddhist temple in Tokyo with giant red lanterns."
      },
      {
        title: "Shibuya Sky Observatory & Crossing",
        category: "Sightseeing",
        cost: 2500,
        durationHours: 2,
        timeSlot: "Evening",
        locationNotes: "360-degree glass rooftop view over the bustling Shibuya crossing and Mt. Fuji."
      },
      {
        title: "teamLab Planets Digital Art Immersion",
        category: "Culture",
        cost: 3800,
        durationHours: 2,
        timeSlot: "Afternoon",
        locationNotes: "Barefoot digital water and botanical art museum."
      },
      {
        title: "Tsukiji Outer Market Food Tour",
        category: "Food & Dining",
        cost: 4500,
        durationHours: 2.5,
        timeSlot: "Morning",
        locationNotes: "Sample Wagyu skewers, grilled king crab legs, and tamagoyaki."
      }
    ]
  },
  rome: {
    city: "Rome",
    country: "Italy",
    tagline: "The Eternal City of Gladiators, Piazzas & Gelato",
    bestSeason: "April to June & September to October",
    currency: "EUR",
    weatherTip: "Walking sneakers for cobblestone streets and covered shoulders for Vatican visits.",
    culinaryHighlights: ["Authentic Carbonara & Cacio e Pepe", "Crispy Pizza al Taglio", "Artisanal Pistachio Gelato", "Espresso at Sant'Eustachio"],
    activities: [
      {
        title: "Colosseum & Roman Forum VIP Tour",
        category: "Sightseeing",
        cost: 35,
        durationHours: 3.5,
        timeSlot: "Morning",
        locationNotes: "Walk the arena floor where gladiators fought and explore the ancient senate."
      },
      {
        title: "Vatican Museums & Sistine Chapel",
        category: "Culture",
        cost: 40,
        durationHours: 3.5,
        timeSlot: "Morning",
        locationNotes: "Michelangelo's masterpiece ceiling and St. Peter's Basilica."
      },
      {
        title: "Trevi Fountain Coin Toss & Trastevere Food Walk",
        category: "Food & Dining",
        cost: 45,
        durationHours: 3,
        timeSlot: "Evening",
        locationNotes: "Baroque fountains, coin wishing tradition, followed by handmade pasta in Trastevere."
      },
      {
        title: "Pantheon & Piazza Navona Gelato Stroll",
        category: "Relaxation",
        cost: 15,
        durationHours: 2,
        timeSlot: "Afternoon",
        locationNotes: "Best preserved Roman dome with Bernini's Fountain of the Four Rivers."
      }
    ]
  }
};

const getRecommendationsByCity = (req, res) => {
  try {
    const rawCity = (req.params.city || "").trim().toLowerCase();
    const targetCurrency = (req.query.currency || "INR").toUpperCase();

    // Match exact or substring
    let matchedKey = Object.keys(DESTINATION_RECOMMENDATIONS).find(
      (k) => rawCity.includes(k) || k.includes(rawCity)
    );

    let destination = matchedKey ? DESTINATION_RECOMMENDATIONS[matchedKey] : null;

    // If city not in predefined list, generate smart dynamic fallback recommendations
    if (!destination) {
      const cityName = req.params.city || "Destination";
      destination = {
        city: cityName,
        country: "Global Destination",
        tagline: `Discover the top landmarks, hidden gems, and culinary culture of ${cityName}`,
        bestSeason: "Spring & Autumn months",
        currency: targetCurrency,
        weatherTip: "Pack versatile layers, comfortable walking shoes, and universal power adapters.",
        culinaryHighlights: [`Local iconic street foods of ${cityName}`, "Traditional artisan bakery breakfast", "Regional specialty dinner"],
        activities: [
          {
            title: `${cityName} City Highlights & Landmark Walking Tour`,
            category: "Sightseeing",
            cost: targetCurrency === "INR" ? 800 : 25,
            durationHours: 3,
            timeSlot: "Morning",
            locationNotes: `Historic central district and architectural highlights of ${cityName}.`
          },
          {
            title: `Authentic ${cityName} Food & Street Market Tasting`,
            category: "Food & Dining",
            cost: targetCurrency === "INR" ? 1200 : 35,
            durationHours: 2.5,
            timeSlot: "Evening",
            locationNotes: "Sample authentic regional dishes and local delicacies."
          },
          {
            title: `${cityName} Cultural Museum & Heritage Gallery`,
            category: "Culture",
            cost: targetCurrency === "INR" ? 600 : 18,
            durationHours: 2,
            timeSlot: "Afternoon",
            locationNotes: "Explore the local history and art traditions."
          },
          {
            title: `Sunset Viewpoint & Scenic Promenade Walk`,
            category: "Relaxation",
            cost: targetCurrency === "INR" ? 200 : 10,
            durationHours: 1.5,
            timeSlot: "Evening",
            locationNotes: "Panoramic golden hour vistas over the city skyline."
          }
        ]
      };
    }

    return res.json({
      success: true,
      destination,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return res.status(500).json({ message: "Failed to load recommendations." });
  }
};

const getPopularDestinations = (req, res) => {
  try {
    const list = Object.values(DESTINATION_RECOMMENDATIONS).map((d) => ({
      city: d.city,
      country: d.country,
      tagline: d.tagline,
      activitiesCount: d.activities.length,
    }));
    return res.json({ success: true, destinations: list });
  } catch (error) {
    console.error("Get popular destinations error:", error);
    return res.status(500).json({ message: "Failed to load popular destinations." });
  }
};

module.exports = {
  getRecommendationsByCity,
  getPopularDestinations,
  DESTINATION_RECOMMENDATIONS,
};
