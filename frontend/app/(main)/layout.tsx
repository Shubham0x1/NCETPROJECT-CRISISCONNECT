// frontend/app/layout.tsx

import { Header } from "@/components/header";
import 'leaflet/dist/leaflet.css'; 

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        {/* --- 2. WRAP THE CHILDREN --- */}
          {children}
      </main>
    </>
  );
}