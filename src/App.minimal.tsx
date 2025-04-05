/**
 * App.minimal.tsx
 * A completely stripped-down version of the App component
 */
import { Toaster } from "sonner";
import { DataTableWithProfiles } from "@/components/DataTable/data-table.minimal";
import { columns } from "@/components/DataTable/columns";
import { data } from "@/data/data";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">AG-Grid Demo</h1>
        <DataTableWithProfiles columns={columns} data={data} />
      </main>
    </div>
  );
}
