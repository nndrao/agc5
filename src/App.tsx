import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DataTableWithProfiles } from "@/components/DataTable/data-table";
import { ProfileNotificationsProvider } from "@/components/DataTable/ProfileManager/ProfileNotificationsProvider.ultra";
import { columns } from "@/components/DataTable/columns";

// Example data
const data = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@email.com",
  },
  {
    id: "573e1d42",
    amount: 150,
    status: "success",
    email: "test@email.com",
  },
];

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <div className="flex h-screen flex-col overflow-hidden">
          <Header />
          <main className="flex-1 container mx-auto p-5">
            <ProfileNotificationsProvider>
              <DataTableWithProfiles columns={columns} data={data} />
            </ProfileNotificationsProvider>
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;