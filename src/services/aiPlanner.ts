import {
  AISettings,
  BudgetCategory,
  EventType,
  GenAIRecommendation,
  OccasionEvent,
  PriorityLevel,
  TimelinePhase,
} from '../types'
import { sanitizeInput } from './sanitizer'

// Predefined creative palettes and concepts tailored per event type
const EVENT_INSPIRATIONS: Record<
  EventType,
  {
    themes: {
      name: string
      tagline: string
      colors: { name: string; hex: string }[]
      decor: string[]
      menu: string[]
      activities: { time: string; activity: string; description: string }[]
      costSavers: string[]
      vendors: { role: string; category: BudgetCategory; estimatePct: number; tips: string }[]
      milestones: { title: string; phase: TimelinePhase; priority: PriorityLevel }[]
    }[]
  }
> = {
  wedding: {
    themes: [
      {
        name: 'Ethereal Botanical Romance',
        tagline: 'Lush greenery, candlelit intimacy, and timeless organic textures',
        colors: [
          { name: 'Sage Green', hex: '#8A9A86' },
          { name: 'Champagne Gold', hex: '#D4AF37' },
          { name: 'Warm Alabaster', hex: '#F9F6F0' },
          { name: 'Eucalyptus Gray', hex: '#5B7065' },
        ],
        decor: [
          'Suspended cascading greenery installations over dinner tables',
          'Taper candles in vintage brass holders at varied heights',
          'Handmade deckled-edge cotton paper placecards with gold wax seals',
          'Linen drape archway framed with white garden roses and olive branches',
        ],
        menu: [
          'Artisan charcuterie & honeycomb grazing table for cocktail hour',
          'Herb-crusted roasted sea bass with lemon saffron emulsion',
          'Truffled wild mushroom risotto cake with asparagus spears',
          'Pressed wildflower tiered naked sponge cake with lavender berry compote',
        ],
        activities: [
          { time: '16:00', activity: 'Acoustic Strings Ceremony', description: 'Guest seating with live cello & acoustic guitar serenades' },
          { time: '17:00', activity: 'Golden Hour Cocktail Reception', description: 'Signature cocktails: Rosemary Grapefruit Spritz & Honey Bourbon Smash' },
          { time: '18:30', activity: 'Grand Entrance & Candlelit Feast', description: 'Intimate dinner speeches and communal wine toast' },
          { time: '20:30', activity: 'First Dance & Live Band Groove', description: 'Under fairy lights with celebratory petal cannon toss' },
          { time: '22:45', activity: 'Midnight Wood-Fired Pizza Exit', description: 'Warm handheld slice favors and sparkler sendoff' },
        ],
        costSavers: [
          'Choose local in-season greenery (ruscus and eucalyptus) which offers 3x the volume of imported flowers at half the cost.',
          'Adopt family-style communal dining instead of plated multi-course to trim catering labor costs by 20%.',
          'Supply your own boutique wine if the venue permits a flat corkage fee.',
        ],
        vendors: [
          { role: 'Garden Sanctuary Venue', category: 'venue', estimatePct: 35, tips: 'Ask about package deals including tables, Chiavari chairs, and bridal suite.' },
          { role: 'Farm-to-Table Caterer', category: 'catering', estimatePct: 28, tips: 'Inquire about seasonal produce substitutions to lock lower rates.' },
          { role: 'Fine Art Photographer', category: 'photo_video', estimatePct: 12, tips: 'Book an 8-hour package instead of full-day to capture all essentials.' },
          { role: 'Bespoke Floral Designer', category: 'decor', estimatePct: 10, tips: 'Repurpose ceremony arch flowers as sweetheart table backdrop.' },
          { role: 'Live Acoustic Ensemble', category: 'entertainment', estimatePct: 8, tips: 'Negotiate duo packages that cover ceremony through cocktail hour.' },
        ],
        milestones: [
          { title: 'Finalize venue and deposit contract', phase: 'pre_planning', priority: 'high' },
          { title: 'Tasting session & beverage pairing confirmation', phase: 'middle_planning', priority: 'high' },
          { title: 'Send formal RSVPs and dietary tracking', phase: 'middle_planning', priority: 'medium' },
          { title: 'Final gown/suit fitting and accessories check', phase: 'final_prep', priority: 'high' },
          { title: 'Rehearsal walkthrough with wedding party', phase: 'week_of', priority: 'high' },
          { title: 'Hair and makeup start on schedule', phase: 'day_of', priority: 'high' },
        ],
      },
      {
        name: 'Modern Architectural Chic',
        tagline: 'Clean lines, monochromatic contrast, sculptural floristry, and urban rooftop vibes',
        colors: [
          { name: 'Onyx Black', hex: '#1C1C1E' },
          { name: 'Crisp Ivory', hex: '#FFFFFA' },
          { name: 'Brushed Copper', hex: '#B87333' },
          { name: 'Concrete Mist', hex: '#9E9E9E' },
        ],
        decor: [
          'Monochrome black metal grid structures with single-stem calla lilies',
          'Smoked glassware paired with matte black cutlery',
          'Geometric neon statement wall for photo moments',
          'Architectural uplighting accenting exposed brick and industrial pillars',
        ],
        menu: [
          'Smoked duck breast tartlets with fig reduction',
          'Sous-vide filet mignon with black truffle dauphinoise',
          'Pan-seared Chilean sea bass with miso glaze',
          'Deconstructed dark chocolate ganache dome with gold leaf',
        ],
        activities: [
          { time: '17:30', activity: 'Sunset Skyline Ceremony', description: 'Loft ceremony against panoramic twilight backdrop' },
          { time: '18:30', activity: 'Martini & Oyster Bar Social', description: 'Interactive shucking station with custom craft gin flights' },
          { time: '20:00', activity: 'Seated Architectural Dinner', description: 'Chic courses synchronized to ambient downtempo vinyl' },
          { time: '21:30', activity: 'Saxophone & DJ Mashup Party', description: 'High-energy fusion performance with synchronized strobe sticks' },
        ],
        costSavers: [
          'Lean into the industrial venue’s existing aesthetic—less drapery and minimal prop rentals needed.',
          'Feature a champagne tower pour photo moment rather than ordering an expensive massive tiered cake.',
          'Consolidate DJ, sound engineering, and uplighting under a single entertainment vendor.',
        ],
        vendors: [
          { role: 'Industrial Loft or Rooftop Venue', category: 'venue', estimatePct: 36, tips: 'Check loading dock access rules and curfew noise limits.' },
          { role: 'Contemporary Gourmet Caterer', category: 'catering', estimatePct: 30, tips: 'Confirm staffing ratio (minimum 1 server per 10 guests for plated).' },
          { role: 'Cinematic Video & Photo Team', category: 'photo_video', estimatePct: 14, tips: 'Request raw drone footage inclusion in package.' },
          { role: 'Fusion DJ & Sax Player', category: 'entertainment', estimatePct: 10, tips: 'Review custom playlist and do-not-play blacklist.' },
        ],
        milestones: [
          { title: 'Lock rooftop or gallery venue slot', phase: 'pre_planning', priority: 'high' },
          { title: 'Select custom cocktail menu and bar inventory', phase: 'middle_planning', priority: 'medium' },
          { title: 'Confirm AV and sound permit clearances', phase: 'final_prep', priority: 'high' },
          { title: 'Day-of vendor load-in supervision', phase: 'day_of', priority: 'high' },
        ],
      },
    ],
  },
  birthday: {
    themes: [
      {
        name: 'Gilded Retro Disco Fever (Milestone Edition)',
        tagline: 'Sparkling mirror balls, 70s glam, bespoke cocktails, and electric dance energy',
        colors: [
          { name: 'Metallic Silver', hex: '#C0C0C0' },
          { name: 'Electric Violet', hex: '#7C3AED' },
          { name: 'Hot Magenta', hex: '#EC4899' },
          { name: 'Disco Noir', hex: '#0F172A' },
        ],
        decor: [
          'Suspended cloud of multi-sized mirror balls with motorized rotation',
          'Shimmer tinsel photo backdrop with custom LED neon birthday sign',
          'Retro velvet lounge seating vignettes with chrome accent tables',
          'Custom customized vinyl record coasters as guest keepsakes',
        ],
        menu: [
          'Gourmet slider bar: Wagyu beef with truffle aioli & crispy hot honey chicken',
          'Retro fondue & artisan pretzel skewers',
          'Flash-frozen cocktail popsicles & edible glitter champagne flutes',
          'Retro cherry-topped tiered lambeth birthday cake',
        ],
        activities: [
          { time: '19:00', activity: 'Cocktail Hour & Vinyl Warmup', description: 'Guests arrive in retro chic attire; polaroid guestbook station' },
          { time: '20:15', activity: 'Birthday Roast & Toast Tribute', description: 'Surprise video montage and heartfelt speeches' },
          { time: '21:00', activity: 'Disco Inferno Dancefloor Open', description: 'Confetti drop as birthday anthem drops' },
          { time: '22:30', activity: 'Dessert Extravaganza & Cake Sparklers', description: 'Indoor ice sparklers cake presentation' },
        ],
        costSavers: [
          'DIY mirror ball clusters purchased in bulk online; rent just the pinspots for illumination.',
          'Set up an iPad photobooth with ring light and digital AirDrop sharing instead of costly legacy photobooths.',
          'Opt for slider & small-bites stations rather than heavy sit-down dinners to encourage dancing.',
        ],
        vendors: [
          { role: 'Lounge or Private Club Space', category: 'venue', estimatePct: 30, tips: 'Look for venues with built-in sound and mood lighting.' },
          { role: 'Modern Street-Food Caterer', category: 'catering', estimatePct: 28, tips: 'Ask for finger foods that keep guests mingling.' },
          { role: 'Retro Vinyl / Club DJ', category: 'entertainment', estimatePct: 15, tips: 'Provide favorite artist eras and must-play songs.' },
          { role: 'Photobooth & Party Photographer', category: 'photo_video', estimatePct: 12, tips: 'Book 3 hours during peak party action.' },
        ],
        milestones: [
          { title: 'Lock venue date and sound system specs', phase: 'pre_planning', priority: 'high' },
          { title: 'Order custom LED neon sign and balloon installations', phase: 'middle_planning', priority: 'medium' },
          { title: 'Finalize DJ playlist and VIP speech schedule', phase: 'final_prep', priority: 'high' },
          { title: 'Pick up bakery cake and test sparklers', phase: 'day_of', priority: 'high' },
        ],
      },
      {
        name: 'Under the Stars Cozy Garden Banquet',
        tagline: 'Warm string lights, farm harvest dinner, acoustic jams, and firepit conversations',
        colors: [
          { name: 'Terracotta', hex: '#E07A5F' },
          { name: 'Deep Olive', hex: '#3D405B' },
          { name: 'Honey Amber', hex: '#F2CC8F' },
          { name: 'Warm Cream', hex: '#F4F1DE' },
        ],
        decor: [
          'Bistro café lights strung in a canopy across courtyard trees',
          'Long wooden farm tables with burlap runners and potted herbs',
          'Cozy blanket basket and artisan marshmallow s’mores station by firepit',
          'Hand-lettered chalkboards and vintage amber glass bud vases',
        ],
        menu: [
          'Rustic wood-fired flatbreads with prosciutto, figs, and arugula',
          'Grilled rosemary lamb chops & roasted root vegetable medley',
          'Fresh burrata with heirloom tomatoes and aged balsamic',
          'Cast-iron skillet warm apple blackberry cobbler with vanilla bean gelato',
        ],
        activities: [
          { time: '17:30', activity: 'Aperitivo & Lawn Games', description: 'Cornhole, giant Jenga, and botanical spritz bar' },
          { time: '19:00', activity: 'Long-table Communal Feast', description: 'Family-style platters passed among close friends' },
          { time: '20:30', activity: 'Acoustic Guitar Singalong', description: 'Chilled campfire vibes with acoustic favorites' },
          { time: '21:45', activity: 'Gourmet S’mores & Birthday Wishes', description: 'Artisan chocolate s’mores around glowing fire pit' },
        ],
        costSavers: [
          'Host in a private backyard or scenic park pavilion with nominal permit fees.',
          'Use potted herbs (rosemary, mint, basil) as centerpieces—guests can take them home as favors!',
          'Curate a collaborative Spotify playlist on a premium portable Bluetooth PA speaker for background dinner audio.',
        ],
        vendors: [
          { role: 'Outdoor Pavilion or Backyard Space', category: 'venue', estimatePct: 20, tips: 'Ensure backup rain plan (pop-up marquee or indoor transition).' },
          { role: 'Mobile Wood-Fired Oven Caterer', category: 'catering', estimatePct: 35, tips: 'Oven on wheels creates instant live cooking entertainment.' },
          { role: 'Lawn Decor & Lighting Rental', category: 'decor', estimatePct: 15, tips: 'Rent high-lumen festoon warm string lighting.' },
          { role: 'Acoustic Soloist or Singer', category: 'entertainment', estimatePct: 15, tips: 'Book for sunset set.' },
        ],
        milestones: [
          { title: 'Reserve outdoor venue or prepare garden', phase: 'pre_planning', priority: 'high' },
          { title: 'Confirm marquee/tent weather contingency', phase: 'middle_planning', priority: 'high' },
          { title: 'Gather firepit wood, cozy blankets, and lawn games', phase: 'final_prep', priority: 'medium' },
          { title: 'Turn on string lights and firepit 30 mins before arrival', phase: 'day_of', priority: 'high' },
        ],
      },
    ],
  },
  community: {
    themes: [
      {
        name: 'Vibrant Harmony Cultural & Arts Festival',
        tagline: 'Celebrating neighborhood diversity, local creators, food trucks, and interactive unity art',
        colors: [
          { name: 'Vibrant Teal', hex: '#0D9488' },
          { name: 'Warm Ochre', hex: '#D97706' },
          { name: 'Coral Berry', hex: '#F43F5E' },
          { name: 'Deep Indigo', hex: '#312E81' },
        ],
        decor: [
          'Colorful overhead fabric ribbon canopy spanning the pedestrian plaza',
          'Community hands-on collaborative mural wall canvas for all ages',
          'Eco-friendly bamboo signage with QR code digital program maps',
          'Chalk art zones and hay-bale family seating hubs',
        ],
        menu: [
          'Curated local food truck alley (dumplings, taco fusion, falafel wraps)',
          'Local craft beverage & lemonade hydration stations',
          'Community bake sale tent with neighbor-contributed treats',
          'Zero-waste compostable serviceware throughout',
        ],
        activities: [
          { time: '10:00', activity: 'Opening Ceremony & Marching Band', description: 'Local youth brass band and welcome by neighborhood council' },
          { time: '11:30', activity: 'Maker Market & Artisan Booths Open', description: 'Over 30 local crafts, jewelry makers, and community groups' },
          { time: '13:00', activity: 'Live Cultural Dance & Music Stage', description: 'Performances by community ensembles, folklore dancers, and student bands' },
          { time: '15:00', activity: 'Youth Science & Art Workshops', description: 'Hands-on pottery wheel demo, robot building, and face painting' },
          { time: '17:30', activity: 'Sunset Community Raffle & Farewell', description: 'Announcing winners of charity raffle supporting local parks' },
        ],
        costSavers: [
          'Enlist community corporate sponsors and small businesses to sponsor stages in exchange for banners.',
          'Partner with high school volunteer honor societies for event marshaling and setup.',
          'Require food trucks to pay a flat vendor pitch fee or % donation to subsidize festival infrastructure.',
        ],
        vendors: [
          { role: 'Municipal Park or Closed Street Permit', category: 'permits_safety', estimatePct: 15, tips: 'File street closure application at least 90 days in advance.' },
          { role: 'Stage, Sound & Generator Rental', category: 'entertainment', estimatePct: 30, tips: 'Confirm decibel ordinance compliance with local police department.' },
          { role: 'Porta-Potties & Waste Management', category: 'permits_safety', estimatePct: 20, tips: 'Include ADA accessible stalls and hand sanitizing stations.' },
          { role: 'Emergency First Aid & Security Team', category: 'permits_safety', estimatePct: 15, tips: 'Required for gatherings over 250 attendees.' },
          { role: 'Wayfinding Banners & Programs', category: 'invitations_marketing', estimatePct: 10, tips: 'Use weather-resistant vinyl with grommets for reuse next year.' },
        ],
        milestones: [
          { title: 'Submit municipal event permit and noise clearance', phase: 'pre_planning', priority: 'high' },
          { title: 'Recruit community volunteers and assign zone captains', phase: 'middle_planning', priority: 'high' },
          { title: 'Confirm food truck permits and health inspections', phase: 'final_prep', priority: 'high' },
          { title: 'Distribute street closure notices to neighboring homes', phase: 'final_prep', priority: 'medium' },
          { title: 'Early morning setup: stage, power, waste cans & banners', phase: 'day_of', priority: 'high' },
        ],
      },
      {
        name: 'Neighborhood Green Fair & Garden Swap',
        tagline: 'Eco-living, native plant swaps, sustainable workshops, and farm-fresh picnics',
        colors: [
          { name: 'Forest Green', hex: '#166534' },
          { name: 'Sunflower Yellow', hex: '#CA8A04' },
          { name: 'Earthy Clay', hex: '#9A3412' },
          { name: 'Sky Cerulean', hex: '#0284C7' },
        ],
        decor: [
          'Upcycled wooden pallet furniture and picnic blankets',
          'Bunting made from recycled vintage fabric remnants',
          'Live potted native trees marking workshop zones',
          'Interactive chalkboard station for "My Green Pledge"',
        ],
        menu: [
          'Locally sourced seasonal fruit and baked goods',
          'Solar-powered smoothie blending bike station',
          'Cold brew herbal iced tea dispensers (mint, hibiscus, chamomile)',
          'Community potluck picnic style gathering',
        ],
        activities: [
          { time: '09:00', activity: 'Native Plant & Seed Exchange', description: 'Bring a cutting, take a plant—community gardener sharing' },
          { time: '10:30', activity: 'Composting & Rainwater Workshop', description: 'Master gardener demo on backyard soil health' },
          { time: '12:00', activity: 'Solar Smoothie Bike Challenge', description: 'Pedal-powered blender fun for kids and adults' },
          { time: '13:30', activity: 'Local Acoustic Troubadours', description: 'Folk and bluegrass melodies under the willow tree' },
        ],
        costSavers: [
          'Use community garden grounds free of charge with permission of trustees.',
          'Borrow PA system and folding tables from the local library or community center.',
          'Seek donations from local nurseries for giveaway seedlings.',
        ],
        vendors: [
          { role: 'Community Garden / Park Grounds', category: 'venue', estimatePct: 10, tips: 'Verify garden committee bylaws on public event hours.' },
          { role: 'Sound Equipment Rental', category: 'entertainment', estimatePct: 20, tips: 'Battery-powered PA avoids needing noisy gas generators.' },
          { role: 'Composting & Recycling Services', category: 'permits_safety', estimatePct: 25, tips: 'Request event bins with clear instructional signage.' },
          { role: 'Eco-Workshop Instructors', category: 'entertainment', estimatePct: 25, tips: 'Offer honorariums or partner with university extension services.' },
        ],
        milestones: [
          { title: 'Confirm community garden date approval', phase: 'pre_planning', priority: 'high' },
          { title: 'Publish call for workshop speakers and plant donors', phase: 'middle_planning', priority: 'medium' },
          { title: 'Finalize waste reduction and compost stations', phase: 'final_prep', priority: 'high' },
          { title: 'Morning site layout check and table placement', phase: 'day_of', priority: 'high' },
        ],
      },
    ],
  },
  custom: {
    themes: [
      {
        name: 'Curated Elegance & Modern Celebration',
        tagline: 'Tailored luxury, bespoke hospitality, and memorable sensory moments',
        colors: [
          { name: 'Deep Sapphire', hex: '#1E3A8A' },
          { name: 'Warm Copper', hex: '#D97706' },
          { name: 'Pearl Cream', hex: '#FDFBF7' },
          { name: 'Charcoal Silk', hex: '#334155' },
        ],
        decor: [
          'Statement floral installations with architectural branches',
          'Soft ambient pinspot lighting creating focal glow',
          'Custom acrylic signage with engraved metallic lettering',
          'Plush lounge seating with layered velvet and boucle cushions',
        ],
        menu: [
          'Gourmet passed hors d’oeuvres with seasonal flavor pairings',
          'Artisanal mains highlighting regional specialty ingredients',
          'Craft cocktail and zero-proof mocktail tasting bar',
          'Interactive dessert station with live chef flambe',
        ],
        activities: [
          { time: '18:00', activity: 'Welcome Cocktail & String Quartet', description: 'Sensory reception with signature aperitifs' },
          { time: '19:30', activity: 'Curated Multi-Course Dinner', description: 'Chef table introductions and commemorative toast' },
          { time: '21:00', activity: 'Live Feature Entertainment', description: 'Dynamic musical performance tailored to guest tastes' },
          { time: '22:30', activity: 'Nightcap & Bespoke Favors', description: 'Artisanal chocolate box and heartfelt farewell' },
        ],
        costSavers: [
          'Focus high-impact decor on the main focal entrance and center tables.',
          'Feature 2 high-grade signature drinks rather than a fully stocked open bar.',
          'Consolidate photography coverage to crucial program moments.',
        ],
        vendors: [
          { role: 'Private Event Venue', category: 'venue', estimatePct: 35, tips: 'Negotiate multi-hour prep time inclusion.' },
          { role: 'Premier Event Caterer', category: 'catering', estimatePct: 30, tips: 'Request sample tasting before signing.' },
          { role: 'Professional Photographer', category: 'photo_video', estimatePct: 15, tips: 'Ensure print release and digital high-res rights.' },
          { role: 'Lighting & Sound Engineer', category: 'decor', estimatePct: 10, tips: 'Ensure room acoustic tuning.' },
        ],
        milestones: [
          { title: 'Secure venue contract and insurance binder', phase: 'pre_planning', priority: 'high' },
          { title: 'Confirm guest roster and catering dietary preferences', phase: 'middle_planning', priority: 'high' },
          { title: 'Run final technical audio-visual check', phase: 'final_prep', priority: 'high' },
          { title: 'Lead event coordinator briefing with all staff', phase: 'day_of', priority: 'high' },
        ],
      },
    ],
  },
}

/**
 * Intelligent Local Offline AI Engine
 * Generates rich, highly tailored event plans and recommendations
 * even when offline or without an external API key.
 */
export function generateLocalIdeas(event: OccasionEvent, promptTopic?: string): GenAIRecommendation {
  const eventType = event.type || 'custom'
  const pool = EVENT_INSPIRATIONS[eventType] || EVENT_INSPIRATIONS.custom
  // Pick theme based on event vibe or hash
  const themeIndex = Math.abs(
    (event.title + event.vibe).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % pool.themes.length

  const baseTheme = pool.themes[themeIndex]

  // Scale vendor dollar estimates according to the targetBudget
  const budget = Math.max(1000, event.targetBudget || 5000)
  const scaledVendors = baseTheme.vendors.map((v) => ({
    role: v.role,
    category: v.category,
    estimate: Math.round((budget * (v.estimatePct / 100)) / 25) * 25,
    tips: v.tips,
  }))

  // Enrich with user specific details
  const cleanVibe = sanitizeInput(event.vibe || 'Festive and memorable')
  const cleanTopic = sanitizeInput(promptTopic || '')

  const decorCustom = [...baseTheme.decor]
  if (cleanVibe) {
    decorCustom.unshift(`Customized styling reflecting "${cleanVibe}" atmosphere`)
  }

  const tipsCustom = [...baseTheme.costSavers]
  if (event.guestCount > 100) {
    tipsCustom.push(`For ${event.guestCount} guests: Negotiate tiered buffet pricing to gain volume discounts on cutlery and staffing.`)
  } else if (event.guestCount < 30) {
    tipsCustom.push(`With ${event.guestCount} guests: Consider an intimate private dining room at a top restaurant—often requires $0 venue hire fees!`)
  }

  if (cleanTopic) {
    tipsCustom.unshift(`Specialized focus for "${cleanTopic}": prioritize high-impact touchpoints that directly match this theme.`)
  }

  return {
    themeName: baseTheme.name,
    tagline: baseTheme.tagline,
    colorPalette: baseTheme.colors,
    decorConcepts: decorCustom,
    menuIdeas: baseTheme.menu,
    entertainmentSchedule: baseTheme.activities,
    costSavingTips: tipsCustom,
    recommendedVendors: scaledVendors,
    recommendedMilestones: baseTheme.milestones,
  }
}

/**
 * Live Google Gemini API Integration
 * When a user provides a Gemini API key or sets VITE_GEMINI_API_KEY,
 * this queries Gemini 2.5 Flash for hyper-personalized event synthesis.
 */
export async function queryGeminiAI(
  event: OccasionEvent,
  settings: AISettings,
  userPrompt: string
): Promise<string> {
  const apiKey =
    settings.useCustomKey && settings.apiKey.trim()
      ? settings.apiKey.trim()
      : (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)

  if (!apiKey) {
    // Graceful offline fallback
    const offlineRec = generateLocalIdeas(event, userPrompt)
    return `### 🌟 OccasionAI Smart Plan: ${offlineRec.themeName}
*${offlineRec.tagline}*

**Color Palette:**
${offlineRec.colorPalette.map((c) => `- **${c.name}** (\`${c.hex}\`)`).join('\n')}

**Decor & Vibe Concepts:**
${offlineRec.decorConcepts.map((d) => `- ${d}`).join('\n')}

**Curated Culinary & Drink Ideas:**
${offlineRec.menuIdeas.map((m) => `- ${m}`).join('\n')}

**Schedule & Run-of-Show:**
${offlineRec.entertainmentSchedule.map((a) => `- **${a.time}** — ${a.activity}: ${a.description}`).join('\n')}

**Top Cost-Saving Tips:**
${offlineRec.costSavingTips.map((t) => `- 💡 ${t}`).join('\n')}
`
  }

  try {
    const model = settings.model || 'gemini-2.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

    const promptText = `
You are OccasionAI, an expert, creative, and highly organized event planning AI assistant.
Provide a high-quality, actionable, and inspiring event planning guide for this event:

Event Title: ${sanitizeInput(event.title)}
Event Type: ${event.type}
Target Date: ${event.date}
Guest Count: ${event.guestCount}
Vibe / Mood: ${sanitizeInput(event.vibe)}
Target Budget: ${event.currency} ${event.targetBudget}
Location: ${sanitizeInput(event.location)}

User's Specific Inquiry:
${sanitizeInput(userPrompt)}

Format your response in beautiful, scannable Markdown with sections:
1. 🎨 Theme & Decor Concept
2. 🍽️ Menu & Culinary Highlights
3. ⏱️ Timeline & Run-of-Show Milestones
4. 💰 Budget Optimization & Cost-Saving Hacks
5. 🤝 Essential Vendor Checklist & Negotiation Tips
Keep recommendations practical, specific, and creative!
`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData?.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (content) {
      return content
    }
    throw new Error('No content returned from Gemini API')
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    // Fall back to rich local synthesis on network/API failure
    const fallback = generateLocalIdeas(event, userPrompt)
    return `> ℹ️ *Note: Gemini API unavailable (${sanitizeInput(errorMsg)}). Switched seamlessly to OccasionAI Built-in Engine.*\n\n### 🌟 ${fallback.themeName}\n*${fallback.tagline}*\n\n**Decor & Mood:**\n${fallback.decorConcepts.map((d) => `- ${d}`).join('\n')}\n\n**Culinary Highlights:**\n${fallback.menuIdeas.map((m) => `- ${m}`).join('\n')}\n\n**Cost-Saving Tips:**\n${fallback.costSavingTips.map((t) => `- 💡 ${t}`).join('\n')}`
  }
}
