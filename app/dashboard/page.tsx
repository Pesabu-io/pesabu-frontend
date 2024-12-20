import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Index = () => {
  return (
    
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-teal-600 text-white p-8 rounded-lg mb-8">
                <h2 className="text-3xl font-bold mb-2">Hey, Mike</h2>
                <p>Welcome to Pesabu!</p>
              </div>

              <div className="flex justify-end mb-12">
                <img
                  src="/lovable-uploads/62091416-32c4-49fb-af5e-73c65d9efa05.png"
                  alt="Illustration"
                  className="w-64"
                />
              </div>

              <div className="space-y-6">
                <div className="border border-teal-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-teal-700 p-4 border-b border-teal-200">
                    Previous Reports
                  </h3>
                  <div className="p-4 text-gray-500">
                    Your analysis reports will show here
                  </div>
                </div>

                <div className="border border-teal-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-teal-700 p-4 border-b border-teal-200">
                    Loan Reports
                  </h3>
                  <div className="p-4 text-gray-500">
                    Your Loan reports will show here
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
   
  );
};

export default Index;