export interface CompanionResponse {
  reply: string;
  suggestedAction?: 'breathing' | 'grounding' | 'journal';
  isCrisis?: boolean;
}

export const generateCompanionReply = (userMessage: string): CompanionResponse => {
  const text = userMessage.toLowerCase().trim();

  // 1. Crisis / Immediate safety check (non-punitive, supportive)
  const crisisKeywords = [
    'kill myself', 'suicide', 'hurt myself', 'end my life', 'end it all', 
    'want to die', 'harm myself', 'cannot live anymore', 'overdose'
  ];
  if (crisisKeywords.some(keyword => text.includes(keyword))) {
    return {
      reply: "I hear how much pain you're carrying right now, and I want you to know that you are not alone. Because I'm an AI wellness companion, I cannot provide crisis care or emergency support, but there are compassionate, trained people available right this second who want to listen and help you through this.",
      isCrisis: true
    };
  }

  // 2. Academic stress / studies / exams / deadlines
  if (
    text.includes('stud') || text.includes('exam') || text.includes('grade') ||
    text.includes('assignment') || text.includes('homework') || text.includes('school') ||
    text.includes('college') || text.includes('deadline') || text.includes('test')
  ) {
    return {
      reply: "Academic pressure can feel intense when deadlines pile up. It's completely valid to feel strained. When everything feels urgent, our minds often freeze.\n\nTry the **'Single Next Step'** strategy: pick just one task and work on it for 15 minutes with zero expectation of finishing the whole thing. Give yourself permission to pause afterward.\n\nWould you like to try breaking down one specific assignment together, or take a quick breathing reset first?",
      suggestedAction: 'breathing'
    };
  }

  // 3. Anxiety / worry / panic / feeling tense / racing heart
  if (
    text.includes('anxi') || text.includes('worry') || text.includes('nervous') ||
    text.includes('panic') || text.includes('freak') || text.includes('scared') ||
    text.includes('tense') || text.includes('uneasy')
  ) {
    return {
      reply: "Anxiety is your body's alarm system trying to protect you, but sometimes that alarm rings louder than necessary. You are safe in this present moment.\n\nLet's soothe your nervous system together. Notice your feet touching the floor. Let your jaw soften and gently unclench your teeth.\n\nWould you like to do a quick 2-minute Guided Breathing session or our 5-4-3-2-1 Sensory Grounding exercise?",
      suggestedAction: 'grounding'
    };
  }

  // 4. Sleep difficulties / insomnia / racing thoughts before bed
  if (
    text.includes('sleep') || text.includes('insomnia') || text.includes('tired') ||
    text.includes('bed') || text.includes('awake') || text.includes('night') || text.includes('exhaust')
  ) {
    return {
      reply: "Trouble sleeping is so frustrating, especially when your body feels exhausted but your mind won't quiet down. Often, racing thoughts occur because the brain finally has quiet time to process the day.\n\nA gentle strategy is a **'Brain Dump'**: write down whatever is circling in your head onto a blank page so your mind knows those thoughts won't be forgotten overnight.\n\nWould you like to try a calming Journal Prompt to release your thoughts before resting?",
      suggestedAction: 'journal'
    };
  }

  // 5. Overwhelmed / don't know where to start / chaotic feeling
  if (
    text.includes('overwhelm') || text.includes('too much') || text.includes('where to start') ||
    text.includes('chaotic') || text.includes('drowning') || text.includes('lost')
  ) {
    return {
      reply: "When everything demands your attention at once, overwhelm is a very natural response. You don't have to solve your whole week or even your whole day right now.\n\nLet's shrink the horizon to just the next 10 minutes. Take a sip of water, take one slow breath, and set aside everything except one tiny priority.\n\nWould you like to write down what's on your mind in our journal space to declutter your thoughts?",
      suggestedAction: 'journal'
    };
  }

  // 6. Low mood / sadness / feeling down / feeling empty
  if (
    text.includes('sad') || text.includes('low') || text.includes('down') ||
    text.includes('cry') || text.includes('depress') || text.includes('empty') ||
    text.includes('unhappy') || text.includes('lonely')
  ) {
    return {
      reply: "Thank you for sharing that with me. It takes real honesty to admit when things feel heavy. Please remember that you don't have to force yourself to feel cheerful or productive right now.\n\nBe as gentle with yourself today as you would be with a dear friend going through a tough time. Even resting quietly or drinking warm tea counts as taking care of yourself.\n\nWould you like to talk more about what's feeling heavy, or would you prefer a peaceful grounding distraction?",
      suggestedAction: 'grounding'
    };
  }

  // 7. Motivation / procrastination / lack of energy / feeling stuck
  if (
    text.includes('motivat') || text.includes('procrastinat') || text.includes('lazy') ||
    text.includes('stuck') || text.includes('focus') || text.includes('unproductive')
  ) {
    return {
      reply: "Struggling with motivation usually isn't laziness—it's often emotional friction, fatigue, or the feeling that a task has to be done perfectly.\n\nA gentle practice is the **'Two-Minute Entry'**: commit to doing just two minutes of an activity. If you want to stop after two minutes, you have full permission to do so. Often, starting is the hardest part.\n\nWhat is one small thing on your mind that we could make easier for you today?",
    };
  }

  // 8. Routine / Healthy habits / wellness lifestyle
  if (
    text.includes('routine') || text.includes('habit') || text.includes('lifestyle') ||
    text.includes('balance') || text.includes('self-care') || text.includes('plan')
  ) {
    return {
      reply: "Building a healthier routine works best when it's built on self-kindness rather than rigid rules. Small, consistent anchors—like 5 minutes of morning daylight, drinking water before coffee, or stepping outside—transform your emotional well-being over time.\n\nWhich area of your daily rhythm would you like to feel more peaceful: your mornings, your afternoons, or your evenings?",
    };
  }

  // 9. Relaxation / Calm / Peace of mind
  if (
    text.includes('relax') || text.includes('calm') || text.includes('peace') ||
    text.includes('breathe') || text.includes('quiet') || text.includes('stress')
  ) {
    return {
      reply: "Taking time to pause is a gift to your nervous system. Even a couple of minutes of deliberate stillness signals to your body that it is safe to rest.\n\nTry dropping your shoulders away from your ears, loosening your hands, and taking a deep inhale through your nose followed by a slow exhale through your mouth.\n\nWould you like to try our visual Guided Breathing exercise right now?",
      suggestedAction: 'breathing'
    };
  }

  // 10. General Supportive Fallback
  return {
    reply: "Thank you for sharing that with me. I'm here to listen without judgment. Every emotion you experience carries useful information about what you need right now.\n\nCould you tell me a little more about what's been on your mind, or would you like to explore a quick breathing or grounding exercise together?",
    suggestedAction: 'breathing'
  };
};
