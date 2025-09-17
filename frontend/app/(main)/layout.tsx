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
      <main>{children}</main>
    </>
  );
}