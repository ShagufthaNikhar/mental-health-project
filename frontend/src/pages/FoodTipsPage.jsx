// src/pages/FoodTipsPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { speakText, voiceLangMap } from "../utils/voice";
import { useTranslation } from "react-i18next";

export default function FoodTipsPage({ user }) {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");

  // 🔊 PAGE GREETING — Speak “Food Tips”
  useEffect(() => {
    const lang = voiceLangMap[i18n.language] || "en-IN";
    speakText(t("food_tips_heading"), lang);
  }, []); // run only ONCE

  // Short local labels (NO EMOJI)
  const filterLabels = {
    all: "All",
    stress: "Stress",
    anxiety: "Anxiety",
    depression: "Depression",
    wellness: "Wellness",
    avoid: "Avoid",
    science: "Science",
  };

  // ✨ FOOD LIST (emoji + English names stay)
  const tipsData = [
    {
      id: 1,
      category: "stress",
      title: t("stress_foods"),
      gradient: "from-pink-50 to-pink-100",
      items: [
        { name: "🍓 Berries", desc: t("strawberries_desc") || "Rich in antioxidants for mood support." },
        { name: "🥑 Avocado", desc: t("avocado_desc") || "Healthy fats calm the nervous system." },
        { name: "🌰 Almonds", desc: t("almonds_desc") || "Magnesium reduces physical stress levels." },
        { name: "🍵 Green Tea", desc: t("green_tea_desc") || "L-theanine relaxes the mind naturally." },
        { name: "🍊 Oranges", desc: t("orange_desc") || "Vitamin C lowers stress hormones." },
        { name: "🍌 Bananas", desc: t("bananas_desc") || "B6 supports serotonin production." },
        { name: "🥦 Broccoli", desc: t("broccoli_desc") || "Anti-inflammatory nutrients reduce stress." },
        { name: "🌿 Chamomile Tea", desc: t("chamomile_tea_desc") || "Traditional soothing herbal drink." },
        { name: "🥭 Mango", desc: t("mango_desc") || "Antioxidants help reduce stress response." },
        { name: "🥛 Turmeric Milk", desc: t("turmeric_desc") || "Warm calming anti-inflammatory drink." },
        { name: "🍚 Curd Rice", desc: t("rice_desc") || "Comfort food that eases digestion." },
        { name: "🥘 Khichdi", desc: t("comfort_foods_desc") || "Light and calming Indian meal." },
        { name: "🫘 Moong Dal", desc: t("lentils_desc") || "Gentle protein supporting calmness." },
        { name: "🥥 Coconut Water", desc: t("coconut_water_desc") || "Hydrates and reduces fatigue." },
        { name: "🌰 Walnuts", desc: t("walnuts_desc") || "Omega-3 reduces stress reactivity." }
      ]
    },

    {
      id: 2,
      category: "anxiety",
      title: t("anxiety_foods"),
      gradient: "from-blue-50 to-blue-100",
      items: [
        { name: "🐟 Salmon", desc: t("salmon_desc") || "Omega-3 helps reduce anxious feelings." },
        { name: "🍌 Bananas", desc: t("bananas_desc") || "Supports serotonin and calm energy." },
        { name: "🍫 Dark Chocolate", desc: t("dark_chocolate_desc") || "Shown to reduce anxiety hormones." },
        { name: "🌿 Tulsi Tea", desc: t("herbs_spices_desc") || "Traditional Indian herb for anxiety relief." },
        { name: "🥛 Warm Milk", desc: t("milk_desc") || "Helps promote relaxation and sleep." },
        { name: "🥜 Cashews", desc: t("nuts_desc") || "Zinc supports calmer mood." },
        { name: "🥣 Poha", desc: t("poha_desc") || "Light food that eases nervousness." },
        { name: "🥛 Buttermilk", desc: t("milk_desc") || "Cooling drink that soothes the body." },
        { name: "🍊 Oranges", desc: t("orange_desc") || "Vitamin C reduces anxious tension." },
        { name: "🥭 Papaya", desc: t("papaya_desc") || "Good digestion reduces anxiety." },
        { name: "🥚 Eggs", desc: t("eggs_desc") || "Protein keeps mood steady." },
        { name: "🍇 Grapes", desc: t("grapes_desc") || "Anti-inflammatory support for the brain." },
        { name: "🍯 Honey Water", desc: t("honey_desc") || "Mild natural calming effect." },
        { name: "🥥 Coconut Chutney", desc: t("coconut_water_desc") || "Healthy fats help calm the mind." },
        { name: "🌿 Peppermint Tea", desc: t("herbs_spices_desc") || "Soothes tension and headaches." }
      ]
    },

    {
      id: 3,
      category: "depression",
      title: t("depression_foods"),
      gradient: "from-yellow-50 to-yellow-100",
      items: [
        { name: "🥚 Eggs", desc: t("eggs_desc") || "Vitamin D supports healthy mood." },
        { name: "🐟 Sardines", desc: t("fatty_fish_desc") || "Omega-3 helps reduce depression signs." },
        { name: "🌾 Ragi", desc: t("ragi_desc") || "Tryptophan naturally improves mood." },
        { name: "🍇 Blueberries", desc: t("blueberries_desc") || "Boost positive brain chemicals." },
        { name: "🥛 Yogurt", desc: t("yogurt_desc") || "Healthy gut improves mood state." },
        { name: "🍛 Idli", desc: t("idli_desc") || "Fermented food improves gut balance." },
        { name: "🥣 Dosa", desc: t("oats_desc") || "Promotes healthy gut bacteria." },
        { name: "🫘 Rajma", desc: t("beans_desc") || "Supports stable mood and energy." },
        { name: "🍅 Tomatoes", desc: t("tomato_desc") || "Lycopene helps reduce depression." },
        { name: "🥬 Spinach", desc: t("spinach_desc") || "Folate deficiency linked to depression." },
        { name: "🍓 Strawberries", desc: t("strawberries_desc") || "Reduce inflammation in the brain." },
        { name: "🥭 Mango", desc: t("mango_desc") || "Boosts natural feel-good chemicals." },
        { name: "🍛 Dal Khichdi", desc: t("comfort_foods_desc") || "Comfort food supporting emotional balance." },
        { name: "🥥 Coconut", desc: t("coconut_water_desc") || "Boosts energy and alertness." },
        { name: "🍌 Bananas", desc: t("bananas_desc") || "Rich in natural antidepressant nutrients." }
      ]
    },

    {
      id: 4,
      category: "wellness",
      title: t("general_wellness"),
      gradient: "from-green-50 to-green-100",
      items: [
        { name: "🥥 Coconut Water", desc: t("coconut_water_desc") || "Hydrates and improves clarity." },
        { name: "🥗 Ragi Porridge", desc: t("ragi_desc") || "Improves stamina and mind strength." },
        { name: "🍎 Apple", desc: t("apple_desc") || "Good for daily wellness." },
        { name: "🥕 Carrot", desc: t("carrot_desc") || "Antioxidants protect the brain." },
        { name: "🌰 Walnuts", desc: t("walnuts_desc") || "Improves focus and memory." },
        { name: "🍇 Grapes", desc: t("grapes_desc") || "Boosts concentration and cognition." },
        { name: "🥦 Broccoli", desc: t("broccoli_desc") || "Strong immunity for the brain." },
        { name: "🍚 Curd Rice", desc: t("rice_desc") || "Soothes digestion and mind." },
        { name: "🍉 Watermelon", desc: t("watermelon_desc") || "Hydrating, reduces fatigue." },
        { name: "🥭 Mango", desc: t("mango_desc") || "Antioxidants support vitality." },
        { name: "🍅 Tomatoes", desc: t("tomato_desc") || "Improves concentration naturally." },
        { name: "🌾 Oats", desc: t("oats_desc") || "Boosts serotonin gently." },
        { name: "🥬 Lettuce", desc: t("dark_leafy_greens_desc") || "Promotes calmness and better sleep." },
        { name: "🍍 Pineapple", desc: t("pineapple_desc") || "Increases natural positive energy." },
        { name: "🍊 Oranges", desc: t("orange_desc") || "Boosts immunity and vitality." }
      ]
    },

    {
      id: 5,
      category: "avoid",
      title: t("foods_to_avoid"),
      gradient: "from-red-50 to-red-100",
      items: [
        { name: "🥤 Sugary Drinks", desc: t("foods_to_avoid_list.excess_sugar") || "Cause quick energy crashes." },
        { name: "🍕 Fast Food", desc: t("foods_to_avoid_list.processed_foods") || "Linked to low mood levels." },
        { name: "🍟 Fried Foods", desc: t("foods_to_avoid_list.trans_fats") || "Increase inflammation in the brain." },
        { name: "🍔 Greasy Food", desc: t("foods_to_avoid_list.processed_foods") || "Reduces energy and clarity." },
        { name: "🍰 Sweets", desc: t("foods_to_avoid_list.excess_sugar") || "Sugar spikes worsen mood swings." },
        { name: "☕ Excess Coffee", desc: t("foods_to_avoid_list.excess_caffeine") || "Triggers anxiety and restlessness." },
        { name: "🍺 Alcohol", desc: t("foods_to_avoid_list.excess_alcohol") || "Worsens sleep and mood stability." },
        { name: "🥡 Instant Noodles", desc: t("foods_to_avoid_list.processed_foods") || "High sodium increases fatigue." },
        { name: "🍫 Milk Chocolate", desc: t("dark_chocolate_desc") || "High sugar affects emotions." },
        { name: "🍞 White Bread", desc: t("chapati_desc") || "Causes blood sugar crashes." },
        { name: "🧂 Too Much Salt", desc: t("foods_to_avoid_list.processed_foods") || "Raises stress chemicals." },
        { name: "🍟 Chips", desc: t("foods_to_avoid_list.trans_fats") || "Trans fats harm emotional balance." },
        { name: "🍨 Ice Cream", desc: t("foods_to_avoid_list.excess_sugar") || "Causes sudden energy drop." },
        { name: "🍛 Very Spicy Food", desc: t("foods_to_avoid_list.processed_foods") || "Can increase stress response." },
        { name: "🧃 Packaged Juice", desc: t("foods_to_avoid_list.excess_sugar") || "Hidden sugar harms mood." }
      ]
    },

    {
      id: 6,
      category: "science",
      title: t("scientifically_proven_foods"),
      gradient: "from-purple-50 to-purple-100",
      items: [
        { name: "🫐 Blueberries", desc: t("blueberries_desc") || "Boosts brain health and resilience." },
        { name: "🍫 Dark Chocolate", desc: t("dark_chocolate_desc") || "Clinically shown to reduce stress." },
        { name: "🌾 Oats", desc: t("oats_desc") || "Supports serotonin levels naturally." },
        { name: "🥬 Spinach", desc: t("spinach_desc") || "Folate helps prevent depression." },
        { name: "🐟 Fatty Fish", desc: t("fatty_fish_desc") || "Proven mood-boosting omega-3s." },
        { name: "🫘 Lentils", desc: t("lentils_desc") || "Folate supports brain chemistry." },
        { name: "🌿 Turmeric", desc: t("turmeric_desc") || "Curcumin proven to improve mood." },
        { name: "🥛 Yogurt", desc: t("yogurt_desc") || "Probiotics support gut-brain health." },
        { name: "🍌 Bananas", desc: t("bananas_desc") || "Natural serotonin boosters." },
        { name: "🥥 Coconut", desc: t("coconut_water_desc") || "Boosts cognitive performance." },
        { name: "🍊 Citrus Fruits", desc: t("orange_desc") || "Vitamin C lowers stress levels." },
        { name: "🌰 Walnuts", desc: t("walnuts_desc") || "Improves memory and reduces anxiety." },
        { name: "🍅 Tomatoes", desc: t("tomato_desc") || "Protects brain from oxidative stress." },
        { name: "🥭 Mango", desc: t("mango_desc") || "High antioxidants improve mood state." },
        { name: "🥗 Ragi", desc: t("ragi_desc") || "Tryptophan supports healthier mood." }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      <Sidebar user={user} />

      <main className="flex-1 p-6">
        <TopBar user={user} />

        {/* Banner */}
        <div className="flex flex-col items-center mb-8">
          <img
            
            src="/images/banners/food_banner.png"
            alt="Food Tips Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            {t("food_tips_heading")}
          </h1>

          <p className="text-gray-700 text-lg text-center max-w-2xl">
            {t("scientifically_proven_desc")}
          </p>
        </div>

        {/* Filters — NO emoji, short clean labels */}
        <div className="flex gap-3 justify-center flex-wrap mb-10">
          {Object.keys(filterLabels).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-6 py-3 text-lg rounded-full font-semibold shadow ${
                activeFilter === key
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {filterLabels[key]}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="w-full max-w-6xl mx-auto space-y-10">
          {(activeFilter === "all"
            ? tipsData
            : tipsData.filter((item) => item.category === activeFilter)
          ).map((section) => (
            <div
              key={section.id}
              className={`p-6 rounded-3xl shadow-xl bg-gradient-to-br ${section.gradient}`}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {section.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white shadow">
                    <div className="text-xl font-semibold mb-2">{item.name}</div>
                    <p className="text-gray-600 text-md">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
