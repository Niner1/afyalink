import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'Grace Akinyi — weight trending critically low', time: '2m ago', read: false },
    { id: 2, type: 'appointment', message: 'Appointment in 30 mins: Samuel Kimura (14:00)', time: '28m ago', read: false },
    { id: 3, type: 'payment', message: 'Payment received: KES 2,500 from James Mwangi', time: '1h ago', read: true },
    { id: 4, type: 'message', message: 'New reply from Amara Osei via WhatsApp', time: '2h ago', read: true },
  ]);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "Hello! I'm NutriAI, your intelligent clinical assistant. I can help you analyze patient data, suggest dietary interventions, calculate nutritional requirements, draft care plans, and provide evidence-based recommendations. How can I assist you today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  const simulateAiResponse = async (userMessage) => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    
    let response = '';
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('bmi') || msg.includes('weight')) {
      response = "Based on the client's current data:\n\n**BMI Calculation:** Weight ÷ Height² (kg/m²)\n\nFor Amara Osei: 84kg ÷ 1.62² = **32.0 kg/m²** → Obese Class I\n\n**Clinical Recommendation:** Target 0.5–1 kg/week weight loss through:\n- 500–750 kcal daily deficit\n- Low glycemic index foods\n- Increased fiber intake (25–35g/day)\n- Protein at 1.2–1.5g/kg ideal body weight\n\nWould you like me to calculate a detailed meal plan?";
    } else if (msg.includes('grace') || msg.includes('cancer') || msg.includes('malnut')) {
      response = "**Clinical Nutrition Alert — Grace Akinyi (CLT-005)**\n\nPatient presents with cancer-related cachexia. Key concerns:\n\n⚠️ **Weight trend:** -10kg over 12 months (critical)\n\n**Evidence-Based Recommendations:**\n1. Increase ONS to 3×/day (Ensure Plus or Fortisip)\n2. Add omega-3 supplementation (2-4g EPA/day) — shown to preserve lean mass in cancer\n3. Consider appetite stimulant review with oncologist\n4. Protein target: 1.5–2.0g/kg/day\n\n**Red Flags to Monitor:** dysphagia, aspiration risk, GI complications\n\nShall I draft a revised care plan note?";
    } else if (msg.includes('diabetes') || msg.includes('blood sugar') || msg.includes('glyc')) {
      response = "**Diabetes Nutrition Management Protocol**\n\nFor clients with T2DM, recommended approach:\n\n📊 **Macronutrient Targets:**\n- Carbohydrates: 45–60g per meal (low GI choices)\n- Protein: 20–30% of total energy\n- Fat: Focus on mono/polyunsaturated\n\n🥦 **Meal Planning Strategy:**\n- Plate method: ½ non-starchy veg, ¼ lean protein, ¼ whole grains\n- Consistent carb distribution across meals\n- Avoid sugary beverages\n\n📉 **Target Outcomes:**\n- HbA1c < 7.0%\n- Fasting glucose 4.4–7.2 mmol/L\n- Post-meal glucose < 10 mmol/L\n\nWant me to generate a sample 7-day meal plan?";
    } else if (msg.includes('meal plan') || msg.includes('diet prescription')) {
      response = "I can help draft a meal plan. Here's a sample **1-day template for 1600 kcal (Diabetic/Weight Loss)**:\n\n🌅 **Breakfast (350 kcal)**\n- 2 eggs (any style, no frying)\n- 1 slice whole grain bread\n- ½ avocado\n- Green tea (no sugar)\n\n🌞 **Lunch (450 kcal)**\n- 1 cup brown rice or 1 medium sweet potato\n- 100g grilled chicken/fish\n- Large salad with olive oil dressing\n- Water\n\n🌆 **Dinner (400 kcal)**\n- 100g lean protein\n- ½ cup legumes\n- Steamed vegetables (unlimited)\n\n🍎 **Snacks 2× (200 kcal total)**\n- Fruit + small handful nuts\n\nShall I customize this for a specific client?";
    } else if (msg.includes('amara')) {
      response = "**Client Summary: Amara Osei (CLT-001)**\n\n📈 **Progress:** Excellent — down 7kg from baseline (91kg → 84kg)\n\n✅ **Goal Status:**\n- Vegetable intake: ACHIEVED\n- Weight reduction: In Progress (on track)\n- Blood sugar: Improving (7.4 → target <7.0)\n\n⚠️ **Areas of Concern:**\n- Physical activity goal not yet started\n- Outstanding balance: KES 2,500\n\n💡 **AI Recommendation:** Consider introducing a walking app or step counter to motivate the physical activity goal. Behavioral change tools improve adherence by 34% (evidence-based).\n\nNext appointment: May 22, 2025";
    } else if (msg.includes('report') || msg.includes('analytics')) {
      response = "**Monthly Performance Summary — May 2025**\n\n📊 **Key Metrics:**\n- Active clients: 24 (+9% MoM)\n- Revenue MTD: KES 98,000\n- Client retention rate: 78%\n- Follow-up adherence: 65%\n\n📈 **Trends:**\n- New client registrations up 15% vs last month\n- Obesity/Overweight remains top diagnosis (38%)\n- Outstanding balances: KES 7,000 (3 clients)\n\n💡 **Recommendations:**\n1. Follow up with Daniel Njoroge — 3-month lapse\n2. Send payment reminders for 3 outstanding accounts\n3. Consider group nutrition workshops to improve retention\n\nWould you like a detailed PDF report?";
    } else {
      response = "I can assist you with:\n\n🔬 **Clinical Support**\n- Nutritional requirement calculations\n- BMI and risk classification\n- Evidence-based dietary interventions\n- Care plan suggestions\n\n📊 **Data Analysis**\n- Client progress summaries\n- Trend identification\n- Lab value interpretation\n\n📝 **Documentation**\n- Assessment notes drafting\n- Care plan templates\n- Follow-up message drafting\n\nTry asking me: *\"Calculate energy needs for a 45-year-old female, 65kg, sedentary\"* or *\"What's the nutrition protocol for iron deficiency anemia?\"*";
    }
    
    setAiLoading(false);
    return response;
  };

  const sendAiMessage = async (message) => {
    const userMsg = { role: 'user', content: message };
    setAiMessages(prev => [...prev, userMsg]);
    const response = await simulateAiResponse(message);
    setAiMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      selectedClient, setSelectedClient,
      sidebarOpen, setSidebarOpen,
      notifications, markAllRead, unreadCount,
      aiAssistantOpen, setAiAssistantOpen,
      aiMessages, sendAiMessage, aiLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
