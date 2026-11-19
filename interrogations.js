/**
 * ============================================================================
 * MYSTERBOX INTERROGATION DATABASE
 * ============================================================================
 * Every suspect can be questioned, but the detective only gets to ask
 * QUESTION_LIMIT (2) of the 4 prepared questions per suspect. Choose wisely:
 * the answers contain slips, verifiable alibis and pointers to other suspects.
 *
 * Shared by the browser (window.MysteryInterrogations) and the Node server
 * (require('./interrogations.js')), which validates submissions against it.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MysteryInterrogations = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var QUESTION_LIMIT = 2;

  // Raw data: caseId -> suspectId -> [ [question, answer], x4 ]
  var RAW = {
    // ------------------------------------------------------------------
    // CASE 01 - DEATH AT ROOM 309
    // ------------------------------------------------------------------
    case1: {
      victor: [
        ['Where exactly were you between 11:00 PM and midnight?',
         '"In my ground-floor office going through shift logs. I never left my desk. Nobody saw me, of course - I work alone at night - but the logs are timestamped."'],
        ['The third-floor CCTV went dark at 11:35 PM. Do you know why?',
         '"Old wiring. That corridor circuit has tripped before. I only noticed the breaker panel in my office had been reset when I came back to it. I mean... when I checked it afterwards."'],
        ['Did Mr. Vance have any complaint about you or the hotel?',
         '"None whatsoever. We spoke about the suite deposits earlier. Routine accounting questions, nothing more. He liked counting other people\'s money, that\'s all."'],
        ['Who is able to create a master keycard?',
         '"Only the encoder in my office, and only on a manager\'s authorisation. I don\'t recall making any extras today. You would have to check the encoder log for anything around early evening."']
      ],
      adrian: [
        ['Where were you when Arthur Vance died?',
         '"Vance and I argued in the lounge around 10:15 over our buyout. I left at 10:45 in a taxi to the airport hotel. Pull the cab GPS and the lobby turnstile - I was across the city when this happened."'],
        ['How did Vance seem that evening?',
         '"Angry at me, yes, but more worried about the hotel itself. He muttered that the hotel\'s own books did not add up and that he would be calling the police in the morning."'],
        ['Did you see anyone near Room 309 before you left?',
         '"The manager, Hayes, was hovering by the elevators on the third floor. He said he would personally make sure Vance\'s room stayed quiet. Odd for a manager to walk the floors himself at night."'],
        ['Would you benefit from his death?',
         '"The buyout dispute - a dead partner is cheaper than a live one, I know how that sounds. But my lawyers had the settlement drafted and I needed him alive to sign it."']
      ],
      elena: [
        ['When did you last see Mr. Vance alive?',
         '"At 11:10 PM. I brought his chamomile tea as I do every night. He was annoyed and on the phone. I went to my room on the second floor at 11:18 and did not leave it."'],
        ['Was the tea ever out of your sight?',
         '"I made it in the pantry and carried it straight up. He had only taken a sip when I left. If it was dosed, it happened later, and I do not know how anyone got into a deadbolted room."'],
        ['You are a beneficiary of his insurance policy. Explain.',
         '"A minor one. I learned about it after the funeral arrangements began. Mr. Vance was not a generous man; I lose a salary I rely on. I had no reason to want him gone."'],
        ['Did you notice anything unusual that night?',
         '"Around 11:30 I heard the third-floor housekeeping carts rattle past the service lift. The girls told me later the manager had called them down to the basement for an urgent inventory. At that hour!"']
      ],
      sophia: [
        ['Where were you at 11:40 PM?',
         '"Driving in from the state capital. I crossed the interstate bridge at 11:50 - the toll plaza has the timestamp - and reached the hotel at 12:15."'],
        ['What was your relationship with your father?',
         '"Strained. He threatened to cut me out of his revised will. But dead before he signed, I would have gotten more - which is exactly why I wanted him alive and persuaded, not dead."'],
        ['Why were you travelling to the hotel that night?',
         '"He phoned at 9 PM. He said he finally had proof of who was robbing him and wanted family close by as a witness. That is why I was on the road in the middle of the night."'],
        ['Who knew what was kept in the safe?',
         '"Dad kept bearer bonds in the suite safe. He told nobody. But hotels keep override codes for suite safes in the management office - that is standard practice."']
      ]
    },

    // ------------------------------------------------------------------
    // CASE 02 - THE LAST AUCTION
    // ------------------------------------------------------------------
    case2: {
      rachel: [
        ['Where were you standing during the bidding?',
         '"On the media riser, shooting crowd reactions the whole time. Well - I moved around for angles. Wide shots of the pedestal, naturally. It is the star of the show."'],
        ['Why did the lights flicker at 9:28 PM?',
         '"No idea. The dimmer rail probably overloaded with all the staging lights. My strobe runs off a battery pack. I did not plug anything into the venue power."'],
        ['Tell me about your camera equipment.',
         '"Standard 400mm lens, I take it everywhere. The barrel is velvet-lined to protect the optics. And do not ask me to unscrew it - it is calibrated, and the guards already waved it through."'],
        ['What did you know about the diamond before tonight?',
         '"The catalogue says 120 carats. The final receipt said 112... wait. Which receipt? I only read the catalogue, I mean."']
      ],
      marcus: [
        ['Where were you when the lights dropped?',
         '"At the central podium on live microphone with the telephone bidders. The audio recording captures my commentary before, during and after the flicker. I never stopped talking."'],
        ['Did you see anything near the pedestal?',
         '"The pedestal is below and to my left. The lights were out, but a camera strobe popped a few seconds before the dark - from the media side. I saw the photographer stepping up to the rope."'],
        ['Was there anything odd about the paperwork?',
         '"The final receipt came back with a weight of 112 carats. My script said 120. I flagged it to the registrar - someone had edited the duplicate after the catalogue went to print."'],
        ['You earn a commission. Did you want the sale to proceed?',
         '"Ten percent of a legitimate sale. A stolen diamond pays me nothing, and it ruins my reputation. Nobody had more reason to keep it on that pedestal."']
      ],
      isabella: [
        ['What was your position during the auction?',
         '"Front row. I bid up to eighteen million before a telephone bidder outbid me. Security searched me and my handbag twice. They found nothing."'],
        ['What did you notice at the moment of the flicker?',
         '"A faint high-pitched whine, like a glass cutter, and a capacitor charging sound from the media side of the room. Then the lights dipped."'],
        ['Why would you steal what you could simply buy?',
         '"I wanted it for my Geneva collection, certainly. But if I wanted it that badly, I would have kept bidding. I lost fairly."'],
        ['Did anyone seem unusually interested in the diamond?',
         '"The photographer. She kept stepping up to the rope and took more shots of the stone than of the bidders. Everyone else was watching the auctioneer."']
      ],
      daniel: [
        ['Where were you at 9:28 PM?',
         '"I was on the perimeter hallway securing the exits. My keycard swipes will confirm it. At 9:30 I ran to the main panel to restore the backup lighting."'],
        ['Who had access to the area around the pedestal?',
         '"VIP passes numbered 1 to 12. Number 7 was the media pass with floor-wide clearance. Only one person carried it."'],
        ['What caused the blackout?',
         '"The dimmer panel was overloaded. The surge came from a terminal outlet on the media riser. The access log shows high-discharge gear being plugged in at 9:26 PM."'],
        ['Was everyone and everything searched on the way out?',
         '"Everyone, yes. Equipment cases too - but cameras were only swept for transmitters. We did not open lens barrels."']
      ],
      oliver: [
        ['Where were you when the lights went out?',
         '"At the champagne fountain at the rear, talking with guests. Any of them will vouch for me."'],
        ['Why did you try to inspect the pedestal at 8:40 PM?',
         '"Professional curiosity. I represent a rival house and wanted to see the cut and the weight certificate. The guards turned me away. But the photographer got closer than anyone - she was at the glass during setup \'adjusting reflections\'."'],
        ['Did you see the diamond up close at any point?',
         '"At the preview. After the lights returned, the stone in the case looked wrong - duller, with fake glints. A trained eye notices that."'],
        ['Did anybody seem nervous?',
         '"The photographer kept checking her watch. At 9:27 she lifted her camera toward the pedestal rather than toward the crowd."']
      ]
    },

    // ------------------------------------------------------------------
    // CASE 03 - THE 2:17 INCIDENT
    // ------------------------------------------------------------------
    case3: {
      olivia: [
        ['Where were you between 11:30 PM and 3:00 AM?',
         '"Asleep at home until security called me at 3:00. My phone was on the nightstand charging all night, if that is your next question."'],
        ['Do you have access to Tetramine B?',
         '"The restricted inventory requires my signature, but I have not withdrawn any in months. Anyone with my audit code could have... but nobody else has it, of course. Someone must have forged it."'],
        ['What was your relationship with Professor Finch?',
         '"Professional disagreements about grant allocation. Nothing about patents. I like to think he would have talked to me before doing anything rash, like that ethics board nonsense he was drafting."'],
        ['Who holds an executive override keycard?',
         '"Only the dean and me. Mine has not left my purse. If somebody used one at ten past two, that is theft, and I would like to know who."']
      ],
      ethan: [
        ['Where were you when Finch collapsed?',
         '"In the library study carrels writing my dissertation chapter. I left at 2:19 AM and reached the lab at 2:22 to find him collapsed. I called 911 and did CPR."'],
        ['What did you see inside the lab?',
         '"Finch slumped over his desk, his herbal tea thermos beside him, the workstation screen blank - the drive had been wiped - and the notebook gone from the drawer."'],
        ['What was your relationship with Finch?',
         '"He is my sole advisor and I need him alive for my defense. Last week he told me he was documenting an ownership problem, that the department head had been taking credit for his work."'],
        ['Did you notice anyone near the lab?',
         '"Crossing the quad around 2:20 I walked past the faculty lot. Dr. Hart\'s reserved space is always empty at night. Tonight her car was in it."']
      ],
      noah: [
        ['When did you leave the building?',
         '"At 1:45 AM, after setting up an automated centrifuge run. The turnstile logged my exit at 1:47. I was off campus when this happened."'],
        ['Did Finch say anything to you before you left?',
         '"He was in a mood, shredding old printouts and typing something fast. He said, \'If something happens to me, the ethics board gets it.\' He told me Dr. Hart had been in his lab drawer last week \'to review the notebook\'."'],
        ['Who can open the restricted chemical locker?',
         '"Students cannot even open that locker. It takes the Department Head\'s signature or the director\'s."'],
        ['You have a rivalry with Ethan. Tell me about it.',
         '"Authorship order on a paper. Petty, honestly. I would never hurt Finch, and Ethan is too soft to do it either."']
      ],
      liam: [
        ['Where were you at 2:17 AM?',
         '"Asleep in the basement technician lounge on standby duty. My badge-in was 1:15 AM and I did not leave until the alarm woke me."'],
        ['You work with the chemical inventory. How does that work?',
         '"I stock the shelves, but the restricted cabinet needs a Department Head authorization code. I do not hold one. The audit system pinged my tablet at 2:00 AM with a withdrawal signed by Dr. Hart. I rolled over and ignored it. I should not have."'],
        ['What happened when the alarm sounded?',
         '"The environmental hazard alarm went off at 2:17. I came up at 2:25 and campus security was already there."'],
        ['Who would know how to get at Finch?',
         '"Finch always drank herbal tea from that thermos. Anyone who knew his habits would know exactly where to dose it. Dr. Hart used to tease him about it."']
      ],
      maya: [
        ['Where were you between 1:00 AM and 3:00 AM?',
         '"On a video conference with our European partners from my home office. The IP connection logs show an active stream the entire time."'],
        ['Did Finch contact you that night?',
         '"At 1:55 AM he messaged: \'Sending the ethics board the draft; Hart cannot see it.\' I only saw it after my call ended."'],
        ['You disagreed with Finch about the synthesis. Explain.',
         '"I thought commercialising it was unethical. I would never harm a colleague. He told me he planned to report the department head for taking credit for his research."'],
        ['Who gains the most if the algorithm is stolen?',
         '"Whoever controls the patent. The pharma licensing deal runs through the Department Head\'s office. With Finch and his notebook gone, she would hold sole authorship."']
      ]
    },

    // ------------------------------------------------------------------
    // CASE 04 - THE LAST TRAIN TO BLACKWOOD
    // ------------------------------------------------------------------
    case4: {
      collins: [
        ['Where were you during the journey?',
         '"In the caboose security cabin, watching the camera feeds the entire trip."'],
        ['The train stopped around midnight. Why?',
         '"A signal fault, standard procedure. I did not leave the cabin. The Coach C camera glitched about then; I only noticed afterwards."'],
        ['Did you know Julian Vance?',
         '"Never met him. I saw the name on the manifest. A journalist - a pest for the railway, but nothing more."'],
        ['Did you send any messages on the security radio channel?',
         '"Just routine check-ins on channel 4. Nothing like \'extraction complete\'. I do not know where you heard that."']
      ],
      blake: [
        ['Where were you between 11:35 and 11:50 PM?',
         '"Checking tickets in Coaches A, B and C. I saw Vance in Seat 14 and he looked fine. My punched tickets and the passenger log prove my rounds."'],
        ['Why did you leave Coach C?',
         '"A passenger dispute in Coach B over a mismatched ticket - #884, destination Oakhaven. Oakhaven closed years ago but she insisted loudly. It took ten minutes. When I got back Coach C was quiet."'],
        ['Who ordered the stop at midnight?',
         '"Not me. The schedule had no stop. Officer Collins radioed to hold passengers seated because of a \'track issue\'. I did not question security."'],
        ['Who else was walking Coach C that night?',
         '"Officer Collins came through around 11:55 \'checking the doors\'. In all my runs, I have never seen him do that."']
      ],
      amelia: [
        ['Where were you sitting?',
         '"Coach C, Seat 16. I fell asleep with headphones on after departure and only woke when we reached Blackwood."'],
        ['What did you notice about the man in Seat 14?',
         '"He was typing on a laptop, nervous, and kept glancing at the baggage door at the rear of the coach."'],
        ['Did you hear anything while you slept?',
         '"One earbud slipped out. I heard a key turn in the carriage door and a man say, \'Mr. Vance, security. You need to come with me.\' I assumed it was a ticket check."'],
        ['Can you describe the man?',
         '"Railway uniform, heavy build, silver ring, a lanyard with a security badge, and a big ring of keys - a master key, I think."']
      ],
      whitmore: [
        ['Where were you that night?',
         '"At the editorial office in Capital City. I sent a warning telegram at 11:15 PM - the transmission records will confirm it."'],
        ['What did your telegram say?',
         '"\'The syndicate knows the 11:30. Do not trust railway security.\' He replied that he had already boarded."'],
        ['What was Julian carrying?',
         '"The ledger proving the cartel\'s payments. He told me he had hidden a memo in his notebook naming the insider on the train."'],
        ['Who in railway security was working for the cartel?',
         '"Julian never gave me the full name over the phone. He said if he vanished, look at the sidings - and at a security officer called Collins."']
      ],
      evelyn: [
        ['Where were you going that night?',
         '"To visit family in Oakhaven."'],
        ['Oakhaven station closed five years ago. Explain your ticket.',
         '"Did it? The agent sold me the ticket. I never checked. Maybe the line was rebuilt."'],
        ['Why did you argue with the conductor?',
         '"A woman has to make herself heard. I was told to hold my ground as long as it took - I mean, I was determined to."'],
        ['Do you know anybody else on this train?',
         '"Nobody. Except that security officer in the uniform - he nodded at me when I boarded. Nothing more."']
      ]
    },

    // ------------------------------------------------------------------
    // CASE 00 - THE MISSING LAPTOP (DEMO)
    // ------------------------------------------------------------------
    demo: {
      rohan: [
        ['Where were you at 5:15 PM?',
         '"In the Central Library from 5:15 sharp until 5:50, studying the whole time. I was one of the first ones in."'],
        ['A figure in a blue hoodie entered the lab at 5:32 PM. Is that you?',
         '"I own a blue hoodie, so does half the campus. I locked up the lab at 5:05 and I was not back in there after that."'],
        ['Your access card #4092 opened the lab door at 5:34 PM.',
         '"Cards get lent around. I might have lent mine to somebody earlier - I do not remember who. Anyone can copy a card."'],
        ['Did you send any messages around 5:30 PM?',
         '"No. My phone was in my bag on silent. Why would I tell anybody that the lab was empty?"']
      ],
      arjun: [
        ['Where were you during the theft?',
         '"In the student cafeteria from 5:00 to 6:15 with a study group. There is a POS receipt for our tea and about six witnesses."'],
        ['Were you upset about missing project files?',
         '"Yes, I was angry - everyone\'s files live on those machines. But I keep cloud backups, and I would never steal a laptop."'],
        ['Did you see anyone heading for the lab?',
         '"From the cafeteria window around 5:30, I saw Rohan walking toward the lab in his blue hoodie. He had told people he was off to the library at 5:15."'],
        ['Who knew the laptop held valuable source code?',
         '"Everybody in the lab knows. But only the lab assistant who set up the machine knew exactly which station it was on and when the room would be empty."']
      ],
      kabir: [
        ['Where were you from 4:45 PM onward?',
         '"In my East Wing dorm, Room 214. The turnstile logged my entry at 5:02 and I did not leave before 7:00."'],
        ['You are competing for the fellowship. Did that tempt you?',
         '"I am in the race, yes. That does not make me a thief. I would rather win on merit."'],
        ['Who has access to the lab after hours?',
         '"Trainees\' cards stop working at 5 PM. Only the assistant\'s card, #4092, opens the lab after hours."'],
        ['Have you heard anything about other students?',
         '"People say Rohan is failing advanced systems and is desperate. He has been asking who has the final project code."']
      ]
    }
  };

  // Expand raw tuples into question objects with stable ids.
  var BY_CASE = {};
  Object.keys(RAW).forEach(function (caseId) {
    BY_CASE[caseId] = {};
    Object.keys(RAW[caseId]).forEach(function (suspectId) {
      BY_CASE[caseId][suspectId] = RAW[caseId][suspectId].map(function (pair, i) {
        return {
          id: caseId + '_' + suspectId + '_q' + (i + 1),
          question: pair[0],
          answer: pair[1]
        };
      });
    });
  });

  return {
    QUESTION_LIMIT: QUESTION_LIMIT,
    byCase: BY_CASE,
    getQuestions: function (caseId, suspectId) {
      return (BY_CASE[caseId] && BY_CASE[caseId][suspectId]) || null;
    }
  };
});
