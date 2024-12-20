import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ReportCardProps {
  title: string;
  children: React.ReactNode;
}

export function ReportCard({ title, children }: ReportCardProps) {
  return (
    <Card className="border-teal-100">
      <CardHeader>
        <CardTitle className="text-xl text-teal-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{children}</p>
      </CardContent>
    </Card>
  );
}