import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export function UserReview() {
  return (
    <Card>
      <CardContent>
        <CardDescription className="py-4">
          “Dany has been a super guest , seamless communication, responsiveness
          and respect for the premises. I would recommend it to any host”
        </CardDescription>
        <CardFooter className="flex items-center justify-start space-x-2 p-0">
          {/*<Avatar />*/}
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Safia</span>
            <span className="font-light text-body">January 2025</span>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
