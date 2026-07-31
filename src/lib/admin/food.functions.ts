import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./session";
import { getStore, saveFood, type FoodRecord } from "./store.server";

export const getFoodGrid = createServerFn({ method: "GET" })
  .inputValidator((d: { year: number }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const s = await getStore();
    const defaultRequired = Number(s.settings.get("monthly_food_contribution") ?? 20000);
    const students = Array.from(s.students.values());
    return students.map((st) => {
      const months = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        const rec = s.food.get(`${st.id}|${data.year}|${m}`);
        return {
          month: m,
          required_amount: rec?.required_amount ?? defaultRequired,
          paid_amount: rec?.paid_amount ?? 0,
          fund_type: rec?.fund_type ?? ("Parent Contribution" as const),
        };
      });
      return {
        student_id: st.id,
        full_name: st.full_name,
        class: st.class,
        months,
      };
    });
  });

export const setFoodRecord = createServerFn({ method: "POST" })
  .inputValidator((d: FoodRecord) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    await saveFood(data);
    return { ok: true };
  });
