import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function WelcomeCard() {
  return (
    <Card className="bg-teal-600 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hey, Mike</h1>
            <p className="text-teal-100">Welcome to Pesabu!</p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}