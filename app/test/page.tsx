import { supabase } from "@/lib/supabase/client";

export default async function TestPage() {

  const { data, error } = await supabase
    .from("flights")
    .select("*");

  console.log(data);

  return (
    <div>
      Test Page
    </div>
  );
}