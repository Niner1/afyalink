// Mock data for the CLIENT PORTAL
export const currentClient = {
  id: 'CLT-001',
  fullName: 'Amara Osei',
  email: 'amara.osei@gmail.com',
  phone: '+254 712 345 678',
  dob: '1988-04-15',
  age: 36,
  gender: 'Female',
  address: 'Westlands, Nairobi',
  dietitian: 'Dr. Wanjiku Kariuki',
  memberSince: '2024-01-10',
  profileComplete: 85,
};

export const portalAppointments = [
  { id:'APT-001', date:'2025-05-22', time:'09:00', type:'Follow-up', mode:'In-Person', status:'Confirmed', dietitian:'Dr. Wanjiku Kariuki', notes:'Review blood sugar trends and adjust plan', location:'AFyalink Clinic, Westlands' },
  { id:'APT-002', date:'2025-06-05', time:'10:00', type:'Follow-up', mode:'Telehealth', status:'Scheduled', dietitian:'Dr. Wanjiku Kariuki', notes:'', location:'Online (Zoom link sent via email)' },
  { id:'APT-003', date:'2025-04-28', time:'09:00', type:'Follow-up', mode:'In-Person', status:'Completed', dietitian:'Dr. Wanjiku Kariuki', notes:'Good progress. Weight down 1kg.', location:'AFyalink Clinic, Westlands' },
  { id:'APT-004', date:'2025-03-15', time:'09:00', type:'Follow-up', mode:'In-Person', status:'Completed', dietitian:'Dr. Wanjiku Kariuki', notes:'Meal plan adjusted. Encouraged vegetable intake.', location:'AFyalink Clinic, Westlands' },
];

export const portalCarePlan = {
  diagnosis: 'Excessive energy intake and poor glycemic control',
  prescription: '1600 kcal/day · Low GI carbs (45–50%) · Protein 25% · Fat 30% · 3 meals + 2 snacks',
  goals: [
    { id:1, goal:'Reduce body weight by 0.5 kg/week', status:'In Progress', target:'2025-07-01', progress:60 },
    { id:2, goal:'Achieve fasting blood sugar < 7.0 mmol/L', status:'In Progress', target:'2025-06-01', progress:45 },
    { id:3, goal:'Increase vegetable intake to 3 servings/day', status:'Achieved', target:'2025-03-01', progress:100 },
    { id:4, goal:'Walk 30 min daily, 5x/week', status:'Not Started', target:'2025-06-15', progress:0 },
  ],
  mealPlan: {
    breakfast: ['2 eggs (boiled/scrambled)', '1 slice whole grain bread', '½ avocado', 'Green tea (no sugar)'],
    lunch: ['1 cup brown rice or 1 medium sweet potato', '100g grilled chicken or fish', 'Large vegetable salad with olive oil', 'Water or lemon water'],
    dinner: ['100g lean protein (fish, chicken, legumes)', '½ cup beans or lentils', 'Steamed vegetables (unlimited)', 'Clear soup'],
    snacks: ['Morning: 1 fruit + small handful nuts', 'Afternoon: Low-fat yoghurt or carrot sticks'],
  },
  foods: {
    encouraged: ['Whole grains (brown rice, oats)', 'Vegetables (all types)', 'Lean proteins (fish, chicken, eggs)', 'Legumes (beans, lentils)', 'Healthy fats (avocado, olive oil)', 'Low-GI fruits (berries, apples)'],
    limit: ['Refined carbs (white rice, white bread)', 'Sugary drinks (soda, juice)', 'Fried foods', 'Processed snacks (biscuits, crisps)', 'High-fat red meat'],
    avoid: ['Sugary beverages', 'Fast food', 'Alcohol (discuss with dietitian)', 'High-sugar desserts'],
  },
};

export const portalProgress = {
  weightHistory: [
    { date:'Jan 2024', weight:91 },{ date:'Mar 2024', weight:89 },
    { date:'Jun 2024', weight:87 },{ date:'Sep 2024', weight:85 },
    { date:'Jan 2025', weight:86 },{ date:'Apr 2025', weight:84 },
  ],
  bloodSugar: [
    { date:'Jan 2024', value:8.2 },{ date:'Mar 2024', value:7.9 },
    { date:'Jun 2024', value:7.6 },{ date:'Sep 2024', value:7.5 },
    { date:'Jan 2025', value:7.5 },{ date:'Apr 2025', value:7.4 },
  ],
  stats: { startWeight:91, currentWeight:84, targetWeight:74, weightLost:7, bmi:32.0, bloodSugar:7.4 },
};

export const portalBilling = [
  { id:'INV-2025-001', date:'2025-04-28', description:'Nutrition Assessment & Meal Plan Development', total:5500, paid:3000, outstanding:2500, status:'Partial', method:'M-Pesa' },
  { id:'INV-2024-008', date:'2024-09-10', description:'Follow-up Consultation', total:2500, paid:2500, outstanding:0, status:'Paid', method:'M-Pesa' },
  { id:'INV-2024-005', date:'2024-06-20', description:'Follow-up Consultation + Meal Plan Update', total:4000, paid:4000, outstanding:0, status:'Paid', method:'Cash' },
];

export const portalMessages = [
  { id:1, from:'Dr. Wanjiku Kariuki', fromRole:'dietitian', message:"Hi Amara! Great to see your weight is trending down. Keep up the good work with your meal plan. Remember to focus on breakfast — it sets your blood sugar for the whole day.", time:'2025-05-16 14:30', read:true },
  { id:2, from:'Amara Osei', fromRole:'client', message:"Thank you doctor! I have been trying to eat breakfast every day. It's getting easier. I still struggle with evening snacking though.", time:'2025-05-16 15:02', read:true },
  { id:3, from:'Dr. Wanjiku Kariuki', fromRole:'dietitian', message:"That's completely normal! For evening snacking, try keeping cut carrots or cucumber in the fridge. Also, drinking water first sometimes helps curb the craving. See you on the 22nd!", time:'2025-05-16 15:20', read:false },
  { id:4, from:'AFyalink System', fromRole:'system', message:"Appointment reminder: You have an appointment on May 22 at 09:00 AM. Please fast for 8 hours before your blood sugar test.", time:'2025-05-17 08:00', read:false },
];

export const healthTips = [
  { id:1, title:'Plate Method for Diabetes', category:'Nutrition', time:'3 min read', content:'Fill half your plate with non-starchy vegetables, one quarter with lean protein, and one quarter with whole grains. This simple method helps manage blood sugar effectively.' },
  { id:2, title:'Best Low-GI Breakfast Ideas', category:'Meal Ideas', time:'4 min read', content:'Starting your day with oats, eggs, or whole grain bread paired with protein prevents blood sugar spikes. Avoid cereals, juice, and white bread in the morning.' },
  { id:3, title:'Exercise & Blood Sugar Control', category:'Lifestyle', time:'5 min read', content:'Even a 30-minute walk after meals can significantly reduce post-meal blood sugar. Start with 10-minute walks and gradually increase.' },
  { id:4, title:'Hydration & Weight Loss', category:'Wellness', time:'2 min read', content:'Drinking 2–3 litres of water daily supports weight loss and blood sugar management. Try adding lemon slices or cucumber for flavour.' },
];
