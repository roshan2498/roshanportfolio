import { useState } from "react";
import "./NutritionGuide.css";

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: "◎",
  },
  {
    id: "supplements",
    label: "Core Supplements",
    icon: "◈",
  },
  {
    id: "timing",
    label: "Timing Guide",
    icon: "◷",
  },
  {
    id: "veg",
    label: "Veg Days",
    icon: "◆",
  },
  {
    id: "nonveg",
    label: "Non-Veg Days",
    icon: "◇",
  },
  {
    id: "running",
    label: "Running Days",
    icon: "◉",
  },
  {
    id: "grocery",
    label: "Grocery List",
    icon: "☰",
  },
];

const supps = [
  {
    name: "Whey Protein",
    priority: "Essential",
    dose: "30–35g per scoop",
    timing: "Within 30 min post-workout",
    why: "Fastest way to hit your 150–165g daily protein target. Especially critical since Indian meals can be carb-heavy — this bridges the protein gap.",
    indian: "Mix with milk for extra protein + calcium. On veg days this is non-negotiable.",
    color: "#1D9E75",
    bg: "#E1F5EE",
  },
  {
    name: "Creatine Monohydrate",
    priority: "Essential",
    dose: "3–5g daily",
    timing: "Any time — consistency matters more than timing",
    why: "The most researched supplement for powerlifting. Increases phosphocreatine stores → more ATP → more strength on heavy compounds. Safe long-term.",
    indian: "Mix into your dal, curd, or any food/drink. No taste. No loading phase needed — just take it daily.",
    color: "#185FA5",
    bg: "#E6F1FB",
  },
  {
    name: "Vitamin D3 + K2",
    priority: "High",
    dose: "2000–4000 IU D3 + 100mcg K2",
    timing: "Morning with a fatty meal (ghee/nuts)",
    why: "Indians are chronically deficient even with sun exposure. Vitamin D supports testosterone, immunity, bone density — all important for powerlifting. K2 ensures calcium goes to bones, not arteries.",
    indian: "Take with breakfast when you have ghee or nuts. Dal tadka with ghee = perfect pairing.",
    color: "#BA7517",
    bg: "#FAEEDA",
  },
  {
    name: "Omega-3 Fish Oil",
    priority: "High",
    dose: "2–3g EPA+DHA daily",
    timing: "With any main meal",
    why: "Reduces muscle soreness and inflammation — key for training 5x/week. Also supports joint health under heavy loads.",
    indian: "If you eat fish 3–4x/week (sardines, mackerel, salmon), you may not need this. Otherwise supplement.",
    color: "#3C3489",
    bg: "#EEEDFE",
  },
  {
    name: "Magnesium Glycinate",
    priority: "Medium",
    dose: "300–400mg",
    timing: "30–60 min before bed",
    why: "You mentioned average sleep. Magnesium improves sleep quality and recovery. Also depleted by heavy training and sweat.",
    indian: "Indians often get enough magnesium from dal and nuts but not always enough to offset training demands.",
    color: "#639922",
    bg: "#EAF3DE",
  },
  {
    name: "Caffeine / Pre-workout",
    priority: "Optional",
    dose: "100–200mg caffeine",
    timing: "30–45 min pre-workout",
    why: "Proven to improve strength output and endurance. Black coffee works just as well as expensive pre-workout.",
    indian: "Strong black chai or filter coffee (no sugar) is your best natural pre-workout. Saves money, zero additives.",
    color: "#993C1D",
    bg: "#FAECE7",
  },
  {
    name: "Zinc + B12",
    priority: "Check first",
    dose: "Zinc: 25–40mg | B12: 500–1000mcg",
    timing: "Zinc at night (away from calcium). B12 morning.",
    why: "On veg days your B12 and zinc intake drops significantly. B12 is only found in animal products. Zinc from plant sources (dal) is less bioavailable.",
    indian: "If you go 3+ days without eggs/chicken/fish, B12 and zinc likely need supplementing. Get a blood test to confirm.",
    color: "#888780",
    bg: "#F1EFE8",
  },
];

const timingData = [
  { time: "7:00 AM", label: "Wake up", action: "Vitamin D3+K2 + Omega-3 with breakfast", type: "supp" },
  { time: "7:30 AM", label: "Breakfast", action: "High protein meal — eggs / paneer / oats", type: "food" },
  { time: "4:30 PM", label: "Pre-workout", action: "Carb + protein snack (banana + curd / boiled eggs + roti)", type: "food" },
  { time: "5:00 PM", label: "Optional caffeine", action: "Black chai or coffee (no sugar) if needed", type: "supp" },
  { time: "5:30 PM", label: "Train", action: "Lift or run", type: "train" },
  { time: "7:00 PM", label: "Post-workout", action: "Whey shake immediately + Creatine mixed in", type: "supp" },
  { time: "8:00 PM", label: "Dinner", action: "Full meal — protein + carbs + sabzi", type: "food" },
  { time: "9:30 PM", label: "Before bed", action: "Magnesium Glycinate 300–400mg", type: "supp" },
];

const vegDay = [
  { meal: "Breakfast", items: "4 eggs (any style) + oats 80g or 2 roti + curd 150g", protein: "42g", cal: "560" },
  { meal: "Lunch", items: "Paneer bhurji 150g + rajma 1 cup + 1 roti + curd", protein: "42g", cal: "590" },
  { meal: "Pre-workout", items: "Banana + Greek yogurt 150g + 10 almonds", protein: "18g", cal: "360" },
  { meal: "Post-workout", items: "Whey shake 35g in milk 250ml", protein: "38g", cal: "280" },
  { meal: "Dinner", items: "Dal tadka (large bowl) + paneer curry 100g + 2 roti + sabzi", protein: "38g", cal: "570" },
  { meal: "Total", items: "", protein: "~178g", cal: "~2360", total: true },
];

const nonVegDay = [
  { meal: "Breakfast", items: "4 whole eggs + 2 roti + curd 100g", protein: "38g", cal: "550" },
  { meal: "Lunch", items: "Chicken breast 220g (curry/grilled) + 1 cup rice + dal + sabzi", protein: "52g", cal: "640" },
  { meal: "Pre-workout", items: "Boiled egg 2 + banana + small handful nuts", protein: "16g", cal: "340" },
  { meal: "Post-workout", items: "Whey shake 35g in water", protein: "30g", cal: "150" },
  { meal: "Dinner", items: "Fish curry 180g or chicken stew 200g + 2 roti + sabzi", protein: "42g", cal: "520" },
  { meal: "Total", items: "", protein: "~178g", cal: "~2200", total: true },
];

const runningTips = [
  { title: "Morning run (fasted)", tip: "Have a banana 15 min before. Full high-protein breakfast after. Don't run truly fasted — strength training has already taxed your glycogen." },
  { title: "Evening run only", tip: "Treat like a lifting day. Carbs up at lunch. Post-run: whey shake + fruit within 30 min." },
  { title: "Run + lift same day", tip: "This is your highest calorie day. Add 200–250 kcal via extra rice at lunch or a banana + peanut butter snack. Don't skip carbs." },
  { title: "5km runs", tip: "Burns ~350–400 kcal for you. Don't over-eat back. Just keep protein high and carbs slightly elevated." },
  { title: "10km runs", tip: "Burns ~700+ kcal. On 10km days eat at maintenance (~2,900 kcal), not a deficit. Recovery matters more." },
  { title: "Hydration", tip: "Add an extra 500–750ml water on run days. Electrolytes (nimbu paani with salt + sugar) beat sports drinks for Indian runners." },
];

const grocery = {
  protein: ["Chicken breast (500g–1kg/week)", "Eggs (2 dozen/week)", "Fish — sardines/rohu/pomfret (500g/week)", "Paneer (500g/week)", "Dahi / Greek yogurt (1kg/week)", "Whey protein (tub)"],
  carbs: ["Oats — rolled (1kg)", "Basmati rice (1–2kg)", "Wheat flour / atta for rotis", "Sweet potato (500g)", "Poha (500g)", "Banana (1 dozen)"],
  pulses: ["Rajma (500g)", "Chana (500g)", "Dal — moong, masoor, toor (1kg each)", "Tofu (200–400g for veg days)"],
  fats: ["Ghee (small jar)", "Mixed nuts — almonds, walnuts (250g)", "Peanut butter — natural (1 jar)", "Flaxseeds or sunflower seeds (250g)"],
  supps: ["Whey protein", "Creatine monohydrate (500g)", "Vitamin D3+K2", "Omega-3 fish oil", "Magnesium glycinate"],
  veggies: ["Spinach / palak", "Broccoli", "Capsicum", "Tomatoes", "Onions", "Cauliflower / gobhi", "Green beans"],
};

const typeColor = { supp: "#E1F5EE", food: "#E6F1FB", train: "#FAEEDA" };
const typeText = { supp: "#0F6E56", food: "#185FA5", train: "#854F0B" };
const typeLabel = { supp: "Supplement", food: "Meal", train: "Training" };

export default function NutritionGuide() {
  const [active, setActive] = useState("overview");

  return (
    <div className="nutrition-guide" style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", maxWidth: 780, margin: "0 auto", padding: "1rem 0" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Personal guide</p>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>Nutrition & Supplements</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>Tailored for Indian diet · Powerlifting + Running · Body recomposition</p>
      </div>

      <div className="tab-bar" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            style={{ padding: "6px 14px", fontSize: 13, borderRadius: 20, border: `0.5px solid ${active === s.id ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`, background: active === s.id ? "var(--color-background-secondary)" : "transparent", color: "var(--color-text-primary)", cursor: "pointer", fontWeight: active === s.id ? 500 : 400 }}>
            {s.label}
          </button>
        ))}
      </div>

      {active === "overview" && (
        <div>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
            {[["Calorie target", "2,600–2,700 kcal"], ["Protein goal", "150–165g / day"], ["Training days", "5x lift + 2x run"], ["Deficit", "~300 kcal/day"]].map(([l, v]) => (
              <div key={l} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>{l}</p>
                <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <p style={{ fontWeight: 500, fontSize: 15, margin: "0 0 8px" }}>Your recomposition reality check</p>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 8px" }}>You're 27, 93kg, strong on compounds, good frame. The abs are there — they're under a layer of body fat. This guide targets ~0.3–0.4kg of fat loss per week while preserving and slowly building muscle.</p>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>This is slower than a crash diet on purpose. Your strength won't tank, your muscle stays, and the results actually hold.</p>
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
            <p style={{ fontWeight: 500, fontSize: 15, margin: "0 0 12px" }}>Your 3 biggest levers</p>
            {[["1. Protein first", "Every single meal needs a protein anchor. This is the one number worth tracking."],
              ["2. Portion awareness", "You don't need to weigh everything. Eyeball it: 1 cup rice, 2–3 rotis, 150–200g protein. Awareness alone changes outcomes."],
              ["3. Consistency over perfection", "One bad meal or weekend doesn't undo a week. Missing your whey shake for 5 days in a row does."]
            ].map(([h, b]) => (
              <div key={h} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 2px" }}>{h}</p>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {active === "supplements" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {supps.map(s => (
            <div key={s.name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 500, margin: 0, flex: 1 }}>{s.name}</p>
                <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500 }}>{s.priority}</span>
              </div>
              <div className="supp-meta" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>Dose: <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{s.dose}</span></p>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>Timing: <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{s.timing}</span></p>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 8px" }}>{s.why}</p>
              <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "8px 12px" }}>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 2px", fontWeight: 500 }}>Indian diet note</p>
                <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.6 }}>{s.indian}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "timing" && (
        <div>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "1rem", lineHeight: 1.7 }}>Sample day on a lifting day. Adjust times to your actual schedule — structure matters more than exact times.</p>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: "0.5px", background: "var(--color-border-tertiary)" }} />
            {timingData.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, position: "relative" }}>
                <div style={{ position: "absolute", left: -21, top: 4, width: 10, height: 10, borderRadius: "50%", background: typeColor[t.type], border: `1.5px solid ${typeText[t.type]}`, zIndex: 1 }} />
                <div style={{ minWidth: 60 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", margin: 0 }}>{t.time}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.label}</p>
                    <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 20, background: typeColor[t.type], color: typeText[t.type] }}>{typeLabel[t.type]}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>{t.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active === "veg" && (
        <div>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "1rem", lineHeight: 1.7 }}>Vegetarian days are harder to hit protein on. The key rule: always combine two protein sources per meal. Dal alone won't cut it.</p>
          {vegDay.map((row, i) => (
            <div key={i} className={`meal-row${row.total ? " total-row" : ""}`} style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 60px", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: i < vegDay.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", background: row.total ? "var(--color-background-secondary)" : "transparent", borderRadius: row.total ? "var(--border-radius-md)" : 0, paddingLeft: row.total ? 10 : 0, paddingRight: row.total ? 10 : 0 }}>
              <p className="meal-name" style={{ fontSize: 13, fontWeight: 500, margin: 0, color: row.total ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{row.meal}</p>
              <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5 }}>{row.items}</p>
              <div className="meal-macros">
                <span className="protein">{row.protein}</span>
                <span>{row.cal}</span>
              </div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 60px", gap: 8, paddingTop: 6 }}>
            <div /><div />
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", textAlign: "right", margin: 0 }}>Protein</p>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", textAlign: "right", margin: 0 }}>Kcal</p>
          </div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem", marginTop: "1.25rem" }}>
            <p style={{ fontWeight: 500, fontSize: 14, margin: "0 0 8px" }}>Veg day power pairs</p>
            {[["Dal + curd", "Add a bowl of dahi to any dal meal"], ["Paneer + eggs", "Paneer bhurji made with 1 egg = extra 6g protein"], ["Rajma + Greek yogurt", "Raita on the side easily adds 10–12g"], ["Chana + tofu", "Mix into a salad or sabzi for gym days"]].map(([a, b]) => (
              <p key={a} style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 6px", lineHeight: 1.6 }}><span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{a}</span> — {b}</p>
            ))}
          </div>
        </div>
      )}

      {active === "nonveg" && (
        <div>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "1rem", lineHeight: 1.7 }}>Non-veg days make hitting protein much easier. Use these days to hit the higher end of your target (165g+).</p>
          {nonVegDay.map((row, i) => (
            <div key={i} className={`meal-row${row.total ? " total-row" : ""}`} style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 60px", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: i < nonVegDay.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", background: row.total ? "var(--color-background-secondary)" : "transparent", borderRadius: row.total ? "var(--border-radius-md)" : 0, paddingLeft: row.total ? 10 : 0, paddingRight: row.total ? 10 : 0 }}>
              <p className="meal-name" style={{ fontSize: 13, fontWeight: 500, margin: 0, color: row.total ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{row.meal}</p>
              <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5 }}>{row.items}</p>
              <div className="meal-macros">
                <span className="protein">{row.protein}</span>
                <span>{row.cal}</span>
              </div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 60px", gap: 8, paddingTop: 6 }}>
            <div /><div />
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", textAlign: "right", margin: 0 }}>Protein</p>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", textAlign: "right", margin: 0 }}>Kcal</p>
          </div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem", marginTop: "1.25rem" }}>
            <p style={{ fontWeight: 500, fontSize: 14, margin: "0 0 8px" }}>Best protein sources ranked</p>
            {[["Chicken breast (100g)", "31g protein, 165 kcal — king of lean protein"],
              ["Eggs (1 whole)", "6g protein, 70 kcal — most versatile"],
              ["Rohu / fish (100g)", "20–25g protein, 90–120 kcal"],
              ["Sardines (canned, 100g)", "25g protein, 208 kcal + omega-3"],
              ["Egg whites (3)", "11g protein, 50 kcal — use with whole eggs"],
            ].map(([a, b]) => (
              <p key={a} style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 6px", lineHeight: 1.6 }}><span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{a}</span> — {b}</p>
            ))}
          </div>
        </div>
      )}

      {active === "running" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {runningTips.map((t, i) => (
            <div key={i} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 6px" }}>{t.title}</p>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>{t.tip}</p>
            </div>
          ))}
          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
            <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>Nimbu paani electrolyte formula</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>500ml water + juice of 1 lemon + pinch of rock salt + 1 tsp sugar (or skip sugar post-run). Better than any commercial sports drink for runs under 10km.</p>
          </div>
        </div>
      )}

      {active === "grocery" && (
        <div className="grocery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            ["Protein sources", grocery.protein, "#E1F5EE", "#1D9E75"],
            ["Carbs & grains", grocery.carbs, "#E6F1FB", "#185FA5"],
            ["Pulses & legumes", grocery.pulses, "#FAEEDA", "#BA7517"],
            ["Fats & nuts", grocery.fats, "#EEEDFE", "#534AB7"],
            ["Supplements", grocery.supps, "#F1EFE8", "#5F5E5A"],
            ["Vegetables", grocery.veggies, "#EAF3DE", "#3B6D11"],
          ].map(([title, items, bg, color]) => (
            <div key={title} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{title}</p>
              </div>
              {items.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: "0.5px solid var(--color-border-secondary)", flexShrink: 0 }} />
                  <p style={{ fontSize: 12, margin: 0, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
