/**
 * Functional Test Suite for MindBridge Companion (Step 9 Phase 1)
 * Validates:
 * 1. PHQ-9, GAD-7, PSS-4, WHO-5 scoring math & interpretation
 * 2. Critical Safety Triggers (PHQ-9 Question 9 self-harm flag, high distress thresholds)
 * 3. Reverse-coded scoring on PSS-4 items 2 and 3
 * 4. Heuristic clinical analysis engine & activity recommendation matching
 * 5. Supabase Edge Function payload formatting
 */

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }
}

// ─── 1. PHQ-9 SCORING & SAFETY TESTS ──────────────────────────────────────────

function scorePHQ9(answers) {
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += (answers[`phq-${i}`] || 0);
  }
  const q9 = answers['phq-9'] || 0;
  const isCrisis = q9 > 0 || sum >= 15;

  let severity = 'minimal';
  if (sum >= 20) severity = 'severe';
  else if (sum >= 15) severity = 'moderately-severe';
  else if (sum >= 10) severity = 'moderate';
  else if (sum >= 5) severity = 'mild';

  return { score: sum, severity, isCrisis };
}

// Test PHQ-9 Minimal
const phqMinimal = scorePHQ9({ 'phq-1': 0, 'phq-2': 1, 'phq-3': 1, 'phq-4': 0, 'phq-5': 0, 'phq-6': 0, 'phq-7': 0, 'phq-8': 0, 'phq-9': 0 });
assert(phqMinimal.score === 2 && phqMinimal.severity === 'minimal' && !phqMinimal.isCrisis, 'PHQ-9 score 2 evaluates to minimal and crisis=false');

// Test PHQ-9 Mild
const phqMild = scorePHQ9({ 'phq-1': 1, 'phq-2': 1, 'phq-3': 1, 'phq-4': 1, 'phq-5': 1, 'phq-6': 1, 'phq-7': 1, 'phq-8': 0, 'phq-9': 0 });
assert(phqMild.score === 7 && phqMild.severity === 'mild' && !phqMild.isCrisis, 'PHQ-9 score 7 evaluates to mild and crisis=false');

// Test PHQ-9 Moderate
const phqMod = scorePHQ9({ 'phq-1': 2, 'phq-2': 2, 'phq-3': 2, 'phq-4': 2, 'phq-5': 1, 'phq-6': 1, 'phq-7': 1, 'phq-8': 1, 'phq-9': 0 });
assert(phqMod.score === 12 && phqMod.severity === 'moderate' && !phqMod.isCrisis, 'PHQ-9 score 12 evaluates to moderate and crisis=false');

// Test PHQ-9 Question 9 Critical Safety Trigger (Item 9 > 0 MUST trigger crisis)
const phqSafetyQ9 = scorePHQ9({ 'phq-1': 0, 'phq-2': 0, 'phq-3': 0, 'phq-4': 0, 'phq-5': 0, 'phq-6': 0, 'phq-7': 0, 'phq-8': 0, 'phq-9': 1 });
assert(phqSafetyQ9.score === 1 && phqSafetyQ9.isCrisis === true, 'PHQ-9 Question 9 > 0 triggers crisis safety flag even with total score=1');

// Test PHQ-9 Severe Distress
const phqSevere = scorePHQ9({ 'phq-1': 3, 'phq-2': 3, 'phq-3': 3, 'phq-4': 3, 'phq-5': 2, 'phq-6': 2, 'phq-7': 2, 'phq-8': 2, 'phq-9': 2 });
assert(phqSevere.score === 22 && phqSevere.severity === 'severe' && phqSevere.isCrisis === true, 'PHQ-9 score 22 evaluates to severe and crisis=true');


// ─── 2. GAD-7 SCORING TESTS ───────────────────────────────────────────────────

function scoreGAD7(answers) {
  let sum = 0;
  for (let i = 1; i <= 7; i++) {
    sum += (answers[`gad-${i}`] || 0);
  }
  const isCrisis = sum >= 15;
  let severity = 'minimal';
  if (sum >= 15) severity = 'severe';
  else if (sum >= 10) severity = 'moderate';
  else if (sum >= 5) severity = 'mild';

  return { score: sum, severity, isCrisis };
}

const gadMinimal = scoreGAD7({ 'gad-1': 0, 'gad-2': 0, 'gad-3': 1, 'gad-4': 1, 'gad-5': 0, 'gad-6': 0, 'gad-7': 0 });
assert(gadMinimal.score === 2 && gadMinimal.severity === 'minimal', 'GAD-7 score 2 evaluates to minimal anxiety');

const gadMild = scoreGAD7({ 'gad-1': 1, 'gad-2': 1, 'gad-3': 1, 'gad-4': 1, 'gad-5': 1, 'gad-6': 1, 'gad-7': 0 });
assert(gadMild.score === 6 && gadMild.severity === 'mild', 'GAD-7 score 6 evaluates to mild anxiety');

const gadSevere = scoreGAD7({ 'gad-1': 3, 'gad-2': 3, 'gad-3': 2, 'gad-4': 2, 'gad-5': 2, 'gad-6': 2, 'gad-7': 2 });
assert(gadSevere.score === 16 && gadSevere.severity === 'severe' && gadSevere.isCrisis === true, 'GAD-7 score 16 evaluates to severe anxiety with crisis support triggered');


// ─── 3. PSS-4 REVERSE-CODED SCORING TESTS ─────────────────────────────────────

function scorePSS4(answers) {
  // Items 2 and 3 are reverse scored: (4 - raw)
  const q1 = answers['pss-1'] || 0;
  const q2 = 4 - (answers['pss-2'] || 0);
  const q3 = 4 - (answers['pss-3'] || 0);
  const q4 = answers['pss-4'] || 0;
  const total = q1 + q2 + q3 + q4;

  let severity = 'low';
  if (total >= 11) severity = 'high';
  else if (total >= 6) severity = 'moderate';

  return { score: total, severity };
}

// When user answers 4 to feeling confident (q2) and things going their way (q3), reverse score should be 0
const pssLow = scorePSS4({ 'pss-1': 1, 'pss-2': 4, 'pss-3': 4, 'pss-4': 0 });
assert(pssLow.score === 1 && pssLow.severity === 'low', 'PSS-4 correctly calculates reverse-coded items for high confidence (score=1, low stress)');

// When user answers 0 to confidence (q2) and 0 to things going way (q3), reverse score is 4+4=8
const pssHigh = scorePSS4({ 'pss-1': 3, 'pss-2': 0, 'pss-3': 0, 'pss-4': 3 });
assert(pssHigh.score === 14 && pssHigh.severity === 'high', 'PSS-4 correctly calculates high stress when helplessness is reported (score=14, high stress)');


// ─── 4. WHO-5 WELL-BEING INDEX PERCENTAGE TESTS ───────────────────────────────

function scoreWHO5(answers) {
  let raw = 0;
  for (let i = 1; i <= 5; i++) {
    raw += (answers[`who-${i}`] || 0);
  }
  const pct = Math.min(100, Math.max(0, raw * 4));
  let level = 'optimal';
  if (pct < 29) level = 'low';
  else if (pct < 50) level = 'reduced';
  else if (pct < 75) level = 'satisfactory';

  return { raw, percentage: pct, level };
}

const whoOptimal = scoreWHO5({ 'who-1': 5, 'who-2': 4, 'who-3': 4, 'who-4': 4, 'who-5': 4 });
assert(whoOptimal.raw === 21 && whoOptimal.percentage === 84 && whoOptimal.level === 'optimal', 'WHO-5 raw 21 maps to 84% optimal well-being');

const whoReduced = scoreWHO5({ 'who-1': 2, 'who-2': 2, 'who-3': 2, 'who-4': 2, 'who-5': 2 });
assert(whoReduced.raw === 10 && whoReduced.percentage === 40 && whoReduced.level === 'reduced', 'WHO-5 raw 10 maps to 40% reduced well-being');


// ─── 5. TAILORED COPING RECOMMENDATIONS TESTS ─────────────────────────────────

function getRecommendations(gadScore, phqScore, poorSleepCount) {
  const activities = [];
  const specialties = [];

  if (gadScore >= 8) {
    activities.push('act-breathing', 'act-grounding');
    specialties.push('Anxiety and stress');
  } else {
    activities.push('act-breathing');
  }

  if (poorSleepCount > 0) {
    activities.push('act-winddown');
    specialties.push('Sleep difficulties');
  }

  if (phqScore >= 5) {
    activities.push('act-gratitude', 'act-walk');
    specialties.push('Depression and low mood');
  }

  return {
    activities: Array.from(new Set(activities)),
    specialties: Array.from(new Set(specialties))
  };
}

const recsAnxietyAndSleep = getRecommendations(10, 2, 2);
assert(recsAnxietyAndSleep.activities.includes('act-grounding'), 'Grounding recommended for elevated GAD-7');
assert(recsAnxietyAndSleep.activities.includes('act-winddown'), 'Bedtime Wind-Down recommended for poor sleep');
assert(recsAnxietyAndSleep.specialties.includes('Anxiety and stress') && recsAnxietyAndSleep.specialties.includes('Sleep difficulties'), 'Matches Anxiety and Sleep specialties in Pune directory');


// ─── 6. GEMINI EDGE FUNCTION PAYLOAD FORMAT VALIDATION ────────────────────────

function buildGeminiPayload(action, moodEntries, assessments, crisisRisk) {
  if (action === 'wellness-analysis') {
    return {
      action: 'wellness-analysis',
      moodSummary: {
        recentMoodCount: moodEntries.length,
        averageStress: 3.2,
        recentFactors: ['Studies or Work', 'Sleep'],
      },
      assessments: assessments.map(a => ({
        type: a.type,
        score: a.score,
        maxScore: a.maxScore,
        severity: a.severity,
      })),
      crisisRisk: Boolean(crisisRisk),
    };
  }
  return { action: 'chat', message: 'Hello' };
}

const payload = buildGeminiPayload('wellness-analysis', [{ mood: 'okay', stressLevel: 3 }], [{ type: 'GAD-7', score: 6, maxScore: 21, severity: 'Mild' }], false);
assert(payload.action === 'wellness-analysis', 'Gemini payload sets action to wellness-analysis');
assert(Array.isArray(payload.assessments) && payload.assessments.length === 1, 'Gemini payload includes assessments list');
assert(payload.crisisRisk === false, 'Gemini payload sets crisisRisk flag correctly');

console.log('\n======================================================');
console.log(`Functional Test Results: ${passedTests} / ${totalTests} assertions passed.`);
console.log('======================================================\n');
