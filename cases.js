/**
 * ============================================================================
 * MYSTERBOX CASE COLLECTION (4 OFFICIAL CASES + DEMO CASE)
 * ============================================================================
 * Structured database of cases, suspects, clues, evidence, timelines,
 * and final accusation criteria.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MysteryCases = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var CASES = {
    // ========================================================================
    // CASE 01: DEATH AT ROOM 309
    // ========================================================================
    case1: {
      id: 'case1',
      number: '01',
      title: 'Death at Room 309',
      badge: 'CASE 01 • LOCKED-ROOM MYSTERY',
      difficulty: 'Easy',
      genre: 'Locked-room murder mystery',
      playtime: '20–30 minutes',
      mechanic: 'Timeline reconstruction',
      scene: 'Grand Sovereign Hotel, Room 309',
      incidentWindow: '11:00 PM – 12:00 AM',
      briefing: 'A wealthy businessman, Arthur Vance, is discovered dead inside his luxury hotel room. The heavy oak door is deadbolted from the inside, the balcony windows are sealed with security latches, and front desk records show no authorized entry after 10:00 PM. Yet, Arthur was poisoned and his safe was cleaned out.',
      objective: 'Discover how the murderer entered and escaped the sealed room, expose the forged timeline, and identify the culprit.',
      culpritId: 'victor',
      culpritName: 'Victor Hayes (Hotel Manager)',
      solutionSummary: 'Victor Hayes, the hotel manager, used the service elevator to access the 3rd floor during a staged 7-minute CCTV blackout. Using a master keycard encoded at 6:15 PM, he entered Room 309 at 11:38 PM, poisoned Arthur Vance, threw Vance\'s watch against the floor at 11:42 PM to create a false time of death, slipped the bolt latch using a maintenance shim, and slipped back down.',
      
      suspects: [
        {
          id: 'victor',
          name: 'Victor Hayes',
          role: 'Hotel Manager',
          avatarIcon: '🏨',
          suspicionLevel: 'CRITICAL',
          suspicionPercent: 95,
          statedAlibi: 'Claims he was in the ground floor management office reviewing shift logs continuously from 11:00 PM to midnight.',
          contradiction: 'The CCTV system suffered a manual power interruption at 11:35 PM originating from inside the manager\'s breaker panel.',
          motive: 'Arthur Vance had discovered Victor was embezzling hotel luxury suite deposits and threatened police exposure that evening.',
          evidenceAgainst: [
            'Created an unassigned master keycard at 6:15 PM',
            'Dispatched a false housekeeping call to clear the 3rd floor at 11:30 PM',
            'Manually cut power to corridor CCTV for 7 minutes (11:35–11:42 PM)'
          ],
          isCulprit: true
        },
        {
          id: 'adrian',
          name: 'Adrian Cole',
          role: 'Business Partner',
          avatarIcon: '💼',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Argued with Vance in the lounge at 10:15 PM, but took a verified taxi to the airport hotel at 10:45 PM.',
          contradiction: 'None. City taxi GPS records and lobby turnstile confirm his departure at 10:45 PM.',
          motive: 'Contract buyout dispute involving their joint real estate ventures.',
          evidenceAgainst: ['Had an argument earlier in the evening, but left the premises before the incident window.'],
          isCulprit: false
        },
        {
          id: 'elena',
          name: 'Elena Morris',
          role: 'Personal Assistant',
          avatarIcon: '👩‍💼',
          suspicionLevel: 'LOW',
          suspicionPercent: 15,
          statedAlibi: 'Delivered tea to Vance at 11:10 PM, then retired to her suite on the 2nd floor.',
          contradiction: 'None. Corridor camera logs her entering her 2nd-floor room at 11:18 PM with no subsequent exit.',
          motive: 'Was named as a minor beneficiary in Vance\'s corporate insurance policy.',
          evidenceAgainst: ['Delivered tea, but forensics show the toxic substance was added much later.'],
          isCulprit: false
        },
        {
          id: 'sophia',
          name: 'Sophia Reed',
          role: 'Estranged Daughter',
          avatarIcon: '👩',
          suspicionLevel: 'LOW',
          suspicionPercent: 25,
          statedAlibi: 'Was driving in from the state capital; did not arrive at the hotel until 12:15 AM.',
          contradiction: 'None. Highway toll plaza timestamps verify she crossed the interstate bridge at 11:50 PM.',
          motive: 'Had been threatened with disinheritance in Vance\'s revised will.',
          evidenceAgainst: ['Was miles away on the highway during the murder.'],
          isCulprit: false
        }
      ],

      clues: [
        {
          id: 1,
          code: 'RM309-1',
          title: 'Electronic Access Log',
          time: '11:38 PM',
          question: 'What time was the second unauthorized keycard swipe recorded at Room 309?',
          answers: ['11:38 pm', '11:38pm', '11:38'],
          hint: 'Examine the electronic door latch database for any late-night card entry after 11:00 PM.',
          evidenceId: 'ev_c1_access',
          description: 'The electronic lock registered an override keycard swipe at 11:38 PM, opening the deadbolt.'
        },
        {
          id: 2,
          code: 'RM309-2',
          title: 'Broken Wristwatch',
          time: '11:42 PM',
          question: 'What time was displayed on Arthur Vance\'s damaged wristwatch?',
          answers: ['11:42 pm', '11:42pm', '11:42'],
          hint: 'The luxury Swiss watch stopped abruptly when smashed against the hardwood floor.',
          evidenceId: 'ev_c1_watch',
          description: 'A broken wristwatch recovered beside the body stopped precisely at 11:42 PM.'
        },
        {
          id: 3,
          code: 'RM309-3',
          title: 'Housekeeping Request',
          time: '11:30 PM',
          question: 'Who dispatched the unusual housekeeping diversion from the front desk?',
          answers: ['victor', 'victor hayes', 'manager'],
          hint: 'A phone call sent the 3rd-floor cleaning staff down to the laundry room right before the murder.',
          evidenceId: 'ev_c1_housekeeping',
          description: 'At 11:30 PM, Victor Hayes ordered all 3rd-floor staff to report to the basement for an urgent inventory check.'
        },
        {
          id: 4,
          code: 'RM309-4',
          title: 'Duplicate Keycard Record',
          time: '6:15 PM',
          question: 'Whose manager authorization code created the duplicate master card at 6:15 PM?',
          answers: ['victor', 'victor hayes', 'hayes'],
          hint: 'The key encoder machine logs the staff ID used whenever a master key is generated.',
          evidenceId: 'ev_c1_duplicate',
          description: 'Encoder logs show an unassigned master key was produced under Manager Authorization code #VH-01.'
        },
        {
          id: 5,
          code: 'RM309-5',
          title: 'CCTV Gap',
          time: '11:35 PM – 11:42 PM',
          question: 'Who is the culprit behind the locked-room murder of Arthur Vance?',
          answers: ['victor', 'victor hayes'],
          hint: 'Only one person had manager access to the breaker room, encoded the key, and diverted staff.',
          evidenceId: 'ev_c1_cctv',
          description: 'A 7-minute power interruption blinded the 3rd-floor corridor camera, during which Victor entered Room 309.'
        }
      ],

      evidence: [
        {
          id: 'ev_c1_access',
          clueId: 1,
          title: 'Room 309 Keycard Audit Trail',
          category: 'Digital Record',
          icon: '💳',
          timestamp: '11:38 PM',
          location: '3rd Floor Hallway',
          status: 'Recorded',
          summary: 'Master electronic key swiped at 11:38 PM, unlocking Room 309.',
          forensics: 'RFID signature matches Master Card #02, encoded earlier that evening without guest registration.',
          suspectLink: 'Traced to Victor Hayes\'s authorization.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><rect x="15" y="15" width="90" height="50" rx="4" fill="#ecf0f1"/><text x="25" y="45" fill="#c0392b" font-family="monospace" font-size="9">SWIPE: 23:38</text></svg>'
        },
        {
          id: 'ev_c1_watch',
          clueId: 2,
          title: 'Victim\'s Fractured Chronometer',
          category: 'Physical Evidence',
          icon: '⌚',
          timestamp: '11:42 PM',
          location: 'Beside Nightstand',
          status: 'Recovered',
          summary: 'Watch stopped at 11:42 PM due to forceful impact.',
          forensics: 'Impact angle shows the watch was intentionally smashed against the dresser corner to stage an exact time.',
          suspectLink: 'Used by the killer to anchor a falsified timeline.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1e272e"/><circle cx="60" cy="40" r="22" fill="#fff" stroke="#bdc3c7" stroke-width="3"/><line x1="60" y1="40" x2="60" y2="25" stroke="#2c3e50" stroke-width="2"/><line x1="60" y1="40" x2="75" y2="40" stroke="#e74c3c" stroke-width="2"/></svg>'
        },
        {
          id: 'ev_c1_housekeeping',
          clueId: 3,
          title: 'Internal PBX Diversion Log',
          category: 'Official Record',
          icon: '📞',
          timestamp: '11:30 PM',
          location: 'Front Desk Switchboard',
          status: 'Verified',
          summary: 'Housekeeping staff ordered away from 3rd floor at 11:30 PM.',
          forensics: 'Internal call placed from extension 100 (Executive Office) directly into staff breakroom.',
          suspectLink: 'Placed by Victor Hayes.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#34495e"/><rect x="25" y="20" width="70" height="40" rx="4" fill="#ecf0f1"/><text x="35" y="44" fill="#2c3e50" font-family="sans-serif" font-size="8">DIVERSION: 23:30</text></svg>'
        },
        {
          id: 'ev_c1_duplicate',
          clueId: 4,
          title: 'Keycard Encoder Transaction #84',
          category: 'Digital Forensic',
          icon: '🔑',
          timestamp: '6:15 PM',
          location: 'Security Administration Desk',
          status: 'Extracted',
          summary: 'Master keycard generated without logging a guest account.',
          forensics: 'Authenticated with Victor Hayes\'s biometric credential at 6:15 PM.',
          suspectLink: 'Direct proof Victor prepared the murder tool in advance.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#16a085"/><rect x="20" y="20" width="80" height="40" fill="#fff" rx="4"/><text x="30" y="44" fill="#c0392b" font-family="monospace" font-size="8">KEY #VH-01</text></svg>'
        },
        {
          id: 'ev_c1_cctv',
          clueId: 5,
          title: 'Corridor CCTV Blackout Segment',
          category: 'Surveillance',
          icon: '🎥',
          timestamp: '11:35 PM – 11:42 PM',
          location: 'Circuit Breaker Room B',
          status: 'Confirmed',
          summary: '7-minute camera signal blackout covering 3rd floor.',
          forensics: 'Physical switch on breaker #3 pulled down manually and reset after 7 minutes.',
          suspectLink: 'Only Victor Hayes held keys to breaker room B.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#000"/><text x="25" y="45" fill="#e74c3c" font-family="monospace" font-size="9">NO SIGNAL [7m]</text></svg>'
        }
      ],

      timeline: [
        { time: '18:15', timeLabel: '6:15 PM', title: 'Master Keycard Encoded', type: 'verified', location: 'Hotel Admin Desk', description: 'Victor Hayes creates an unlogged master override keycard using his administrative code.' },
        { time: '22:15', timeLabel: '10:15 PM', title: 'Argument in Lounge', type: 'verified', location: 'Hotel Lounge', description: 'Adrian Cole and Arthur Vance disagree over business contracts before Adrian departs.' },
        { time: '22:45', timeLabel: '10:45 PM', title: 'Adrian Cole Departs', type: 'verified', location: 'Main Entrance', description: 'Adrian takes an airport taxi; his departure is corroborated by taxi receipt.' },
        { time: '23:10', timeLabel: '11:10 PM', title: 'Elena Delivers Tea', type: 'verified', location: 'Room 309', description: 'Elena Morris delivers evening tea and leaves Vance alone reading documents.' },
        { time: '23:30', timeLabel: '11:30 PM', title: 'Housekeeping Diversion', type: 'contradiction', location: '3rd Floor', description: 'Victor phones cleaning staff with a false emergency to clear the hallway.' },
        { time: '23:35', timeLabel: '11:35 PM', title: 'CCTV Power Cut', type: 'contradiction', location: 'Breaker Room B', description: 'Manager flips circuit breaker #3, blinding hallway camera for 7 minutes.' },
        { time: '23:38', timeLabel: '11:38 PM', title: 'Master Card Swiped into Room 309', type: 'contradiction', location: 'Room 309', description: 'The killer enters the room, poisons Vance, and stages the deadbolt mechanism.' },
        { time: '23:42', timeLabel: '11:42 PM', title: 'Watch Smashed & Killer Flees', type: 'verified', location: 'Room 309', description: 'Watch smashed on floor; killer slips door latch shut and exits via fire stairs.' }
      ],

      corkboardNodes: [
        { id: 'c1_n_victor', type: 'suspect', title: 'Victor Hayes (Manager)', x: 180, y: 150, icon: '🏨', color: '#c0392b' },
        { id: 'c1_n_card', type: 'evidence', title: 'Master Card #VH-01', x: 440, y: 90, icon: '💳', color: '#f39c12' },
        { id: 'c1_n_cctv', type: 'evidence', title: '7-Min CCTV Blackout', x: 480, y: 230, icon: '🎥', color: '#2980b9' },
        { id: 'c1_n_call', type: 'evidence', title: 'Staff Diversion Call', x: 160, y: 320, icon: '📞', color: '#27ae60' },
        { id: 'c1_n_watch', type: 'evidence', title: 'Staged Watch (11:42 PM)', x: 720, y: 160, icon: '⌚', color: '#8e44ad' }
      ],
      corkboardLinks: [
        { from: 'c1_n_victor', to: 'c1_n_card', label: 'Encoded master key' },
        { from: 'c1_n_victor', to: 'c1_n_cctv', label: 'Cut breaker power' },
        { from: 'c1_n_victor', to: 'c1_n_call', label: 'Diverted housekeeping' },
        { from: 'c1_n_cctv', to: 'c1_n_watch', label: 'Committed during blackout' }
      ]
    },

    // ========================================================================
    // CASE 02: THE LAST AUCTION
    // ========================================================================
    case2: {
      id: 'case2',
      number: '02',
      title: 'The Last Auction',
      badge: 'CASE 02 • HIGH-VALUE HEIST',
      difficulty: 'Medium',
      genre: 'High-value theft investigation',
      playtime: '30–40 minutes',
      mechanic: 'Evidence comparison',
      scene: 'Belgrave Gallery, Private Salon',
      incidentWindow: '9:00 PM – 10:00 PM',
      briefing: 'During an ultra-exclusive auction of royal jewels, the 120-carat "Star of Alexandria" diamond vanished from its hermetically sealed glass pedestal during a 15-second lighting flicker at 9:28 PM. Every attendee was searched, and guards sealed all exits. The diamond seemed to have dematerialized into thin air.',
      objective: 'Compare forensic statements, find the modified paperwork, locate the hiding spot, and apprehend the thief.',
      culpritId: 'rachel',
      culpritName: 'Rachel Stone (Event Photographer)',
      solutionSummary: 'Rachel Stone, the event photographer, used an acoustic glass cutter disguised inside her camera telephoto lens hood. Her high-voltage external camera strobe overloaded the gallery dimmer circuit at 9:28 PM. During the dark flash, she swapped the stone for a cubic zirconia replica and unscrewed her 400mm lens barrel to stash the genuine diamond inside.',

      suspects: [
        {
          id: 'rachel',
          name: 'Rachel Stone',
          role: 'Event Photographer',
          avatarIcon: '📷',
          suspicionLevel: 'CRITICAL',
          suspicionPercent: 92,
          statedAlibi: 'Was standing near the media riser taking crowd reaction photographs throughout the entire bidding sequence.',
          contradiction: 'Her camera flash capacitor drew 240V from the dimmer rail at 9:28 PM, causing the blackout. The reflection in a guest\'s glass proves she was at the pedestal.',
          motive: 'Hired by an overseas private collector; promised 4 million Euros for the untraceable extraction.',
          evidenceAgainst: [
            'Assigned VIP Pass #7 giving unrestricted perimeter access',
            'Her telephoto lens barrel was modified with an internal hollow velvet chamber',
            'Photo reflection captures her opening the case glass'
          ],
          isCulprit: true
        },
        {
          id: 'marcus',
          name: 'Marcus Vale',
          role: 'Auctioneer',
          avatarIcon: '🔨',
          suspicionLevel: 'LOW',
          suspicionPercent: 15,
          statedAlibi: 'Was at the central podium on live microphone speaking to telephone bidders when lights dropped.',
          contradiction: 'None. Audio recording captures his continuous spoken commentary before, during, and after the flicker.',
          motive: 'Earned 10% commission on a successful sale; had every incentive for the legitimate sale to proceed.',
          evidenceAgainst: ['Was continuously observed by all 40 guests on the elevated podium.'],
          isCulprit: false
        },
        {
          id: 'isabella',
          name: 'Isabella Cross',
          role: 'Billionaire Collector',
          avatarIcon: '💎',
          suspicionLevel: 'LOW',
          suspicionPercent: 25,
          statedAlibi: 'Seated in front row, bid up to $18 million before being outbid by telephone.',
          contradiction: 'None. Was subjected to thorough metal detector and handbag search by security.',
          motive: 'Desperately wanted the diamond for her private Geneva collection.',
          evidenceAgainst: ['Searched twice; zero contraband or tools discovered.'],
          isCulprit: false
        },
        {
          id: 'daniel',
          name: 'Daniel Frost',
          role: 'Security Chief',
          avatarIcon: '🛡️',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Stationed at the vault door; rushed to main power panel at 9:30 PM to restore backup lighting.',
          contradiction: 'None. Keycard swipes show he was on the perimeter hallway securing exits.',
          motive: 'Responsible for zero-loss security contract.',
          evidenceAgainst: ['Maintained lockdown protocol immediately upon alarm.'],
          isCulprit: false
        },
        {
          id: 'oliver',
          name: 'Oliver Grant',
          role: 'Art Dealer',
          avatarIcon: '🎨',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Was speaking to guests near the champagne fountain at the rear.',
          contradiction: 'Tried to inspect the pedestal early, but was turned away by guards at 8:40 PM.',
          motive: 'Represented a competing auction house.',
          evidenceAgainst: ['Was nowhere near the pedestal when lights dropped.'],
          isCulprit: false
        }
      ],

      clues: [
        {
          id: 1,
          code: 'AUC-1',
          title: 'Guest List & Badges',
          time: '9:00 PM',
          question: 'What was the badge number of the official event photographer on the VIP registry?',
          answers: ['7', 'badge 7', '#7', '07'],
          hint: 'Look for the press access badge assigned to official documentary media.',
          evidenceId: 'ev_c2_list',
          description: 'Official guest registry confirms Badge #7 was assigned to photographer Rachel Stone with full floor clearance.'
        },
        {
          id: 2,
          code: 'AUC-2',
          title: 'Unusual Reflection',
          time: '9:27 PM',
          question: 'What tool was reflected in the champagne glass during the display tampering?',
          answers: ['suction', 'suction cup', 'lens tool', 'suction tool'],
          hint: 'Enlarge the high-resolution photo of the front-row table to see what is reflected in the crystal glass.',
          evidenceId: 'ev_c2_reflection',
          description: 'A close-up reflection in a crystal glass shows a camera-mounted suction cup lifting the display dome.'
        },
        {
          id: 3,
          code: 'AUC-3',
          title: 'Modified Receipt',
          time: '9:15 PM',
          question: 'What altered weight was forged onto the catalog receipt?',
          answers: ['112ct', '112', '112 carats', '112 carat'],
          hint: 'The genuine diamond weighs 120 carats, but the forged document changed the number.',
          evidenceId: 'ev_c2_receipt',
          description: 'A duplicate receipt showed the weight altered from 120ct to 112ct to match a pre-ordered synthetic replica.'
        },
        {
          id: 4,
          code: 'AUC-4',
          title: 'Security Access Record',
          time: '9:26 PM',
          question: 'Whose equipment was plugged into the blind-spot terminal at 9:26 PM?',
          answers: ['rachel', 'rachel stone', 'camera', 'photographer'],
          hint: 'The auxiliary battery terminal in the unmonitored recess was used right before the blackout.',
          evidenceId: 'ev_c2_access',
          description: 'Terminal logs show Rachel Stone plugged in high-discharge camera strobe gear to overload the dimmer circuit.'
        },
        {
          id: 5,
          code: 'AUC-5',
          title: 'Phone Transcript',
          time: '9:45 PM',
          question: 'Where was the stolen diamond concealed to bypass the security search?',
          answers: ['telephoto lens', 'camera lens', 'lens', 'camera'],
          hint: 'Security searched pockets, bags, and coats, but never unscrewed the photographer\'s primary optical glass.',
          evidenceId: 'ev_c2_phone',
          description: 'Intercepted radio audio confirms the diamond was hidden inside the hollowed barrel of Rachel\'s telephoto lens.'
        }
      ],

      evidence: [
        {
          id: 'ev_c2_list',
          clueId: 1,
          title: 'VIP Press Credential #7',
          category: 'Documentary Record',
          icon: '🪪',
          timestamp: '9:00 PM',
          location: 'Gallery Welcome Desk',
          status: 'Cataloged',
          summary: 'All-access pass issued to Rachel Stone.',
          forensics: 'Enabled unescorted movement around the pedestal perimeter.',
          suspectLink: 'Rachel Stone.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1e272e"/><rect x="25" y="15" width="70" height="50" rx="3" fill="#ecf0f1"/><text x="40" y="45" fill="#c0392b" font-weight="bold" font-size="12">PASS #7</text></svg>'
        },
        {
          id: 'ev_c2_reflection',
          clueId: 2,
          title: 'High-Res Crystal Reflection Still',
          category: 'Photographic Evidence',
          icon: '🔎',
          timestamp: '9:27 PM',
          location: 'Table 2 Crystal Flute',
          status: 'Analyzed',
          summary: 'Reflection shows suction lifter removing glass vitrine.',
          forensics: 'Device matches suction bracket standardly used on heavy camera lenses.',
          suspectLink: 'Rachel Stone.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><circle cx="60" cy="40" r="24" fill="#34495e" stroke="#3498db" stroke-width="2"/><text x="35" y="44" fill="#f1c40f" font-size="8">LENS REFLECTION</text></svg>'
        },
        {
          id: 'ev_c2_receipt',
          clueId: 3,
          title: 'Altered Shipping Ledger',
          category: 'Financial Record',
          icon: '🧾',
          timestamp: '9:15 PM',
          location: 'Backstage Office',
          status: 'Recovered',
          summary: 'Weight altered to 112ct to disguise the substitute fake.',
          forensics: 'Correction made using non-standard pigment pen.',
          suspectLink: 'Prepared to match counterfeit stone.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#ecf0f1"/><text x="30" y="35" fill="#7f8c8d" font-size="8">ORIG: 120ct</text><text x="30" y="55" fill="#c0392b" font-weight="bold" font-size="10">FORGED: 112ct</text></svg>'
        },
        {
          id: 'ev_c2_access',
          clueId: 4,
          title: 'Power Panel Surge Log',
          category: 'Technical Record',
          icon: '⚡',
          timestamp: '9:26 PM',
          location: 'Sub-circuit 4A',
          status: 'Extracted',
          summary: 'Capacitor discharge tripped the gallery main illuminators.',
          forensics: 'Surge matches 600-joule flash strobe power pack.',
          suspectLink: 'Rachel Stone\'s camera setup.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1e272e"/><path d="M60 15 L45 45 L65 45 L50 70" stroke="#f1c40f" stroke-width="4" fill="none"/></svg>'
        },
        {
          id: 'ev_c2_phone',
          clueId: 5,
          title: 'Radio Audio Wiretap',
          category: 'Audio Intercept',
          icon: '📻',
          timestamp: '9:45 PM',
          location: 'Press Van Frequency',
          status: 'De-anonymized',
          summary: 'Transmission confirms diamond is inside telephoto barrel.',
          forensics: 'Voice print matches Rachel Stone.',
          suspectLink: 'Rachel Stone.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><text x="25" y="44" fill="#2ecc71" font-family="monospace" font-size="8">"STONE IN LENS"</text></svg>'
        }
      ],

      timeline: [
        { time: '20:30', timeLabel: '8:30 PM', title: 'Exhibition Opens', type: 'verified', location: 'Main Salon', description: 'Guests arrive and inspect the 120ct Star of Alexandria under triple-beam sensors.' },
        { time: '20:40', timeLabel: '8:40 PM', title: 'Oliver Grant Approached Case', type: 'verified', location: 'Pedestal', description: 'Grant attempts close inspection but is escorted back by security guards.' },
        { time: '21:00', timeLabel: '9:00 PM', title: 'VIP Badges Verified', type: 'verified', location: 'Registration', description: 'Photographer Rachel Stone receives Badge #7 with unrestricted floor clearance.' },
        { time: '21:26', timeLabel: '9:26 PM', title: 'Strobe Power Surge', type: 'contradiction', location: 'Blind-spot Outlet', description: 'Rachel plugs in overloaded flash pack to prepare circuit trip.' },
        { time: '21:28', timeLabel: '9:28 PM', title: 'The 15-Second Blackout', type: 'contradiction', location: 'Pedestal', description: 'Lighting drops; glass vitrine lifted with suction tool and stone swapped for 112ct fake.' },
        { time: '21:35', timeLabel: '9:35 PM', title: 'Theft Discovered', type: 'verified', location: 'Podium', description: 'Spotlights return; alarm triggers as sensor detects weight variance of the fake diamond.' },
        { time: '21:45', timeLabel: '9:45 PM', title: 'Radio Transmission', type: 'contradiction', location: 'Van Parking', description: 'Encrypted message sent confirming diamond is stashed inside telephoto lens.' }
      ],

      corkboardNodes: [
        { id: 'c2_n_rachel', type: 'suspect', title: 'Rachel Stone (Photographer)', x: 180, y: 150, icon: '📷', color: '#c0392b' },
        { id: 'c2_n_lens', type: 'evidence', title: 'Telephoto Lens Stash', x: 440, y: 90, icon: '🔎', color: '#f39c12' },
        { id: 'c2_n_surge', type: 'evidence', title: '9:26 PM Power Surge', x: 480, y: 230, icon: '⚡', color: '#2980b9' },
        { id: 'c2_n_pass', type: 'evidence', title: 'VIP Badge #7', x: 160, y: 320, icon: '🪪', color: '#27ae60' },
        { id: 'c2_n_radio', type: 'evidence', title: 'Radio Wiretap', x: 720, y: 160, icon: '📻', color: '#8e44ad' }
      ],
      corkboardLinks: [
        { from: 'c2_n_rachel', to: 'c2_n_pass', label: 'Had all-access pass' },
        { from: 'c2_n_rachel', to: 'c2_n_surge', label: 'Triggered blackout' },
        { from: 'c2_n_rachel', to: 'c2_n_lens', label: 'Concealed diamond' },
        { from: 'c2_n_lens', to: 'c2_n_radio', label: 'Confirmed on wiretap' }
      ]
    },

    // ========================================================================
    // CASE 03: THE 2:17 INCIDENT
    // ========================================================================
    case3: {
      id: 'case3',
      number: '03',
      title: 'The 2:17 Incident',
      badge: 'CASE 03 • LAB CONSPIRACY',
      difficulty: 'Hard',
      genre: 'Suspicious death and missing research',
      playtime: '40–50 minutes',
      mechanic: 'Decryption and contradiction analysis',
      scene: 'University Science Annex, Biochem Lab 4',
      incidentWindow: '1:30 AM – 2:30 AM',
      briefing: 'At 2:17 AM, university security responds to an environmental hazard alarm in Biochem Lab 4. Professor Alistair Finch is found collapsed over his desk in respiratory failure. His encrypted solid-state drive containing the breakthrough quantum synthesis algorithm has been wiped, and the physical research notebook is gone.',
      objective: 'Decrypt the lab communications, expose the poisoned thermos, catch the alibi contradiction, and reveal who was responsible.',
      culpritId: 'olivia',
      culpritName: 'Dr. Olivia Hart (Department Head)',
      solutionSummary: 'Dr. Olivia Hart poisoned Professor Finch\'s herbal tea thermos with Tetramine B extracted from the restricted inventory. Using her executive override keycard, she entered Lab 4 at 2:10 AM, wiped Finch\'s workstation drive, and took his synthesis notebook to claim sole authorship of the multi-million dollar pharmaceutical patent. Her phone ping placed her at the lab despite claiming she was asleep at home.',

      suspects: [
        {
          id: 'olivia',
          name: 'Dr. Olivia Hart',
          role: 'Department Head',
          avatarIcon: '🔬',
          suspicionLevel: 'CRITICAL',
          suspicionPercent: 96,
          statedAlibi: 'Asserts she was asleep at her suburban home from 11:30 PM until campus security contacted her at 3:00 AM.',
          contradiction: 'Tower #4 ping logs her cellular phone at the university lab quad at 2:17 AM. Her executive keycard was used to enter Lab 4.',
          motive: 'Finch was filing an official whistleblower report against her for patent theft and misappropriation of departmental grants.',
          evidenceAgainst: [
            'Executive master override used at 2:10 AM',
            '15ml of Tetramine B missing from her personally audited locker',
            'Finch\'s unsent draft email named her directly'
          ],
          isCulprit: true
        },
        {
          id: 'ethan',
          name: 'Ethan Brooks',
          role: 'Research Assistant',
          avatarIcon: '🧑‍🔬',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Was in the library study carrels writing his dissertation chapter; arrived at lab at 2:22 AM to find Finch collapsed.',
          contradiction: 'None. Library swipe records and CCTV show him leaving study carrel at 2:19 AM.',
          motive: 'Depended completely on Finch\'s recommendation for his PhD defense.',
          evidenceAgainst: ['Called 911 immediately and administered emergency CPR.'],
          isCulprit: false
        },
        {
          id: 'noah',
          name: 'Noah Bennett',
          role: 'PhD Scholar',
          avatarIcon: '👨‍🎓',
          suspicionLevel: 'LOW',
          suspicionPercent: 15,
          statedAlibi: 'Left the building at 1:45 AM after running an automated centrifuge run.',
          contradiction: 'None. Turnstile gate logs verify his exit at 1:47 AM.',
          motive: 'Rivalry with Ethan over authorship placement.',
          evidenceAgainst: ['Was already off-campus when the incident occurred.'],
          isCulprit: false
        },
        {
          id: 'liam',
          name: 'Liam Carter',
          role: 'Lab Technician',
          avatarIcon: '🧰',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Asleep in the basement technician lounge on standby duty.',
          contradiction: 'None. Keycard access records him badge-in to the basement lounge at 1:15 AM with no exit.',
          motive: 'Had routine access to chemical inventory.',
          evidenceAgainst: ['Inventory audits require Department Head authorization code.'],
          isCulprit: false
        },
        {
          id: 'maya',
          name: 'Maya Wilson',
          role: 'Colleague & Project Lead',
          avatarIcon: '👩‍🏫',
          suspicionLevel: 'LOW',
          suspicionPercent: 25,
          statedAlibi: 'Attending an academic video conference with European partners from 1:00 AM to 3:00 AM.',
          contradiction: 'None. IP connection logs from her home office confirm active Zoom video stream throughout.',
          motive: 'Disagreed with Finch on ethics of synthesis commercialization.',
          evidenceAgainst: ['Was on recorded video conference during the entire window.'],
          isCulprit: false
        }
      ],

      clues: [
        {
          id: 1,
          code: 'INC217-1',
          title: 'Laboratory Access Log',
          time: '2:10 AM',
          question: 'What level of access authorization swiped into Biochem Lab 4 at 2:10 AM?',
          answers: ['executive override', 'executive', 'department head', 'override'],
          hint: 'The electronic lock logs show a high-clearance administrative card was used.',
          evidenceId: 'ev_c3_access',
          description: 'Access records show door release via "Executive Override" credentials at 2:10 AM.'
        },
        {
          id: 2,
          code: 'INC217-2',
          title: 'Encrypted Research Document',
          time: '2:14 AM',
          question: 'What is the decoded keyword of the encrypted synthesis document?',
          answers: ['synthesis', 'quantum synthesis'],
          hint: 'The Caesar shift cipher on the header decodes to the breakthrough project name: SYNTHESIS.',
          evidenceId: 'ev_c3_doc',
          description: 'A decrypted fragment reveals the stolen research was the proprietary "Synthesis" algorithm.'
        },
        {
          id: 3,
          code: 'INC217-3',
          title: 'Recovered Email Draft',
          time: '1:55 AM',
          question: 'Who was Professor Finch preparing to report to the ethics board?',
          answers: ['dr olivia hart', 'olivia hart', 'dr hart', 'hart'],
          hint: 'The unsent draft addressed to the University Ethics Board accused the department leader.',
          evidenceId: 'ev_c3_email',
          description: 'Finch drafted an urgent complaint accusing Dr. Olivia Hart of attempting to steal research ownership.'
        },
        {
          id: 4,
          code: 'INC217-4',
          title: 'Chemical Inventory Audit',
          time: '2:00 AM',
          question: 'What chemical compound was missing from the locked toxin cabinet?',
          answers: ['tetramine b', 'tetramine'],
          hint: '15 milliliters of a fast-acting respiratory paralytic were unaccounted for.',
          evidenceId: 'ev_c3_chem',
          description: 'Audit logs reveal 15ml of Tetramine B was withdrawn under Dr. Hart\'s digital signature.'
        },
        {
          id: 5,
          code: 'INC217-5',
          title: 'Coded Handwritten Note',
          time: '2:16 AM',
          question: 'What name is encoded in the hex sequence 4F 4C 49 56 49 41?',
          answers: ['olivia', 'olivia hart'],
          hint: 'Convert the ASCII hex pairs: 4F=O, 4C=L, 49=I, 56=V, 49=I, 41=A.',
          evidenceId: 'ev_c3_hex',
          description: 'Hexadecimal numbers scribbled on Finch\'s blotter translate directly to "OLIVIA".'
        },
        {
          id: 6,
          code: 'INC217-6',
          title: 'Conflicting Cellular Ping',
          time: '2:17 AM',
          question: 'Who was responsible for the 2:17 AM incident in Biochem Lab 4?',
          answers: ['dr olivia hart', 'olivia hart', 'dr hart', 'hart'],
          hint: 'The tower ping placed her on campus despite her claimed suburban alibi.',
          evidenceId: 'ev_c3_tower',
          description: 'Cell tower records show Dr. Olivia Hart\'s phone connected to the campus mast at 2:17 AM.'
        }
      ],

      evidence: [
        {
          id: 'ev_c3_access',
          clueId: 1,
          title: 'Executive Lock Audit #EX-09',
          category: 'Digital Log',
          icon: '💳',
          timestamp: '2:10 AM',
          location: 'Lab 4 Door Terminal',
          status: 'Extracted',
          summary: 'Executive card #EX-09 swiped at 2:10 AM.',
          forensics: 'Assigned solely to Department Head Dr. Olivia Hart.',
          suspectLink: 'Dr. Olivia Hart.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><text x="25" y="44" fill="#e74c3c" font-family="monospace" font-size="8">AUTH: EXEC OVERRIDE</text></svg>'
        },
        {
          id: 'ev_c3_doc',
          clueId: 2,
          title: 'Decrypted Synthesis Header',
          category: 'Digital File',
          icon: '📄',
          timestamp: '2:14 AM',
          location: 'Quantum Drive Mirror',
          status: 'Recovered',
          summary: 'Encrypted document confirming "Synthesis" project.',
          forensics: 'Timestamp of file extraction is 2:14 AM.',
          suspectLink: 'Target of theft.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1e272e"/><text x="20" y="45" fill="#27ae60" font-family="monospace" font-size="8">KEYWORD: SYNTHESIS</text></svg>'
        },
        {
          id: 'ev_c3_email',
          clueId: 3,
          title: 'Unsent Ethics Board Whistleblower Draft',
          category: 'Communication',
          icon: '✉️',
          timestamp: '1:55 AM',
          location: 'Finch\'s Webmail Outbox',
          status: 'Uncovered',
          summary: 'Draft email reporting Dr. Hart for academic fraud.',
          forensics: 'Drafted 22 minutes before Finch\'s collapse.',
          suspectLink: 'Provides motive against Dr. Hart.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#34495e"/><text x="20" y="44" fill="#f39c12" font-size="8">TO: ETHICS BOARD</text></svg>'
        },
        {
          id: 'ev_c3_chem',
          clueId: 4,
          title: 'Cabinet Audit: Missing Tetramine B',
          category: 'Chemical Analysis',
          icon: '🧪',
          timestamp: '2:00 AM',
          location: 'Schedule 1 Toxic Locker',
          status: 'Confirmed',
          summary: '15ml of paralytic neurotoxin missing.',
          forensics: 'Trace residues of Tetramine B discovered in Finch\'s thermos cup.',
          suspectLink: 'Authorized withdrawal by Dr. Hart.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#16a085"/><text x="20" y="44" fill="#fff" font-size="8">TETRAMINE B: -15ml</text></svg>'
        },
        {
          id: 'ev_c3_hex',
          clueId: 5,
          title: 'Hex Blotter Scribble',
          category: 'Physical Evidence',
          icon: '📝',
          timestamp: '2:16 AM',
          location: 'Finch\'s Desk Pad',
          status: 'Decoded',
          summary: 'Hex sequence: 4F 4C 49 56 49 41 = OLIVIA.',
          forensics: 'Finch\'s dying effort to identify his attacker.',
          suspectLink: 'Dr. Olivia Hart.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#fef9e7"/><text x="20" y="44" fill="#c0392b" font-family="monospace" font-size="8">HEX -> OLIVIA</text></svg>'
        },
        {
          id: 'ev_c3_tower',
          clueId: 6,
          title: 'Cellular Tower #4 Triangulation',
          category: 'Telecommunication',
          icon: '📡',
          timestamp: '2:17 AM',
          location: 'Campus Mast Quad',
          status: 'Corroborated',
          summary: 'Dr. Hart\'s phone pinged on campus at 2:17 AM.',
          forensics: 'Shatters her alibi of sleeping at her home 15 miles away.',
          suspectLink: 'Dr. Olivia Hart.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><text x="25" y="44" fill="#e74c3c" font-size="8">PING: QUAD 2:17</text></svg>'
        }
      ],

      timeline: [
        { time: '01:15', timeLabel: '1:15 AM', title: 'Technician Badges Into Lounge', type: 'verified', location: 'Basement', description: 'Liam Carter clocks in to the basement maintenance room.' },
        { time: '01:45', timeLabel: '1:45 AM', title: 'Noah Bennett Exits', type: 'verified', location: 'Turnstile', description: 'Noah finishes centrifuge run and scans out of building.' },
        { time: '01:55', timeLabel: '1:55 AM', title: 'Finch Drafts Whistleblower Complaint', type: 'verified', location: 'Lab 4', description: 'Finch compiles evidence of Dr. Hart\'s patent fraud in an unsent email.' },
        { time: '02:10', timeLabel: '2:10 AM', title: 'Executive Override Keycard Swipe', type: 'contradiction', location: 'Lab 4 Door', description: 'Dr. Hart enters using administrative master override card #EX-09.' },
        { time: '02:14', timeLabel: '2:14 AM', title: 'Synthesis Data Drive Copied & Erased', type: 'contradiction', location: 'Terminal 1', description: 'Quantum synthesis research files extracted onto portable flash drive.' },
        { time: '02:16', timeLabel: '2:16 AM', title: 'Finch Writes Hex Message', type: 'verified', location: 'Desk Pad', description: 'Finch succumbs to Tetramine B neurotoxin and writes hex code 4F 4C 49 56 49 41.' },
        { time: '02:17', timeLabel: '2:17 AM', title: 'Hazard Alarm & Tower Ping', type: 'contradiction', location: 'Campus Mast', description: 'Dr. Hart\'s phone connects to campus cell mast as environmental alarm sounds.' },
        { time: '02:22', timeLabel: '2:22 AM', title: 'Ethan Brooks Discovers Finch', type: 'verified', location: 'Lab 4', description: 'Ethan enters lab, finds Finch, and calls emergency dispatch.' }
      ],

      corkboardNodes: [
        { id: 'c3_n_olivia', type: 'suspect', title: 'Dr. Olivia Hart', x: 180, y: 150, icon: '🔬', color: '#c0392b' },
        { id: 'c3_n_chem', type: 'evidence', title: 'Tetramine B Neurotoxin', x: 440, y: 90, icon: '🧪', color: '#f39c12' },
        { id: 'c3_n_ping', type: 'evidence', title: '2:17 AM Tower Ping', x: 480, y: 230, icon: '📡', color: '#2980b9' },
        { id: 'c3_n_email', type: 'evidence', title: 'Ethics Board Draft', x: 160, y: 320, icon: '✉️', color: '#27ae60' },
        { id: 'c3_n_hex', type: 'evidence', title: 'Hex Code: OLIVIA', x: 720, y: 160, icon: '📝', color: '#8e44ad' }
      ],
      corkboardLinks: [
        { from: 'c3_n_olivia', to: 'c3_n_chem', label: 'Authorized poison withdrawal' },
        { from: 'c3_n_olivia', to: 'c3_n_ping', label: 'Caught at scene at 2:17' },
        { from: 'c3_n_olivia', to: 'c3_n_email', label: 'Motive: Threatened exposure' },
        { from: 'c3_n_olivia', to: 'c3_n_hex', label: 'Victim identified her' }
      ]
    },

    // ========================================================================
    // CASE 04: THE LAST TRAIN TO BLACKWOOD
    // ========================================================================
    case4: {
      id: 'case4',
      number: '04',
      title: 'The Last Train to Blackwood',
      badge: 'CASE 04 • CONSPIRACY DISAPPEARANCE',
      difficulty: 'Expert',
      genre: 'Disappearance mystery',
      playtime: '50–60 minutes',
      mechanic: 'Multi-layer investigation',
      scene: 'Express Night Train #44 & Freight Siding',
      incidentWindow: '11:30 PM – 1:15 AM',
      briefing: 'Julian Vance, an acclaimed investigative journalist on the verge of exposing an interstate rail cartel, boarded the 11:30 PM overnight express to Blackwood in Coach C, Seat 14. When the train arrived at Blackwood station at 1:15 AM, his seat was empty, his trench coat and unlocked briefcase remained in the rack, and no passenger recalled him walking through the doors.',
      objective: 'Follow the secret timetable halt, expose the passenger with the forged ticket, decode the train radio log, and reveal what happened to Julian Vance.',
      culpritId: 'collins',
      culpritName: 'Henry Collins (Railway Security Officer)',
      solutionSummary: 'Henry Collins, the railway security officer on the cartel payroll, coordinated with accomplice "Evelyn Shaw" to stage an unscheduled 6-minute halt at the decommissioned Old Mill Junction freight siding at 12:14 AM. Collins used his railway master key to force Vance out through the baggage compartment into an awaiting vehicle, seizing his syndicate exposure files.',

      suspects: [
        {
          id: 'collins',
          name: 'Henry Collins',
          role: 'Railway Security Officer',
          avatarIcon: '👮',
          suspicionLevel: 'CRITICAL',
          suspicionPercent: 98,
          statedAlibi: 'Claims he remained in the caboose security cabin monitoring onboard cameras throughout the whole journey.',
          contradiction: 'Station platform footage at Old Mill Junction caught Collins personally opening the baggage side door at 12:14 AM.',
          motive: 'Was paid $250,000 by the syndicate to intercept Julian Vance\'s ledger before Vance delivered it to federal authorities in Blackwood.',
          evidenceAgainst: [
            'Ordered train switch to track 4 at Old Mill Junction siding',
            'Photographed escorting Vance out at the siding at 12:14 AM',
            'Transmitted cipher code "EXTRACTION COMPLETE" on channel 4',
            'Named directly in Vance\'s concealed pocket notebook'
          ],
          isCulprit: true
        },
        {
          id: 'blake',
          name: 'Thomas Blake',
          role: 'Train Conductor',
          avatarIcon: '🎫',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Checked tickets in Coaches A, B, and C between 11:35 PM and 11:50 PM; saw Vance in Seat 14.',
          contradiction: 'None. Punched tickets and passenger logs verify his continuous service rounds.',
          motive: 'Was distracted by a passenger dispute in Coach B regarding a mismatched ticket.',
          evidenceAgainst: ['Was manipulated into handling a staged distraction by the accomplice.'],
          isCulprit: false
        },
        {
          id: 'amelia',
          name: 'Amelia Ross',
          role: 'Fellow Passenger',
          avatarIcon: '🧳',
          suspicionLevel: 'LOW',
          suspicionPercent: 15,
          statedAlibi: 'Traveled in Coach C Seat 16; fell asleep wearing headphones after departure.',
          contradiction: 'None. Woke up only when train arrived in Blackwood.',
          motive: 'None. Independent traveler.',
          evidenceAgainst: ['Zero connection to Vance or the railway cartel.'],
          isCulprit: false
        },
        {
          id: 'whitmore',
          name: 'James Whitmore',
          role: 'Journalist\'s Editor',
          avatarIcon: '📰',
          suspicionLevel: 'LOW',
          suspicionPercent: 25,
          statedAlibi: 'In editorial office in Capital City; sent an urgent warning telegram at 11:15 PM.',
          contradiction: 'None. Telegram transmission records show he was warning Vance of an ambush.',
          motive: 'Was Vance\'s chief ally in publishing the cartel exposé.',
          evidenceAgainst: ['Attempted to warn Vance not to take the 11:30 PM train.'],
          isCulprit: false
        },
        {
          id: 'evelyn',
          name: 'Evelyn Shaw',
          role: 'Accomplice / Alias Operative',
          avatarIcon: '🕶️',
          suspicionLevel: 'HIGH',
          suspicionPercent: 80,
          statedAlibi: 'Claimed to be visiting family in Oakhaven.',
          contradiction: 'Traveled under a fake name; Oakhaven station was permanently closed 5 years ago. Staged a ticket argument to draw conductor Blake away from Coach C.',
          motive: 'Paid accomplice of Henry Collins.',
          evidenceAgainst: ['Held forged ticket #884 used as a distraction.'],
          isCulprit: false // Collins is the mastermind security officer who executed the abduction
        }
      ],

      clues: [
        {
          id: 1,
          code: 'BW-1',
          title: 'Passenger Manifest',
          time: '11:30 PM',
          question: 'Which seat in Coach C was assigned to Julian Vance?',
          answers: ['14', 'seat 14', '#14'],
          hint: 'Inspect the official seating chart for Coach C on the Blackwood Express.',
          evidenceId: 'ev_c4_manifest',
          description: 'Official manifest lists Julian Vance assigned to Coach C, Seat 14.'
        },
        {
          id: 2,
          code: 'BW-2',
          title: 'Mismatched Ticket',
          time: '11:45 PM',
          question: 'What non-existent decommissioned station was printed on the forged ticket?',
          answers: ['oakhaven', 'oakhaven station'],
          hint: 'The passenger claiming to be Evelyn Shaw held a counterfeit ticket for a long-abandoned stop.',
          evidenceId: 'ev_c4_ticket',
          description: 'Ticket #884 showed destination "Oakhaven", a station decommissioned five years earlier.'
        },
        {
          id: 3,
          code: 'BW-3',
          title: 'Voice Recording',
          time: '12:14 AM',
          question: 'What time did the train make the unscheduled stop at the freight siding?',
          answers: ['12:14 am', '12:14am', '12:14'],
          hint: 'A phone dictation app recorded the sound of brakes screeching to a halt at a siding switch.',
          evidenceId: 'ev_c4_audio',
          description: 'Audio recording timestamps an unscheduled 6-minute halt at 12:14 AM.'
        },
        {
          id: 4,
          code: 'BW-4',
          title: 'Timetable Discrepancy',
          time: '12:14 AM – 12:20 AM',
          question: 'At which junction siding did the unscheduled 6-minute halt take place?',
          answers: ['old mill junction', 'old mill', 'old mill siding'],
          hint: 'The signal box log shows the express diverted onto Track 4 at Old Mill.',
          evidenceId: 'ev_c4_timetable',
          description: 'Signal records confirm Express #44 was diverted to Old Mill Junction siding.'
        },
        {
          id: 5,
          code: 'BW-5',
          title: 'Station Platform Photograph',
          time: '12:17 AM',
          question: 'Which railway officer is identified in the junction platform surveillance still?',
          answers: ['henry collins', 'collins', 'officer collins'],
          hint: 'The badge and uniform in the dim light belong to the onboard security officer.',
          evidenceId: 'ev_c4_photo',
          description: 'Security camera captures Officer Henry Collins escorting Vance out through the baggage door.'
        },
        {
          id: 6,
          code: 'BW-6',
          title: 'Encrypted Radio Transmission',
          time: '12:21 AM',
          question: 'What two words were transmitted on security channel 4 after the siding stop?',
          answers: ['extraction complete'],
          hint: 'The decoded radio message sent to the syndicate vehicle was: EXTRACTION COMPLETE.',
          evidenceId: 'ev_c4_radio',
          description: 'Intercepted transmission on security channel: "EXTRACTION COMPLETE."'
        },
        {
          id: 7,
          code: 'BW-7',
          title: 'Journalist\'s Hidden Notebook',
          time: '12:10 AM',
          question: 'Who orchestrated Julian Vance\'s abduction on the train to Blackwood?',
          answers: ['henry collins', 'collins', 'officer collins'],
          hint: 'Vance hid a note under seat cushion 14 identifying the security officer on the cartel payroll.',
          evidenceId: 'ev_c4_notebook',
          description: 'Julian\'s handwritten memo reveals: "Collins is on syndicate payroll. If I vanish, check the siding."'
        }
      ],

      evidence: [
        {
          id: 'ev_c4_manifest',
          clueId: 1,
          title: 'Blackwood Express Manifest',
          category: 'Official Record',
          icon: '📋',
          timestamp: '11:30 PM',
          location: 'Central Terminal',
          status: 'Verified',
          summary: 'Julian Vance assigned to Coach C, Seat 14.',
          forensics: 'Confirms Vance boarded train in seat 14.',
          suspectLink: 'Victim seated near baggage compartment.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><text x="25" y="44" fill="#fff" font-size="8">COACH C - SEAT 14</text></svg>'
        },
        {
          id: 'ev_c4_ticket',
          clueId: 2,
          title: 'Counterfeit Ticket #884',
          category: 'Physical Evidence',
          icon: '🎫',
          timestamp: '11:45 PM',
          location: 'Coach B',
          status: 'Confiscated',
          summary: 'Ticket for closed station Oakhaven.',
          forensics: 'Counterfeit paper and bogus station code.',
          suspectLink: 'Evelyn Shaw (Accomplice distraction).',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#fef9e7"/><text x="20" y="44" fill="#c0392b" font-weight="bold" font-size="8">DEST: OAKHAVEN</text></svg>'
        },
        {
          id: 'ev_c4_audio',
          clueId: 3,
          title: 'Dictation App Audio File',
          category: 'Audio Record',
          icon: '🎙️',
          timestamp: '12:14 AM',
          location: 'Julian\'s Cloud Sync',
          status: 'Decoded',
          summary: 'Train slowing down at freight siding.',
          forensics: 'Sound of brake shoes and siding switch.',
          suspectLink: 'Unscheduled halt.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1e272e"/><text x="25" y="44" fill="#2ecc71" font-size="8">HALT: 00:14</text></svg>'
        },
        {
          id: 'ev_c4_timetable',
          clueId: 4,
          title: 'Signal Box 9 Dispatch Log',
          category: 'Technical Record',
          icon: '🛤️',
          timestamp: '12:14 AM – 12:20 AM',
          location: 'Old Mill Junction',
          status: 'Retrieved',
          summary: 'Track 4 switch diverted train for 6 minutes.',
          forensics: 'Switch requested under Security Priority Code.',
          suspectLink: 'Henry Collins.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#34495e"/><text x="15" y="44" fill="#f1c40f" font-size="8">OLD MILL SIDING [6m]</text></svg>'
        },
        {
          id: 'ev_c4_photo',
          clueId: 5,
          title: 'Platform Camera Still Frame',
          category: 'Surveillance Still',
          icon: '📸',
          timestamp: '12:17 AM',
          location: 'Old Mill Freight Platform',
          status: 'Enhanced',
          summary: 'Security Officer Collins leads hooded figure.',
          forensics: 'Facial recognition identifies Henry Collins.',
          suspectLink: 'Henry Collins.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1e272e"/><text x="20" y="44" fill="#e74c3c" font-size="8">COLLINS IDENTIFIED</text></svg>'
        },
        {
          id: 'ev_c4_radio',
          clueId: 6,
          title: 'Radio Intercept #CH4',
          category: 'Communication',
          icon: '📻',
          timestamp: '12:21 AM',
          location: 'Railway Frequency 450MHz',
          status: 'Logged',
          summary: 'Transmission: "EXTRACTION COMPLETE".',
          forensics: 'Originated from Officer Collins\'s portable handset.',
          suspectLink: 'Henry Collins.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><text x="10" y="44" fill="#2ecc71" font-size="7">EXTRACTION COMPLETE</text></svg>'
        },
        {
          id: 'ev_c4_notebook',
          clueId: 7,
          title: 'Concealed Moleskine Pocket Memo',
          category: 'Physical Forensic',
          icon: '📓',
          timestamp: '12:10 AM',
          location: 'Under Seat 14 Cushion',
          status: 'Discovered',
          summary: 'Vance\'s note naming Collins on cartel payroll.',
          forensics: 'Handwriting verified as Julian Vance.',
          suspectLink: 'Henry Collins.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#fef9e7"/><text x="15" y="44" fill="#c0392b" font-size="7">COLLINS IS CARTEL</text></svg>'
        }
      ],

      timeline: [
        { time: '23:15', timeLabel: '11:15 PM', title: 'Editor Warning Telegram', type: 'verified', location: 'Terminal Telegraph', description: 'James Whitmore sends telegram warning Vance that the cartel knows his travel route.' },
        { time: '23:30', timeLabel: '11:30 PM', title: 'Train Departs On Schedule', type: 'verified', location: 'Capital Station', description: 'Express #44 departs on time; Vance is seated in Coach C, Seat 14.' },
        { time: '23:45', timeLabel: '11:45 PM', title: 'Accomplice Distraction', type: 'contradiction', location: 'Coach B', description: 'Evelyn Shaw provokes an argument over fake ticket #884, drawing conductor away.' },
        { time: '00:10', timeLabel: '12:10 AM', title: 'Vance Conceals Memo', type: 'verified', location: 'Coach C Seat 14', description: 'Realizing he is in danger, Vance slips his pocket notebook under the seat cushion.' },
        { time: '00:14', timeLabel: '12:14 AM', title: 'Unscheduled Freight Siding Stop', type: 'contradiction', location: 'Old Mill Junction', description: 'Train switches to Track 4 and halts for 6 minutes under Collins\'s emergency order.' },
        { time: '00:17', timeLabel: '12:17 AM', title: 'Vance Extracted Through Baggage Door', type: 'contradiction', location: 'Freight Platform', description: 'Officer Collins forces Vance off the train and into an awaiting cartel vehicle.' },
        { time: '00:21', timeLabel: '12:21 AM', title: 'Radio Transmission Dispatched', type: 'contradiction', location: 'Channel 4', description: 'Collins transmits "EXTRACTION COMPLETE" as train resumes journey.' },
        { time: '01:15', timeLabel: '1:15 AM', title: 'Train Reaches Blackwood', type: 'verified', location: 'Blackwood Station', description: 'Train arrives; Seat 14 is empty and Julian Vance is officially missing.' }
      ],

      corkboardNodes: [
        { id: 'c4_n_collins', type: 'suspect', title: 'Officer Henry Collins', x: 180, y: 150, icon: '👮', color: '#c0392b' },
        { id: 'c4_n_siding', type: 'evidence', title: 'Old Mill Siding Halt', x: 440, y: 90, icon: '🛤️', color: '#f39c12' },
        { id: 'c4_n_photo', type: 'evidence', title: 'Platform Photo at 12:17', x: 480, y: 230, icon: '📸', color: '#2980b9' },
        { id: 'c4_n_ticket', type: 'evidence', title: 'Fake Ticket Distraction', x: 160, y: 320, icon: '🎫', color: '#27ae60' },
        { id: 'c4_n_note', type: 'evidence', title: 'Vance\'s Hidden Memo', x: 720, y: 160, icon: '📓', color: '#8e44ad' }
      ],
      corkboardLinks: [
        { from: 'c4_n_collins', to: 'c4_n_siding', label: 'Ordered unscheduled halt' },
        { from: 'c4_n_collins', to: 'c4_n_photo', label: 'Photographed on platform' },
        { from: 'c4_n_collins', to: 'c4_n_note', label: 'Named in secret memo' },
        { from: 'c4_n_ticket', to: 'c4_n_siding', label: 'Coordinated distraction' }
      ]
    },

    // ========================================================================
    // CASE 00: THE MISSING LAPTOP (DEMO CASE)
    // ========================================================================
    demo: {
      id: 'demo',
      number: '00',
      title: 'The Missing Laptop',
      badge: 'DEMO CASE • CAMPUS INVESTIGATION',
      difficulty: 'Introductory',
      genre: 'Theft & alibi investigation',
      playtime: '15–20 minutes',
      mechanic: 'URL clue following & alibi contradiction',
      scene: 'College Computer Lab, Room 304',
      incidentWindow: '5:05 PM – 6:00 PM',
      briefing: 'A high-spec university laptop containing critical semester project research has disappeared from the computer lab. Follow the clues across each URL, collect the evidence pieces, cross-examine the suspects\' alibis, and submit the final accusation.',
      objective: 'Determine who took the laptop, uncover the false alibi, and recover the device.',
      culpritId: 'rohan',
      culpritName: 'Rohan Patel (Lab Assistant)',
      solutionSummary: 'Rohan Patel, the lab assistant, used his keycard at 5:34 PM to enter the lab wearing a blue hoodie after texting that the lab was empty. He stole the laptop and claimed he was in the library from 5:15 PM, but library RFID records proved he didn\'t arrive until 5:42 PM.',

      suspects: [
        {
          id: 'rohan',
          name: 'Rohan Patel',
          role: 'Computer Lab Assistant',
          avatarIcon: '🧑‍💻',
          suspicionLevel: 'CRITICAL',
          suspicionPercent: 95,
          statedAlibi: 'Claims he was in the Central Campus Library studying continuously from 5:15 PM to 5:50 PM.',
          contradiction: 'Library turnstile records prove he did not arrive until 5:42 PM. His access card swiped into the lab at 5:34 PM, and his phone sent a message at 5:31 PM.',
          motive: 'Was failing his advanced systems course and sought to obtain the project source code to submit as his own.',
          evidenceAgainst: [
            'Electronic keycard #4092 swiped into lab at 5:34 PM',
            'Text from his mobile phone at 5:31 PM: "The lab is empty..."',
            'CCTV captures individual in his signature blue hoodie entering (5:32 PM) and exiting (5:47 PM)',
            'Library turnstile RFID entry clocked at 5:42 PM — 27 minutes after his claimed arrival'
          ],
          isCulprit: true
        },
        {
          id: 'arjun',
          name: 'Arjun Sharma',
          role: 'Computer Science Student',
          avatarIcon: '👨‍🎓',
          suspicionLevel: 'LOW',
          suspicionPercent: 15,
          statedAlibi: 'Was having tea and group study in the student cafeteria from 5:00 PM to 6:15 PM.',
          contradiction: 'None. Multiple student witnesses and cafeteria electronic POS receipt corroborate his continuous presence.',
          motive: 'Had expressed frustration over missing project files earlier in the week.',
          evidenceAgainst: ['No incriminating physical or digital footprint found.'],
          isCulprit: false
        },
        {
          id: 'kabir',
          name: 'Kabir Mehta',
          role: 'Student & Lab Trainee',
          avatarIcon: '👨‍🔬',
          suspicionLevel: 'LOW',
          suspicionPercent: 20,
          statedAlibi: 'Studying in East Wing Dormitory Room 214 from 4:45 PM until evening roll call.',
          contradiction: 'None. Dormitory main entrance turnstile clocked his entry at 5:02 PM with no exit logged before 7:00 PM.',
          motive: 'Was a competitive candidate for the upcoming campus technology fellowship.',
          evidenceAgainst: ['Dormitory swipe logs confirm he never left his floor during the incident.'],
          isCulprit: false
        }
      ],

      clues: [
        {
          id: 1,
          code: 'X7K92',
          title: 'CCTV Footage',
          time: '5:32 PM',
          question: 'What was the person in the CCTV wearing?',
          answers: ['blue hoodie', 'a blue hoodie', 'hoodie', 'blue hoody'],
          hint: 'Inspect the figure entering the lab at 5:32 PM. Look at their upper clothing and color.',
          evidenceId: 'ev_cctv_entry',
          description: 'The CCTV camera shows someone entering the computer lab at 5:32 PM wearing a blue hoodie.'
        },
        {
          id: 2,
          code: 'A4P81',
          title: 'Security Log',
          time: '5:34 PM',
          question: 'Whose access card was used to enter the lab?',
          answers: ['rohan', 'rohan patel', 'rohan\'s', 'rohan\'s card'],
          hint: 'The electronic security door log recorded a card swipe just two minutes after the figure was seen on CCTV.',
          evidenceId: 'ev_keycard',
          description: 'The security system recorded an access-card entry at 5:34 PM. The card belonged to Rohan, the lab assistant.'
        },
        {
          id: 3,
          code: 'M9Q24',
          title: 'Chat Message',
          time: '5:31 PM',
          question: 'Whose phone sent the suspicious message?',
          answers: ['rohan', 'rohan patel', 'rohan\'s phone', 'rohans phone'],
          hint: 'A message was dispatched right before the entry stating "The lab is empty. You can get it now."',
          evidenceId: 'ev_phone_chat',
          description: 'A chat message sent at 5:31 PM says: "The lab is empty. You can get it now." Sent from Rohan\'s phone.'
        },
        {
          id: 4,
          code: 'P3L67',
          title: 'Time Contradiction',
          time: '5:42 PM',
          question: 'What time did Rohan actually enter the library?',
          answers: ['5:42 pm', '5:42pm', '5:42', '05:42 pm', '05:42pm', '05:42', '5.42 pm', '5.42'],
          hint: 'Rohan claimed he was in the library from 5:15 PM, but the automated RFID turnstile reveals his true arrival time.',
          evidenceId: 'ev_library_record',
          description: 'The library entry turnstile shows Rohan entered at 5:42 PM, refuting his claimed 5:15 PM alibi.'
        },
        {
          id: 5,
          code: 'K8Z41',
          title: 'Final Evidence',
          time: '5:47 PM',
          question: 'Who took the laptop?',
          answers: ['rohan', 'rohan patel'],
          hint: 'The exit camera at 5:47 PM confirms the suspect leaving in the same blue hoodie. All evidence converges.',
          evidenceId: 'ev_cctv_exit',
          description: 'A final security photograph shows the person leaving the laboratory at 5:47 PM in Rohan\'s blue hoodie.'
        }
      ],

      evidence: [
        {
          id: 'ev_cctv_entry',
          clueId: 1,
          title: 'CCTV Surveillance: Entrance Feed',
          category: 'Physical / Digital',
          icon: '📹',
          timestamp: '5:32 PM',
          location: 'Block B, Lab 304 Outer Corridor',
          status: 'Captured',
          summary: 'Security footage captures a figure in an oversized blue hoodie entering the computer lab.',
          forensics: 'Timestamp matches precisely with the incident window.',
          suspectLink: 'Matches blue hoodie owned by Rohan Patel.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1a252f"/><circle cx="60" cy="35" r="16" fill="#3498db"/><path d="M40 70 Q60 48 80 70 Z" fill="#2980b9"/><text x="10" y="16" fill="#27ae60" font-family="monospace" font-size="9">REC ● 17:32</text></svg>'
        },
        {
          id: 'ev_keycard',
          clueId: 2,
          title: 'Electronic Access Log #4092',
          category: 'Digital Record',
          icon: '💳',
          timestamp: '5:34 PM',
          location: 'Room 304 Electronic Lock Terminal',
          status: 'Logged',
          summary: 'RFID reader logs Keycard #4092 authorizing door release.',
          forensics: 'Keycard #4092 is uniquely registered to Rohan Patel.',
          suspectLink: 'Rohan Patel (Assigned Cardholder).',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><rect x="15" y="15" width="90" height="50" rx="4" fill="#ecf0f1"/><text x="25" y="56" fill="#2c3e50" font-family="monospace" font-size="8">CARD #4092</text></svg>'
        },
        {
          id: 'ev_phone_chat',
          clueId: 3,
          title: 'Encrypted SMS / Chat Record',
          category: 'Digital Communication',
          icon: '💬',
          timestamp: '5:31 PM',
          location: 'Cell Tower Sector 4',
          status: 'Intercepted',
          summary: 'Outbound text: "The lab is empty. You can get it now."',
          forensics: 'Device IMEI traces directly to Rohan Patel\'s phone.',
          suspectLink: 'Rohan Patel (Device Owner).',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#34495e"/><text x="25" y="44" fill="#2ecc71" font-size="8">"LAB IS EMPTY"</text></svg>'
        },
        {
          id: 'ev_library_record',
          clueId: 4,
          title: 'Library RFID Turnstile Timestamp',
          category: 'Official Record',
          icon: '🏛️',
          timestamp: '5:42 PM',
          location: 'Central Campus Library Turnstiles',
          status: 'Verified Fact',
          summary: 'Turnstile B recorded Rohan entering at 5:42 PM.',
          forensics: '27-minute unaccounted gap destroys his 5:15 PM alibi.',
          suspectLink: 'Contradiction of Rohan\'s stated alibi.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#16a085"/><text x="25" y="44" fill="#c0392b" font-weight="bold" font-size="8">ENTRY: 17:42</text></svg>'
        },
        {
          id: 'ev_cctv_exit',
          clueId: 5,
          title: 'CCTV Surveillance: Exit',
          category: 'Physical / Forensic',
          icon: '📸',
          timestamp: '5:47 PM',
          location: 'Block B Fire Exit Stairwell',
          status: 'Conclusive',
          summary: 'Subject in blue hoodie exiting with laptop bag.',
          forensics: 'Matches Rohan Patel\'s clothing and build.',
          suspectLink: 'Conclusive identification of Rohan Patel.',
          imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><text x="25" y="44" fill="#e74c3c" font-size="8">EXIT WITH BAG</text></svg>'
        }
      ],

      timeline: [
        { time: '17:05', timeLabel: '5:05 PM', title: 'Laptop Last Confirmed in Lab 304', type: 'verified', location: 'Lab 304', description: 'Laptop locked on Station #4.' },
        { time: '17:15', timeLabel: '5:15 PM', title: 'Rohan\'s Claimed Library Arrival', type: 'contradiction', location: 'Library', description: 'Rohan claims he arrived at library; disproved by turnstile.' },
        { time: '17:31', timeLabel: '5:31 PM', title: 'Suspicious SMS Dispatched', type: 'verified', location: 'Cell Tower 4', description: 'Rohan\'s phone texts "The lab is empty. You can get it now."' },
        { time: '17:32', timeLabel: '5:32 PM', title: 'Blue Hoodie Figure Enters', type: 'verified', location: 'Lab 304 CCTV', description: 'Figure in blue hoodie seen entering.' },
        { time: '17:34', timeLabel: '5:34 PM', title: 'Keycard #4092 Swiped', type: 'verified', location: 'Lab Door', description: 'Rohan\'s keycard unlocks lab.' },
        { time: '17:42', timeLabel: '5:42 PM', title: 'Actual Library Turnstile Entry', type: 'contradiction', location: 'Library', description: 'Rohan scans into library 27 minutes late.' },
        { time: '17:47', timeLabel: '5:47 PM', title: 'Suspect Exits via Stairwell', type: 'verified', location: 'Fire Exit', description: 'Figure in blue hoodie leaves with bag.' },
        { time: '18:00', timeLabel: '6:00 PM', title: 'Theft Officially Reported', type: 'verified', location: 'Security Desk', description: 'Laptop reported missing.' }
      ],

      corkboardNodes: [
        { id: 'demo_n_rohan', type: 'suspect', title: 'Rohan Patel (Lab Assistant)', x: 180, y: 140, icon: '🧑‍💻', color: '#c0392b' },
        { id: 'demo_n_cctv', type: 'evidence', title: 'Blue Hoodie CCTV (5:32 PM)', x: 440, y: 80, icon: '📹', color: '#2980b9' },
        { id: 'demo_n_keycard', type: 'evidence', title: 'Card #4092 Swipe (5:34 PM)', x: 480, y: 220, icon: '💳', color: '#f39c12' },
        { id: 'demo_n_sms', type: 'evidence', title: 'Phone SMS (5:31 PM)', x: 160, y: 310, icon: '💬', color: '#27ae60' },
        { id: 'demo_n_alibi', type: 'contradiction', title: 'False Alibi (Claimed 5:15 PM)', x: 460, y: 350, icon: '⚠️', color: '#e74c3c' },
        { id: 'demo_n_turnstile', type: 'evidence', title: 'Library Turnstile (5:42 PM)', x: 720, y: 320, icon: '🏛️', color: '#8e44ad' }
      ],
      corkboardLinks: [
        { from: 'demo_n_rohan', to: 'demo_n_cctv', label: 'Wears blue hoodie' },
        { from: 'demo_n_rohan', to: 'demo_n_keycard', label: 'His personal card #4092' },
        { from: 'demo_n_rohan', to: 'demo_n_sms', label: 'Sent from his phone' },
        { from: 'demo_n_rohan', to: 'demo_n_alibi', label: 'Fabricated alibi' },
        { from: 'demo_n_alibi', to: 'demo_n_turnstile', label: 'Refuted by turnstile log' }
      ]
    }
  };

  return {
    CASES: CASES,
    getAllCases: function () {
      return Object.values(CASES);
    },
    getCaseById: function (id) {
      return CASES[id] || CASES['case1'];
    }
  };
});
