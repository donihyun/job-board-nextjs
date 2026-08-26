"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { countries } from "@/constants/countries";

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a Country.",
  }),
});

export default function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const url = `/jobs?${new URLSearchParams({ country: data.language })}`;
    router.push(url);
  }

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex justify-center gap-x-3">
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem className="flex flex-col flex-1 max-w-[300px]">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between h-14 transition duration-75 hover:border-2 hover:border-primary",
                    !field.value && "text-muted-foreground"
                  )}
                >
                {field.value ? (
                <div className="flex gap-x-3 items-center">
                  <div>
                    {countries.find((country) => country.value === field.value)?.korean}
                  </div>
                  <Image
                    src={countries.find((country) => country.value === field.value)?.flag || "/australia.png"}
                    width={25}
                    height={15}
                    alt="flag"
                  />
                </div>
              ) : (
                "국가를 선택하세요"
              )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="나라 검색..." />
                <CommandEmpty>원하시는 나라가 없습니다.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {countries.map((country) => (
                      <CommandItem
                      value={country.label}
                      key={country.value}
                      onSelect={() => {
                        form.setValue("language", country.value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {country.korean}
                    </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" className="w-[100px] h-14">
      검색
    </Button>
  </form>
</Form>
  );
}
