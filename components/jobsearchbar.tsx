"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
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
import { koreanJobSuggestions } from "@/lib/job-keywords";
const formSchema = z.object({
    keyword: z.string().min(0, {
      message: "Keyword must be at least 2 characters.",
    }),
  })
const JobsearchBar = ({countrykey, category, query}:{countrykey:string, category:string, query:string}) => {
    const searchParams = useSearchParams();
    const search = category as string;
    const countrykeyword = countrykey as string;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          keyword: query,
        },
      })
    const router = useRouter();

    function onSubmit(values: z.infer<typeof formSchema>) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("country", countrykeyword);
        params.set("q", values.keyword);
        if (search && search !== "none") params.set("category", search);
        router.push(`?${params}`)
    }
    

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-2 flex shrink-1 ">
                <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input list="korean-job-suggestions" placeholder="직종 검색: 바리스타, 주방 보조, warehouse…" {...field} className="md:w-[400px] w-[300px] border-zinc-400 border-2" />
                    </FormControl>
                    </FormItem>
                )}
                />
                <datalist id="korean-job-suggestions">
                  {koreanJobSuggestions.map((job) => <option key={job} value={job} />)}
                </datalist>
                <Button type="submit" variant="default" className="bg-black">Search</Button>
        </form>
    </Form>
    )
}
export default JobsearchBar;
