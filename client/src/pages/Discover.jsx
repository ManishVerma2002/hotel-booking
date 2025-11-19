// Discover.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * Discover Page - React + Tailwind copy-paste ready
 * - Place this file inside your React app (e.g. src/pages/Discover.jsx)
 * - TailwindCSS must be configured in your project
 */

const SAMPLE_HOTELS = [
  {
    id: "h1",
    name: "Sea Breeze Resort",
    city: "Goa",
    price: 3499,
    rating: 4.6,
    category: "Resort",
    img:
      "https://images.unsplash.com/photo-1501117716987-c8e9fb2ec5c4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a7a7f2a6f6a9b0b5f5b1e73c9f9e2c1",
  },
  {
    id: "h2",
    name: "Mountainview Inn",
    city: "Manali",
    price: 2599,
    rating: 4.5,
    category: "Hotel",
    img:
      "https://images.unsplash.com/photo-1501117716987-c8e9fb2ec5c4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2c3f9f4d5a6b0c7d8e9f0a1b2c3d4e5f",
  },
  {
    id: "h3",
    name: "Heritage Haveli",
    city: "Udaipur",
    price: 1899,
    rating: 4.7,
    category: "Boutique",
    img:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b4c3a1b2f7d9a8b0e0cbb0d6a2f1a1f",
  },
  {
    id: "h4",
    name: "City Comforts",
    city: "Mumbai",
    price: 2999,
    rating: 4.2,
    category: "Business",
    img:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  },
  {
    id: "h5",
    name: "Lakeside Luxury",
    city: "Kochi",
    price: 4199,
    rating: 4.8,
    category: "Luxury",
    img:
      "https://images.unsplash.com/photo-1505691723518-36a6f0a0f0b6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d2c1b0a9e8f7c6b5a4e3d2c1b0a9e8f",
  },
];

const FEATURED = [
  { city: "Goa", subtitle: "120+ stays", img: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200&auto=format&fit=crop" },
  { city: "Manali", subtitle: "80+ stays", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop" },
  { city: "Udaipur", subtitle: "50+ stays", img: "https://images.unsplash.com/photo-1501436513141-9a5a3c8a9f2d?q=80&w=1200&auto=format&fit=crop" },
  { city: "Jaipur", subtitle: "70+ stays", img: "https://images.unsplash.com/photo-1505691723518-36a6f0a0f0b6?q=80&w=1200&auto=format&fit=crop" },
];

const CATEGORIES = ["All", "Budget", "Luxury", "Family", "Couple", "Pet-Friendly", "Resort", "Boutique"];

export default function Discover() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular"); // popular | priceLow | priceHigh | rating
  const [showMap, setShowMap] = useState(false);
  const [dealsEndsAt, setDealsEndsAt] = useState(() => {
    // 2 hours from now sample
    const dt = new Date();
    dt.setHours(dt.getHours() + 2);
    return dt;
  });

  // countdown timer for deals
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, dealsEndsAt - Date.now()));

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(Math.max(0, dealsEndsAt - Date.now()));
    }, 1000);
    return () => clearInterval(t);
  }, [dealsEndsAt]);

  const formatDuration = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // client-side filter/sort
  const filtered = useMemo(() => {
    let list = [...SAMPLE_HOTELS];

    if (city.trim()) {
      list = list.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
    }

    if (cat !== "All") {
      list = list.filter((h) => h.category.toLowerCase() === cat.toLowerCase());
    }

    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.rating - a.rating); // popular ~ rating

    return list;
  }, [query, city, cat, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Discover stays & experiences</h1>
              <p className="mt-2 text-sm md:text-base opacity-90">Find perfect places for your next trip — best prices, verified properties.</p>
            </div>

            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-xl p-3 shadow-md flex gap-2 items-center">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search hotels, city, property name..."
                  className="flex-1 px-3 py-2 rounded outline-none"
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City (optional)"
                  className="w-40 px-3 py-2 rounded outline-none border-l"
                />
                <button
                  onClick={() => setShowMap((s) => !s)}
                  className="bg-sky-600 text-white px-4 py-2 rounded"
                >
                  {showMap ? "Hide Map" : "Map View"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Destinations */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold text-lg mb-3">Featured Destinations</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FEATURED.map((f) => (
                  <div key={f.city} className="rounded overflow-hidden shadow-sm">
                    <div
                      className="h-28 bg-cover bg-center"
                      style={{ backgroundImage: `url(${f.img})` }}
                    />
                    <div className="p-2">
                      <div className="font-medium">{f.city}</div>
                      <div className="text-xs text-gray-500">{f.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Deals */}
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Top Deals</h3>
                <p className="text-sm text-gray-600">Limited time offers on select hotels.</p>
                <div className="mt-2 text-2xl font-bold text-rose-600">Up to 50% OFF</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Deal ends in</div>
                <div className="mt-2 text-lg font-mono bg-gray-100 px-3 py-2 rounded">
                  {formatDuration(timeLeft)}
                </div>
                <button
                  className="mt-3 bg-rose-600 text-white px-4 py-2 rounded"
                  onClick={() => alert("Open deals — integrate your deals screen")}
                >
                  View Offers
                </button>
              </div>
            </div>

            {/* Filters row */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-center">
              <div className="flex gap-2 items-center">
                <label className="text-sm text-gray-600">Category</label>
                <select value={cat} onChange={(e) => setCat(e.target.value)} className="border px-2 py-1 rounded">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <label className="text-sm text-gray-600">Sort</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border px-2 py-1 rounded">
                  <option value="popular">Popular</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="ml-auto text-sm text-gray-600">Showing <strong>{filtered.length}</strong> stays</div>
            </div>

            {/* Hotels grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((h) => (
                <div key={h.id} className="bg-white rounded-xl shadow overflow-hidden flex">
                  <img src={h.img} alt={h.name} className="w-40 h-40 object-cover" />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{h.name}</div>
                        <div className="text-xs text-gray-500">{h.city} • {h.category}</div>
                        <div className="mt-2 text-sm text-gray-600">Short nice description goes here. Replace with API data.</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₹{h.price}</div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded">{h.rating} ⭐</div>
                        <div className="text-xs text-gray-500">Free cancellation</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="border px-3 py-1 rounded">Details</button>
                        <button className="bg-sky-600 text-white px-3 py-1 rounded" onClick={() => alert(`Book ${h.name}`)}>Book</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending / Categories */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Trending Categories</h3>
              <div className="flex gap-3 overflow-auto py-2">
                {["Beach Resorts", "Mountain Retreats", "Pet Friendly", "Budget"].map((c) => (
                  <div key={c} className="min-w-[180px] rounded-lg bg-gradient-to-br from-gray-100 to-white p-3 shadow-sm">
                    <div className="font-medium">{c}</div>
                    <div className="text-xs text-gray-500 mt-1">Handpicked properties & deals</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blogs / Guides */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Travel Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "b1", title: "Top 10 beaches in India", excerpt: "Best beaches to visit this year.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop" },
                  { id: "b2", title: "Budget stays under ₹1500", excerpt: "Comfortable and pocket friendly stays.", img: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1200&auto=format&fit=crop" },
                  { id: "b3", title: "Romantic getaways", excerpt: "Plan the perfect couple trip.", img: "https://images.unsplash.com/photo-1474073705359-9d8b4c8d6bd3?q=80&w=1200&auto=format&fit=crop" },
                ].map((b) => (
                  <div key={b.id} className="rounded overflow-hidden">
                    <img src={b.img} alt={b.title} className="h-32 w-full object-cover" />
                    <div className="p-3">
                      <div className="font-medium">{b.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{b.excerpt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Map</h4>
                <button onClick={() => setShowMap((s) => !s)} className="text-sm text-sky-600">{showMap ? "Hide" : "Toggle"}</button>
              </div>

              {showMap ? (
                <div className="mt-3 h-60 rounded overflow-hidden border">
                  {/* Replace src with your actual map or Mapbox react component */}
                  <iframe
                    title="map"
                    src="https://maps.google.com/maps?q=india&t=&z=5&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-500">Map view is hidden. Toggle to show hotels on map.</div>
              )}
            </div>

            {/* Top Rated */}
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="font-semibold mb-3">Top Rated Hotels</h4>
              <div className="space-y-2">
                {SAMPLE_HOTELS
                  .slice()
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map((h) => (
                    <div key={h.id} className="flex items-center gap-3">
                      <img src={h.img} alt={h.name} className="w-14 h-14 object-cover rounded" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{h.name}</div>
                        <div className="text-xs text-gray-500">₹{h.price} • {h.city}</div>
                      </div>
                      <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">{h.rating}</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Why choose us */}
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="font-semibold mb-3">Why choose us?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✔ Best price guarantee</li>
                <li>✔ Verified properties</li>
                <li>✔ 24/7 customer support</li>
                <li>✔ Easy cancellation</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 md:px-6 py-8 text-sm text-gray-600">
        <div className="border-t pt-4">© {new Date().getFullYear()} YourHotelBrand — All rights reserved.</div>
      </footer>
    </div>
  );
}
