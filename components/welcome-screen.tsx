
import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bug } from "lucide-react";

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center gap-4 p-8">
          <Avatar className="size-16 bg-accent mb-2">
            <AvatarFallback className="bg-accent text-accent-foreground">
              <Bug className="size-8" stroke="red" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome!</h1>
          <p className="text-base text-white text-center mb-1">
            Track cockroach numbers for a safer, cleaner environment.
          </p>
          <p className="text-base font-semibold text-primary text-center mb-4">
            Join the movement!
          </p>
          <Button onClick={onStart} className="px-8 py-3 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-md mt-2">
            Start Tracking
          </Button>
        </div>
      </Card>
    </div>
  );
}
