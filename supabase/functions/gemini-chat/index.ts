import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `You are MindBridge Companion, a compassionate, warm, and supportive AI mental wellness companion.
Your mission is to provide non-judgmental emotional validation, gentle active listening, and evidence-informed coping strategies.

Key guidelines:
1. Warmth & Empathy: Acknowledge the user's emotional experience first before offering tools. Keep tone gentle, calm, and reassuring.
2. Practical Coping Tools: When appropriate, offer simple, self-directed exercises such as:
   - 4-4-4 Box Breathing or 4-7-8 relaxing breathing
   - 5-4-3-2-1 sensory grounding technique
   - "Unsent Thoughts" or cognitive defusion journaling
   - Gentle physical tension releases (shoulder drop, unclenched jaw)
3. Medical & Clinical Boundaries:
   - You are an AI wellness companion, NOT a medical doctor, psychiatrist, or licensed therapist.
   - NEVER diagnose mental health conditions (e.g. "You have major depressive disorder" or "You have clinical anxiety").
   - NEVER prescribe or recommend psychiatric medications.
   - Do not claim to replace professional psychological therapy.
4. Crisis Safety:
   - If the user mentions suicidal thoughts, self-harm, severe abuse, or feeling in immediate physical danger, respond with deep compassion and immediately provide crisis resources (e.g., Suicide & Crisis Lifeline: call/text 988, Tele-MANAS in India: call 14416 or 1800-891-4416, or local emergency services).
5. Brevity & Flow:
   - Keep responses easy to digest (2-4 gentle paragraphs maximum). Avoid overwhelming the user with massive walls of text.`;

async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verify User Authentication (JWT)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required. Please sign in to speak with the AI Companion.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing bearer token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired session token. Please log in.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch server-side secret GEMINI_API_KEY
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY secret is not set in Supabase Edge Function Secrets.');
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Supabase Edge Function Secrets. Please set GEMINI_API_KEY under Project Settings -> Edge Functions -> Secrets in your Supabase Dashboard.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'chat';

    let promptContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    let systemInstructionText = SYSTEM_PROMPT;

    if (action === 'wellness-analysis') {
      systemInstructionText = `You are MindBridge Clinical Wellness AI, a warm, validating, evidence-based mental wellness companion.
You are generating a personalized, empathetic wellness summary for a user based on their consented emotional check-ins and non-diagnostic screening assessments (e.g. PHQ-9, GAD-7, PSS-4, WHO-5).

Key Guidelines:
1. Warmth & Validation: Greet the user gently, acknowledge their vulnerability, and validate their recent emotional experiences.
2. Strengths & Resilience: Highlight their strengths, self-care steps, or areas of emotional resilience.
3. Mind-Body Insights: Thoughtfully connect sleep patterns and stress levels to emotional well-being without making clinical claims.
4. Actionable Coping Tools: Recommend 2-3 concrete evidence-based exercises (e.g., 4-4-4 Box Breathing, 5-4-3-2-1 Sensory Grounding, or Bedtime Wind-Down).
5. Non-Diagnostic Disclaimer: Keep the tone educational and supportive. Never diagnose illnesses or prescribe treatments.
6. Indian Support Resources: If high distress is observed, gently remind them of trusted support like Tele-MANAS (14416) or KIRAN (1800-599-0019).
7. Brevity: Keep the response to 2-3 warm, clear paragraphs.`;

      const moodInfo = JSON.stringify(body.moodSummary || {});
      const assessmentsInfo = JSON.stringify(body.assessments || []);
      const crisisNote = body.crisisRisk ? 'CRISIS CONCERN: User reported elevated distress or self-harm ideation.' : 'Standard self-care check.';

      promptContents = [
        {
          role: 'user',
          parts: [{
            text: `Please generate my personalized wellness analysis.
Recent check-in trends: ${moodInfo}
Screening assessments: ${assessmentsInfo}
Status note: ${crisisNote}

Provide an empathetic, encouraging 2-3 paragraph wellness synthesis with insights and gentle coping recommendations.`
          }]
        }
      ];
    } else {
      const message = body.message?.trim();
      const history = Array.isArray(body.history) ? body.history : [];

      if (!message) {
        return new Response(
          JSON.stringify({ error: 'Message cannot be empty.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Format conversation contents for Gemini API (capped at last 6 messages for context & privacy)
      for (const h of history.slice(-6)) {
        if (h.sender === 'user' && h.text) {
          promptContents.push({ role: 'user', parts: [{ text: h.text }] });
        } else if (h.sender === 'ai' && h.text) {
          promptContents.push({ role: 'model', parts: [{ text: h.text }] });
        }
      }

      // Append current message
      promptContents.push({ role: 'user', parts: [{ text: message }] });
    }

    // 5. Query Gemini API (Try gemini-2.0-flash, then gemini-1.5-flash, then gemini-2.5-flash)
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];
    let geminiResponse: Response | null = null;
    let selectedModel = modelsToTry[0];
    let lastErrorDetails = '';

    for (const model of modelsToTry) {
      selectedModel = model;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

      try {
        geminiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstructionText }],
            },
            contents: promptContents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 800,
            },
          }),
        });

        if (geminiResponse.ok) {
          break;
        }

        const errText = await geminiResponse.text().catch(() => '');
        lastErrorDetails = errText;
        console.warn(`Model ${model} returned status ${geminiResponse.status}`);

        // Try next model if 404/400 (model deprecated or not supported for this key)
        if (geminiResponse.status === 404 || geminiResponse.status === 400) {
          continue;
        } else {
          // Break immediately on 403 (invalid key) or 429 (rate limit)
          break;
        }
      } catch (fetchErr: any) {
        lastErrorDetails = fetchErr.message;
        console.warn(`Fetch error for model ${model}:`, fetchErr.message);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      let friendlyError = `Gemini API request failed (${geminiResponse?.status || 500}).`;
      if (geminiResponse?.status === 400 || geminiResponse?.status === 403) {
        friendlyError = 'Invalid or unauthorized GEMINI_API_KEY. Please verify your API key in Supabase Secrets.';
      } else if (geminiResponse?.status === 429) {
        friendlyError = 'Google Gemini API quota or rate limit exceeded. Please wait a moment and try again.';
      }

      return new Response(
        JSON.stringify({
          error: friendlyError,
          details: lastErrorDetails ? lastErrorDetails.slice(0, 250) : undefined,
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const candidate = geminiData.candidates?.[0];
    const replyText = candidate?.content?.parts?.[0]?.text;

    if (!replyText) {
      return new Response(
        JSON.stringify({ error: 'Received an empty response from Gemini. Please try again.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Detect suggested action for frontend interactive modals
    let suggestedAction: 'breathing' | 'grounding' | 'journal' | undefined;
    const lowerReply = replyText.toLowerCase();
    const lowerMsg = message.toLowerCase();

    if (lowerReply.includes('box breathing') || lowerReply.includes('breath') || lowerMsg.includes('breathe') || lowerMsg.includes('panic')) {
      suggestedAction = 'breathing';
    } else if (lowerReply.includes('grounding') || lowerReply.includes('5-4-3-2-1') || lowerMsg.includes('overwhelm') || lowerMsg.includes('ground')) {
      suggestedAction = 'grounding';
    } else if (lowerReply.includes('journal') || lowerReply.includes('write down') || lowerMsg.includes('sleep') || lowerMsg.includes('racing thoughts')) {
      suggestedAction = 'journal';
    }

    // 7. Check for crisis safety triggers
    const isCrisis =
      lowerMsg.includes('suicide') ||
      lowerMsg.includes('kill myself') ||
      lowerMsg.includes('end my life') ||
      lowerMsg.includes('want to die') ||
      lowerReply.includes('988') ||
      lowerReply.includes('lifeline');

    return new Response(
      JSON.stringify({
        reply: replyText,
        suggestedAction,
        isCrisis,
        model: selectedModel,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Unhandled error in gemini-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error processing companion response.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Support both Deno.serve and export default fetch
Deno.serve(handleRequest);
export default { fetch: handleRequest };
