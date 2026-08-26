"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { setUserName } from "@/actions/user.actions"
import {useState} from "react";
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function ProfileForm({userId}:{userId:string}) {
    const [isLoading , setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        username: "",
    },
    })
    

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const respond = await setUserName(userId, values.username);
        if(respond.status!= 200){
            console.error("Error saving username");
        }
        else{
            router.replace("/");
        }
    }
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>
                    This is your public display name.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button disabled = {isLoading} type="submit">
                {isLoading ? <LoaderCircle className="animate-spin"/>: "Submit" }
            </Button>
        </form>
        </Form>
    )
    }
