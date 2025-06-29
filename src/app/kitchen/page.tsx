import { KitchenDisplay } from "@/components/kitchen-display";
import { Suspense } from "react";

export default function KitchenPage() {
    return (
      <Suspense fallback={<div>Loading kitchen...</div>}>
        <KitchenDisplay />
      </Suspense>
    )
}
