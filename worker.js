export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors } });

    try {
      // GET /profiles
      if (url.pathname === '/profiles' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM profiles ORDER BY created_at ASC').all();
        return json(results);
      }

      // POST /profiles
      if (url.pathname === '/profiles' && request.method === 'POST') {
        const body = await request.json();
        const { name, foods, animal_idx, palette_idx, tagline } = body;
        if (!name || !foods || animal_idx == null || palette_idx == null) {
          return json({ error: 'missing fields' }, 400);
        }
        const id = [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
        await env.DB.prepare(
          'INSERT INTO profiles (id, name, foods, animal_idx, palette_idx, tagline) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(id, name, JSON.stringify(foods), animal_idx, palette_idx, tagline || null).run();
        return json({ id, name, foods, animal_idx, palette_idx, tagline });
      }

      // POST /likes
      if (url.pathname === '/likes' && request.method === 'POST') {
        const { from_id, to_id } = await request.json();
        if (!from_id || !to_id) return json({ error: 'missing fields' }, 400);
        await env.DB.prepare(
          'INSERT OR IGNORE INTO likes (from_id, to_id) VALUES (?, ?)'
        ).bind(from_id, to_id).run();
        // Check for mutual match
        const match = await env.DB.prepare(
          'SELECT 1 FROM likes WHERE from_id = ? AND to_id = ?'
        ).bind(to_id, from_id).first();
        return json({ matched: !!match });
      }

      // GET /matches/:id
      if (url.pathname.startsWith('/matches/') && request.method === 'GET') {
        const profileId = url.pathname.split('/')[2];
        const { results } = await env.DB.prepare(`
          SELECT p.* FROM profiles p
          WHERE p.id IN (
            SELECT l1.to_id FROM likes l1
            JOIN likes l2 ON l1.from_id = l2.to_id AND l1.to_id = l2.from_id
            WHERE l1.from_id = ?
          )
        `).bind(profileId).all();
        return json(results);
      }

      // GET /likes/:id (who I've liked)
      if (url.pathname.startsWith('/likes/') && request.method === 'GET') {
        const profileId = url.pathname.split('/')[2];
        const { results } = await env.DB.prepare(
          'SELECT to_id FROM likes WHERE from_id = ?'
        ).bind(profileId).all();
        return json(results.map(r => r.to_id));
      }

      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }
};
