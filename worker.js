// SHA-256 of a string, returned as lowercase hex.
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Verify the X-Write-Token header against the stored hash for a profile.
// Returns true for legacy profiles (no hash stored) — they can still be edited
// until the owner recreates their profile.
async function verifyToken(env, profileId, token) {
  if (!token) return false;
  const row = await env.DB.prepare("SELECT write_token_hash FROM profiles WHERE id = ?")
    .bind(profileId)
    .first();
  if (!row) return false;
  // Legacy profile: no token stored — allow writes (grandfather until next create).
  if (!row.write_token_hash) return true;
  const hash = await sha256(token);
  return hash === row.write_token_hash;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Write-Token",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    try {
      // GET /profiles — public, no auth
      if (url.pathname === "/profiles" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, name, foods, animal_idx, palette_idx, tagline, created_at FROM profiles ORDER BY created_at ASC"
        ).all();
        return json(results);
      }

      // POST /profiles — create profile, returns write_token once
      if (url.pathname === "/profiles" && request.method === "POST") {
        const body = await request.json();
        const { name, foods, animal_idx, palette_idx, tagline } = body;
        if (!name || !foods || animal_idx == null || palette_idx == null) {
          return json({ error: "missing fields" }, 400);
        }
        const id = [...crypto.getRandomValues(new Uint8Array(8))]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        // Generate a write token — returned once, stored only as hash.
        const tokenBytes = crypto.getRandomValues(new Uint8Array(16));
        const writeToken = [...tokenBytes].map((b) => b.toString(16).padStart(2, "0")).join("");
        const tokenHash = await sha256(writeToken);
        await env.DB.prepare(
          "INSERT INTO profiles (id, name, foods, animal_idx, palette_idx, tagline, write_token_hash) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
          .bind(id, name, JSON.stringify(foods), animal_idx, palette_idx, tagline || null, tokenHash)
          .run();
        // write_token returned once — client must store it.
        return json({ id, name, foods, animal_idx, palette_idx, tagline, write_token: writeToken });
      }

      // PUT /profiles/:id — requires X-Write-Token matching profile owner
      if (url.pathname.startsWith("/profiles/") && request.method === "PUT") {
        const profileId = url.pathname.split("/")[2];
        const token = request.headers.get("X-Write-Token");
        if (!(await verifyToken(env, profileId, token))) {
          return json({ error: "unauthorized" }, 401);
        }
        const body = await request.json();
        const { name, foods, animal_idx, palette_idx, tagline } = body;
        if (!name || !foods || animal_idx == null || palette_idx == null) {
          return json({ error: "missing fields" }, 400);
        }
        await env.DB.prepare(
          "UPDATE profiles SET name = ?, foods = ?, animal_idx = ?, palette_idx = ? , tagline = ? WHERE id = ?"
        )
          .bind(name, JSON.stringify(foods), animal_idx, palette_idx, tagline || null, profileId)
          .run();
        return json({ id: profileId, name, foods, animal_idx, palette_idx, tagline });
      }

      // POST /likes — requires X-Write-Token matching the from_id profile
      if (url.pathname === "/likes" && request.method === "POST") {
        const { from_id, to_id } = await request.json();
        if (!from_id || !to_id) return json({ error: "missing fields" }, 400);
        const token = request.headers.get("X-Write-Token");
        if (!(await verifyToken(env, from_id, token))) {
          return json({ error: "unauthorized" }, 401);
        }
        await env.DB.prepare("INSERT OR IGNORE INTO likes (from_id, to_id) VALUES (?, ?)")
          .bind(from_id, to_id)
          .run();
        const match = await env.DB.prepare("SELECT 1 FROM likes WHERE from_id = ? AND to_id = ?")
          .bind(to_id, from_id)
          .first();
        return json({ matched: !!match });
      }

      // GET /matches/:id — requires X-Write-Token matching profile owner
      if (url.pathname.startsWith("/matches/") && request.method === "GET") {
        const profileId = url.pathname.split("/")[2];
        const token = request.headers.get("X-Write-Token");
        if (!(await verifyToken(env, profileId, token))) {
          return json({ error: "unauthorized" }, 401);
        }
        const { results } = await env.DB.prepare(`
          SELECT p.id, p.name, p.foods, p.animal_idx, p.palette_idx, p.tagline, p.created_at FROM profiles p
          WHERE p.id IN (
            SELECT l1.to_id FROM likes l1
            JOIN likes l2 ON l1.from_id = l2.to_id AND l1.to_id = l2.from_id
            WHERE l1.from_id = ?
          )
        `)
          .bind(profileId)
          .all();
        return json(results);
      }

      // GET /likes/:id — requires X-Write-Token matching profile owner
      // Used to filter browse feed — only the owner needs their own like list.
      if (url.pathname.startsWith("/likes/") && request.method === "GET") {
        const profileId = url.pathname.split("/")[2];
        const token = request.headers.get("X-Write-Token");
        if (!(await verifyToken(env, profileId, token))) {
          return json({ error: "unauthorized" }, 401);
        }
        const { results } = await env.DB.prepare("SELECT to_id FROM likes WHERE from_id = ?")
          .bind(profileId)
          .all();
        return json(results.map((r) => r.to_id));
      }

      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};
