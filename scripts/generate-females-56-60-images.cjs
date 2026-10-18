/**
 * Generator script for Female Seed Portraits 56 - 60
 * Strict Demographic: Ages 18 - 23 (Pakistani Matrimony Generator Human Touch v3.5 Standard)
 * 
 * Once the API image capacity quota resets, this script can be executed or used to generate
 * the native portraits directly.
 */

const prompts = [
  {
    id: 56,
    name: 'Zoya Rehman',
    age: 23,
    city: 'Lahore',
    prompt: `A stylish, candid portrait of a 23-year-old Pakistani woman from Lahore, junior architect from NCA Lahore. Fair luminous complexion, friendly intelligent brown eyes, warm natural smile. Wearing a neatly styled muted dust-taupe chiffon hijab, paired with a modern beige linen long tunic and straight-cut trousers. She is seated at an outdoor cafe patio in Gulberg Lahore, leaning slightly forward with one hand resting on the wooden table next to a small iced coffee glass. Natural daylight under a canvas umbrella, soft realistic outdoor lighting, visible textile weave on the hijab and tunic, subtle natural skin texture with natural soft pores. Shot on smartphone portrait mode, candid and approachable, zero plastic AI rendering, unblurred, elegant and modest matrimonial portrait.`
  },
  {
    id: 57,
    name: 'Malaika Jahangir',
    age: 22,
    city: 'Karachi',
    prompt: `A candid lifestyle photograph of a fair-complexioned, graceful 22-year-old Pakistani finance graduate from Karachi. She has youthful radiant features, expressive dark brown eyes with soft natural kajal, and a genuine relaxed smile. She is standing in a three-quarter side pose at a 45-degree angle, leaning one shoulder casually against a modern textured stucco wall on a residential terrace overlooking greenery in DHA Phase 6 Karachi. Wearing a contemporary pastel sage-green linen co-ord set with straight pants, lightweight white chiffon dupatta draped over one shoulder, and a dainty silver wristwatch. Natural afternoon daylight casting soft realistic shadows, natural stray flyaway hair strands caught in the gentle breeze, authentic youthful skin texture. Shot on iPhone 15 Pro 48mm lens, unedited candid snapshot, realistic fabric texture, sharp facial detail, 100% human realism.`
  },
  {
    id: 58,
    name: 'Sehar Batool',
    age: 21,
    city: 'Peshawar',
    prompt: `A candid lifestyle photo of a fair-skinned, charming 21-year-old Pashtun woman from Peshawar, BS Artificial Intelligence student. Youthful glowing complexion, natural candid smile, beautiful dark hair falling naturally over her shoulders with soft flyaway wisps. She is seated comfortably in the passenger seat of a clean modern sedan car with bright morning daylight pouring through the window in Hayatabad Peshawar, holding a notebook, friendly candid expression. Wearing a stylish contemporary lavender cotton kurti with white cigarette pants and a light printed lawn dupatta. Natural morning sunlight, realistic car interior reflections, sharp facial detail, zero CGI airbrushing, unblurred, authentic matrimonial photo.`
  },
  {
    id: 59,
    name: 'Hiba Waqar',
    age: 20,
    city: 'Faisalabad',
    prompt: `A heartwarming candid photo of a 20-year-old Pakistani interior design student from Faisalabad. Fair complexion, radiant approachable smile, delicate pearl stud earrings, youthful fresh-faced beauty. Seated comfortably curled in a mid-century modern wooden armchair in a tastefully decorated Pakistani drawing room in Kohinoor City Faisalabad, holding a ceramic chai cup with both hands. Wearing a dusty-lilac and white embroidered cotton outfit with straight trousers. Natural morning window light streaming from the side, real living room background with wooden bookshelf and indoor leafy monstera plant. Shot on iPhone, realistic domestic candid portrait, authentic room lighting and natural shadows, sharp facial features, unblurred, 100% human realism.`
  },
  {
    id: 60,
    name: 'Eshal Fatima',
    age: 19,
    city: 'Multan',
    prompt: `A natural candid portrait of a 19-year-old Pakistani English literature student from Multan. Fair complexion with a warm peachy glow, soft candid laugh, expressive hazel-brown eyes, neat youthful appearance with subtle tinted lip balm. She is leaning her forearms against the dark wrought-iron railing of a scenic veranda garden overlooking green mango trees in Cantt Multan at golden hour. Wearing an elegant ivory and pastel-peach lawn shirt with minimal white lace accents, matching chiffon dupatta draped over her shoulders. Warm golden sunset sunlight illuminating her face, natural flyaway hair caught in gentle wind, authentic youthful skin texture. Shot on 50mm lens f/2.8, unedited candid snapshot, genuine human warmth, sharp focus on eyes, no plastic AI gloss, completely photorealistic.`
  }
];

console.log('Calibrated Prompts for Female Seeds 56 - 60:');
prompts.forEach(p => {
  console.log(`\n--- Seed ${p.id}: ${p.name} (${p.city}, Age ${p.age}) ---`);
  console.log(p.prompt);
});

module.exports = { prompts };
