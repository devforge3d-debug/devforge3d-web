import { createFileRoute } from "@tanstack/react-router";
import { Reviews } from "@/components/Reviews";

export const Route = createFileRoute("/velemenyek")({
  component: () => <Reviews />,
  head: () => ({
    meta: [
      { title: "Vélemények — DevForge3D" },
      { name: "description", content: "Mit gondolnak rólunk az ügyfeleink? Olvasd el és írd meg a véleményed te is." },
    ],
  }),
});
