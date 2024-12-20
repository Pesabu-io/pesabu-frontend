import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Insights = () => {
  const transactionData = [
    {
      name: "John Doe",
      number: "+2547xxxxx678",
      count: "100",
      highest: "10,000.00",
      total: "100,000.00",
    },
    {
      name: "James Juma",
      number: "+2547xxxxx678",
      count: "76",
      highest: "200.00",
      total: "14,400.00",
    },
    {
      name: "Jane Futurama",
      number: "+2547xxxxx678",
      count: "55",
      highest: "100.00",
      total: "5,500.00",
    },
    {
      name: "Advil Afuma",
      number: "+2547xxxxx678",
      count: "55",
      highest: "50.00",
      total: "5,500.00",
    },
  ];

  const TransactionTable = ({ title }: { title: string }) => (
    <div className="bg-teal-50/50 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-teal-800">{title}</h3>
        <span className="text-sm text-teal-600">1st Dec - 31st Dec</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Highest</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionData.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                  </Avatar>
                  {transaction.name}
                </div>
              </TableCell>
              <TableCell>{transaction.number}</TableCell>
              <TableCell>{transaction.count}</TableCell>
              <TableCell>{transaction.highest}</TableCell>
              <TableCell>{transaction.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (

      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-teal-700">Mike Ndegwa</h2>
                <p className="text-teal-600">072334678</p>
              </div>

              <TransactionTable title="Top Sent" />
              <TransactionTable title="Top Received" />
              <TransactionTable title="Top B2C Paybill" />
            </div>
          </main>
        </div>
      </div>
  
  );
};

export default Insights;