"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          Discover the Best Open Source Repos
        </motion.h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
          Search trending GitHub projects and explore what’s hot in open source.
        </p>

        {/* Search Bar */}
        <div className="relative mt-8 w-full max-w-xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search repositories..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          🔥 Trending Repositories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Repo 1", "Repo 2", "Repo 3", "Repo 4"].map((repo, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{repo}</h3>
              <p className="text-sm text-zinc-400 mt-2">
                Short description of {repo} goes here.
              </p>
              <div className="flex gap-3 mt-4 text-sm text-zinc-500">
                ⭐ 1.2k · ⑂ 200
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
