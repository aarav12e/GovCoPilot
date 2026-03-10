import json
from config import GEMINI_API_KEY, ANTHROPIC_API_KEY

GEMINI_OK = False
CLAUDE_OK = False
gemini_model = None
claude_client = None

def _init_gemini():
    global gemini_model, GEMINI_OK
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            gemini_model = genai.GenerativeModel("gemini-1.5-pro")
            GEMINI_OK = True
        except Exception as e:
            print(f"Gemini init failed: {e}")

def _init_claude():
    global claude_client, CLAUDE_OK
    if ANTHROPIC_API_KEY and ANTHROPIC_API_KEY != "your_anthropic_api_key_here":
        try:
            import anthropic
            claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
            CLAUDE_OK = True
        except Exception as e:
            print(f"Claude init failed: {e}")

_init_gemini()
_init_claude()


async def call_llm(prompt: str, system: str = "", max_tokens: int = 2000) -> str:
    full = f"{system}\n\n{prompt}" if system else prompt

    if GEMINI_OK and gemini_model:
        try:
            import google.generativeai as genai
            resp = gemini_model.generate_content(
                full,
                generation_config=genai.types.GenerationConfig(max_output_tokens=max_tokens, temperature=0.3)
            )
            return resp.text
        except Exception as e:
            print(f"Gemini error: {e}")

    if CLAUDE_OK and claude_client:
        try:
            msg = claude_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=max_tokens,
                system=system or "You are a helpful AI assistant for Indian government officials.",
                messages=[{"role": "user", "content": prompt}]
            )
            return msg.content[0].text
        except Exception as e:
            print(f"Claude error: {e}")

    return _demo(prompt)


def _demo(prompt: str) -> str:
    p = prompt.lower()
    if "summar" in p:
        return json.dumps({
            "summary": "This government document outlines the Annual Development Plan for North Delhi Constituency FY 2026-27. Total budget ₹75 crores allocated across infrastructure (₹45cr), healthcare (₹18cr), and public amenities (₹12cr). Key target: raise Ayushman Bharat coverage from 74% to 89%.",
            "key_points": [
                "Total budget: ₹75 crores for FY 2026-27",
                "Road infrastructure upgrade across 8 wards — tender deadline April 15, 2026",
                "Ayushman Bharat coverage target raised from 74% to 89% by December 2026",
                "Emergency drainage repair for Ward 5 & 6 — priority action",
                "3 new health sub-centres operational by July 2026",
                "Monthly grievance camps mandatory in all 10 wards from April 2026"
            ],
            "action_items": [
                "Issue tender notice for road repair — deadline April 15, 2026",
                "Schedule Ayushman Bharat camp for Ward 6 — coordinate with DSHM",
                "Review drainage contractor report for Wards 5 & 6 — urgent",
                "Approve health sub-centre locations before March 31, 2026"
            ]
        })
    if "brief" in p or "event" in p:
        return "• Review agenda and confirm all attendees\n• Prepare key data points and talking notes\n• Identify 2-3 priority decisions needed\n• Follow up on action items from last meeting"
    if "speech" in p or "draft" in p or "letter" in p or "press" in p:
        return """Respected guests and dear citizens of North Delhi,

Namaste!

Today marks a momentous occasion for our constituency. Through collective effort and dedicated governance, we have achieved another significant milestone in our development journey.

When I took the oath of office, I committed to every resident — quality infrastructure, accessible healthcare, and dignified living conditions. Today, we honour that commitment.

The road ahead is filled with opportunity. With your continued trust and support, we will build a stronger, more prosperous North Delhi.

Jai Hind. Jai Bharat."""
    if "ward" in p or "complaint" in p or "coverage" in p or "constituency" in p:
        return json.dumps({
            "answer": "Ward 6 (Azadpur) has the most open complaints at 31, mainly roads and waterlogging. Ward 8 (Shakti Nagar) follows with 27. Both have scheme coverage below 50% and need priority attention this month.",
            "chart_type": "bar"
        })
    if "ayushman" in p or "scheme" in p or "yojana" in p:
        return "Ayushman Bharat (PM-JAY) provides free health coverage up to ₹5 lakh per family per year at all empanelled hospitals. In your constituency, current coverage is 74% (82,000 beneficiaries). Target: 89% by December 2026. Wards 5, 6 & 8 have the lowest enrollment and need urgent camp drives."
    if "prioriti" in p or "week" in p or "focus" in p:
        return "🔴 Urgent: Review Ward 6 drainage — 31 complaints, monsoon approaching.\n🟡 High: Schedule Ayushman camps for Wards 5, 6, 8 — lowest coverage.\n🟢 Normal: Review Annual Dev Plan — tender deadline April 15.\n💡 Tip: Press conference on road completion would build positive momentum."
    return "I am your GovCoPilot AI assistant. Add your GEMINI_API_KEY in the backend/.env file for full AI responses. Currently running in demo mode with pre-built responses."


async def summarize_document(text: str, language: str = "english", length: str = "medium", focus: str = None) -> dict:
    length_map = {"short": "3-4 sentences", "medium": "150-200 words", "detailed": "400-500 words"}
    prompt = f"""Summarize this government document in {length_map.get(length, '150-200 words')}.
{'Respond in Hindi.' if language == 'hindi' else 'Respond in English.'}
{f'Focus on: {focus}' if focus else ''}

Return ONLY valid JSON with keys: "summary" (string), "key_points" (array of 5-6 strings), "action_items" (array of strings).

DOCUMENT:
{text[:12000]}"""
    raw = await call_llm(prompt, "You are an AI for senior Indian government officials. Be precise.", 2000)
    clean = raw.strip().replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"summary": raw[:500], "key_points": [], "action_items": []}


async def generate_draft(doc_type: str, topic: str, context: str = "", tone: str = "formal",
                         language: str = "english", length: str = "medium", recipient: str = "") -> str:
    length_map = {"short": "250-350 words", "medium": "500-700 words", "long": "900-1200 words"}
    prompt = f"""Write a {doc_type} on: {topic}
{f'Recipient: {recipient}' if recipient else ''}
{f'Context/Details: {context}' if context else ''}
Tone: {tone} | Length: {length_map.get(length, '500-700 words')}
{'Write in Hindi (Devanagari script).' if language == 'hindi' else 'Write in English.'}
Write the complete {doc_type} now, ready to use:"""
    return await call_llm(prompt, "You are an expert document drafter for senior Indian government leaders.", 2000)


async def chat_response(message: str, history: list, doc_context: str = "", language: str = "english") -> str:
    lang = "Respond in Hindi." if language == "hindi" else "Respond in English."
    system = f"You are GovCoPilot, an AI assistant for Indian public leaders. Help with policy, documents, constituency data, and official communications. Be concise and practical. {lang}"
    if doc_context:
        system += f"\n\nDocument context available:\n{doc_context[:3000]}"
    hist = ""
    for m in history[-6:]:
        role = "Official" if m["role"] == "user" else "GovCoPilot"
        hist += f"{role}: {m['content']}\n"
    prompt = f"{hist}Official: {message}\nGovCoPilot:"
    return await call_llm(prompt, system, 800)


async def summarize_transcript(transcript: str) -> dict:
    prompt = f"""Analyze this meeting transcript. Return ONLY valid JSON:
{{"summary": "2-3 sentence overview", "action_items": ["task — owner — deadline", ...]}}

TRANSCRIPT: {transcript[:8000]}"""
    raw = await call_llm(prompt, "Expert at summarizing Indian government meetings.", 1000)
    clean = raw.strip().replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"summary": raw[:300], "action_items": []}


async def answer_constituency_query(question: str, data: dict) -> dict:
    prompt = f"""Answer this question about the constituency: {question}
Data: {json.dumps(data)[:4000]}
Return ONLY JSON: {{"answer": "concise answer with ward names", "chart_type": "bar or pie or table"}}"""
    raw = await call_llm(prompt, "You are a data analyst for an Indian constituency.", 400)
    clean = raw.strip().replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"answer": raw, "chart_type": "table"}


async def generate_event_brief(title: str, description: str = "") -> str:
    prompt = f"""Generate a pre-meeting brief (3-4 bullet points, under 80 words) for a government official.
Event: {title}
Description: {description or 'N/A'}"""
    try:
        return await call_llm(prompt, "", 200)
    except Exception:
        return f"• Review agenda for '{title}'\n• Confirm attendees\n• Prepare key talking points\n• Identify priority decisions needed"


async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    prompt = f"Translate the following text from {source_lang} to {target_lang}. Return ONLY the translated text.\n\nTEXT:\n{text[:8000]}"
    return await call_llm(prompt, "You are an expert translator.", 2000)

