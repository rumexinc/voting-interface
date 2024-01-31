'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {CalendarIcon} from "@radix-ui/react-icons"
import {format} from "date-fns"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card"
import {useEffect, useState} from "react";


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useRouter} from "next/navigation";


export default function Home() {
    const router = useRouter();


    const all_ports = [2022, 5660, 5680, 6633, 94742323230, 94767001001, 7788, 9900]

    useEffect(() => {
        let jwtToken = sessionStorage.getItem("jwt");

        if (!jwtToken) {
            router.push('/login');
        }
    }, []);


    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [port, setPort] = useState<any>()
    const [result, setResult] = useState<any>([])
    const [totalVoteCount, setTotalVoteCount] = useState<number>(0)
    const [disabled, setDisabled] = useState(false)

    const refractorDate = (date: any) => {

// Create a new Date object from the input string
        var dateObject = new Date(date);

// Get year, month, and day
        var year = dateObject.getFullYear();
        var month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
        var day = ('0' + dateObject.getDate()).slice(-2);

// Concatenate and format the date
        var formattedDate = year + '-' + month + '-' + day;

        console.log(formattedDate);
        return formattedDate;
    }

    const getVoteCount = () => {

        // @ts-ignore
        console.log(port, new Date(startDate).toLocaleDateString('en-GB'), new Date(endDate).toLocaleDateString('en-GB'))
        if (port && startDate && endDate) {
            setDisabled(true)
            setTotalVoteCount(0)
            setResult([])
            if (port === "ALL") {

                all_ports.forEach((prt) => {
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBZG1pbiIsImlhdCI6MTcwNjY3OTkxNywiZXhwIjoxNzA2NzY2MzE3fQ.S05zFzb42Gp8XUEyXC14HLiz_wllIEz7Ozf9aTM5z4E");
                    myHeaders.append("Cookie", "JSESSIONID=5A82E95DE3272E4D0A7D2AC870AA809C; JSESSIONID=A551B816E1D2EC4DF3EA1F790E5EAD9C");

                    var raw = JSON.stringify({
                        "startDate": refractorDate(startDate),
                        "endDate": refractorDate(endDate),
                        "port": prt
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    // @ts-ignore
                    fetch("http://202.124.190.118:6410/api/getVoteCount", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            console.log(result)
                            setTotalVoteCount(tvc => tvc + +result)
                            setResult((results: any) => [...results, {port: prt, result: result}])
                        })
                        .catch(error => console.log('error', error));
                })

            } else {

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBZG1pbiIsImlhdCI6MTcwNjY3OTkxNywiZXhwIjoxNzA2NzY2MzE3fQ.S05zFzb42Gp8XUEyXC14HLiz_wllIEz7Ozf9aTM5z4E");
                myHeaders.append("Cookie", "JSESSIONID=5A82E95DE3272E4D0A7D2AC870AA809C; JSESSIONID=A551B816E1D2EC4DF3EA1F790E5EAD9C");

                var raw = JSON.stringify({
                    "startDate": refractorDate(startDate),
                    "endDate": refractorDate(endDate),
                    "port": port
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                // @ts-ignore
                fetch("http://202.124.190.118:6410/api/getVoteCount", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log(result)
                        setResult((results: any) => [...results, {port: port, result: result}])
                    })
                    .catch(error => console.log('error', error));
            }


        }


    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-5 pt-10">


            <Card className="max-w-screen-sm w-full]">
                <CardHeader>

                </CardHeader>
                <CardContent>
                    <div>
                        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 mb-5">
                            Vote Count Interface
                        </h2>
                        <Select onValueChange={e => {
                            setDisabled(false)
                            setPort(e)
                        }
                        }>
                            <SelectTrigger className="w-full max-w-screen-md">
                                <SelectValue placeholder="Select a port"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ports</SelectLabel>
                                    <SelectItem value="ALL">All</SelectItem>
                                    {all_ports && all_ports.map(prt => <SelectItem key={prt}
                                                                                   value={prt + ""}>{prt}</SelectItem>)}

                                </SelectGroup>
                            </SelectContent>
                        </Select>


                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full mt-3 justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={date => {
                                        setStartDate(date)
                                        setDisabled(false)
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full mt-3 justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={date => {
                                        setEndDate(date)
                                        setDisabled(false)
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Button disabled={disabled} onClick={getVoteCount} className={"w-full mt-3"}>Search</Button>
                    </div>

                    {result.length > 0 && <Table className={"mt-5"}>
                        <TableCaption>A list of your port(s).</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Port</TableHead>
                                <TableHead>Vote Count</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.map((res: any) => (
                                <TableRow key={res.port}>
                                    <TableCell className="font-medium">{res.port}</TableCell>
                                    <TableCell className={"text-green-600"}>{res.result}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total Vote Count</TableCell>
                                <TableCell className="text-right">{totalVoteCount}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>}

                </CardContent>
                <CardFooter className="flex flex-col justify-between items-start">


                    <div>
                        {/*Vote Count: <span className={"text-green-600"}>{result}</span>*/}
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
}
