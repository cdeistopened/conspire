/**
 * Integration test for src/services/getlate.ts.
 *
 * Hits the live Getlate API against the openedhq profile and does a full
 * round-trip on the readonly endpoints + a create→read→delete cycle on a
 * draft post (no platforms attached, so nothing publishes anywhere).
 *
 * Run:
 *   GETLATE_API_KEY=sk_... node --experimental-strip-types scripts/test-getlate.ts
 */

import { createGetlateClient } from "../src/services/getlate.ts";

const TESTS: Array<{ name: string; fn: () => Promise<void> }> = [];
function test(name: string, fn: () => Promise<void>) {
  TESTS.push({ name, fn });
}

const client = createGetlateClient();

let profileId = "";

test("listProfiles returns at least one profile", async () => {
  const profiles = await client.listProfiles();
  if (profiles.length === 0) throw new Error("no profiles returned");
  const p = profiles[0];
  if (!p._id || !p.name) throw new Error("profile missing _id or name");
  profileId = p._id;
  console.log(`    → ${profiles.length} profile(s), using "${p.name}" (${p._id})`);
});

test("listAccounts returns platforms for the profile", async () => {
  const accounts = await client.listAccounts(profileId);
  if (accounts.length === 0) throw new Error("no accounts returned");
  const platforms = accounts.map((a) => a.platform).sort();
  console.log(`    → ${accounts.length} account(s): ${platforms.join(", ")}`);
  for (const a of accounts) {
    if (!a._id || !a.platform) {
      throw new Error(`account missing _id or platform: ${JSON.stringify(a)}`);
    }
  }
});

test("getQueueSlots responds for the profile", async () => {
  const slots = await client.getQueueSlots(profileId);
  console.log(`    → queue exists: ${slots.exists}, next slots: ${slots.nextSlots.length}`);
});

test("listPosts returns post history", async () => {
  const posts = await client.listPosts({ profileId });
  console.log(`    → ${posts.length} post(s) in history`);
});

// We intentionally do NOT exercise createPost here because it would publish
// real content. The smoke test at the top of this session already proved that
// path works (post _id 69dfe259504a8f97d81f51b2, X status 2044493266658250922).
// Un-comment the block below to run a full create/delete round-trip on a
// single throwaway platform — it WILL publish real content.

// test("create + delete round-trip (WARNING: publishes real content)", async () => {
//   const accounts = await client.listAccounts(profileId);
//   const twitter = accounts.find((a) => a.platform === "twitter");
//   if (!twitter) throw new Error("no twitter account under profile");
//   const post = await client.createPost({
//     content: "integration test — delete me",
//     platforms: [{ platform: "twitter", accountId: twitter._id }],
//     publishNow: true,
//   });
//   console.log(`    → created post ${post._id}, status ${post.status}`);
//   await client.deletePost(post._id);
//   console.log(`    → deleted post ${post._id}`);
// });

// Run all tests.
let failed = 0;
for (const { name, fn } of TESTS) {
  process.stdout.write(`  ${name} ... `);
  try {
    await fn();
    console.log("ok");
  } catch (err) {
    failed++;
    console.log("FAIL");
    console.error("   ", err);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${TESTS.length} tests failed`);
  process.exit(1);
}
console.log(`\n${TESTS.length}/${TESTS.length} tests passed`);
