import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Hämta prenumeranter
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("subscription_data, user_id");

  if (!subs || subs.length === 0) return new Response("Inga prenumeranter");

  for (const sub of subs) {
    const { data: user } = await supabase
      .from("user_data")
      .select("*")
      .eq("id", sub.user_id)
      .single();

    if (!user) continue;

    const start = new Date(user.start_date).getTime();
    const diffDays = Math.max(
      0,
      Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24))
    );

    const savedMoney = diffDays * user.cost_per_drink;

    const topic = `energyfree_user_${sub.user_id}`;

    try {
      await fetch(`https://ntfy.sh/${topic}`, {
        method: "POST",
        body: `Dag ${diffDays} – du har sparat ${savedMoney} kr`,
        headers: { "Title": "Morgonnotis ✨" }
      });
    } catch (err) {
      console.error("Push-fel:", err);
    }
  }

  return new Response("Push skickade via ntfy.sh");
});
