'use client'
import React, {useState} from 'react';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useRouter} from "next/navigation";
const Login = () => {

    const { toast } = useToast()

    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = ()=>{

        if(username.length>0 && password.length>0){

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "JSESSIONID=C2F8444755D41DB70F60BE4AF67EAADA");

            var raw = JSON.stringify({
                "username": username,
                "password": password
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            // @ts-ignore
            fetch("http://202.124.190.118:6410/api/login", requestOptions)
                .then(response => { return {
                    status: response.status,
                    body:  response.text()
                }
                })
                .then(result => {
                    console.log(result)
                    if(result.status === 200){
                        result.body.then(res=> sessionStorage.setItem("jwt",res ))

                        toast({
                            title: "Success!",
                            description: "Logged In Successfully.",
                        })

                        router.push('/')
                    }else{
                        toast({
                            title: "Error!",
                            description: "Invalid Username Or Password.",
                        })
                    }

                })
                .catch(error => {
                    console.log('error', error)

                });

        }
    }

    return (
        <div className={"flex justify-center mt-10 p-5"}>
            <Card className="max-w-screen-sm w-full">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter Credentials To Login.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input onChange={event =>
                                    setUsername(event.target.value)
                                } id="username" placeholder="John DOA"/>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type={'password'} onChange={event =>
                                    setPassword(event.target.value)
                                }
                                       id="password" placeholder="******"/>
                            </div>

                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleLogin}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
