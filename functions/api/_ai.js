/* Generic OpenAI-compatible LLM client.
   Configure via wrangler vars / secrets:
     AI_BASE_URL  - e.g. https://api.openai.com/v1   (default)
     AI_API_KEY   - secret (required for AI features)
     AI_MODEL     - e.g. gpt-4o-mini                  (default)
   Any OpenAI-compatible endpoint works: OpenAI, DeepSeek, Moonshot,
   Together, local Ollama (/v1), Cloudflare AI Gateway, etc. */

var DEFAULT_BASE = 'https://api.openai.com/v1';
var DEFAULT_MODEL = 'gpt-4o-mini';

export function aiConfigured(env){
  return !!(env && env.AI_API_KEY);
}

/* aiChat(env, messages, opts) -> { text, usage } | { error } | null (if unconfigured) */
export async function aiChat(env, messages, opts){
  if(!aiConfigured(env)) return null;
  var base = (env.AI_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '');
  var model = env.AI_MODEL || DEFAULT_MODEL;
  var body = { model: model, messages: messages };
  if(opts){
    if(opts.temperature != null) body.temperature = opts.temperature;
    if(opts.max_tokens != null) body.max_tokens = opts.max_tokens;
  }
  var resp;
  try {
    resp = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.AI_API_KEY },
      body: JSON.stringify(body)
    });
  } catch(e){ return { error: 'network: ' + (e && e.message || e) }; }
  if(!resp.ok){
    var t = await resp.text().catch(function(){ return ''; });
    return { error: 'http ' + resp.status + ': ' + t.slice(0, 200) };
  }
  var data = await resp.json().catch(function(){ return {}; });
  var choice = data.choices && data.choices[0];
  if(!choice || !choice.message) return { error: 'no completion' };
  return { text: choice.message.content || '', usage: data.usage || null };
}
