import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WelcomeCard } from "@/components/WelcomeCard";
import { ReportCard } from "@/components/ReportCard";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <WelcomeCard />
            
            <div className="grid md:grid-cols-2 gap-6">
              <ReportCard title="Previous Reports">
                Your analysis reports will show here
              </ReportCard>
              
              <ReportCard title="Loan Reports">
                Your Loan reports will show here
              </ReportCard>
            </div>

            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/52b53987-9c46-46e8-a7a6-21f829190e36.png"
                alt="Illustration"
                className="max-w-md w-full"
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;