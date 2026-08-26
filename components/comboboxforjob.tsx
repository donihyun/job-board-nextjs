"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  FormField,
  FormItem,
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

interface ComboboxFormProps {
  defaultValue: string;
  onChange?: (value: string) => void;
}

export default function ComboboxForm({ defaultValue, onChange }: ComboboxFormProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      language: defaultValue
    }
  });

  useEffect(() => {
    setSelectedCountry(defaultValue);
    form.setValue("language", defaultValue);
  }, [defaultValue, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const url = `/jobs?${new URLSearchParams({ country: data.language })}`;
    router.push(url);
  }

  const handleSelect = (value: string) => {
    setSelectedCountry(value);
    setOpen(false);
    form.setValue("language", value);
    form.trigger("language").then((isValid) => {
      if (isValid) {
        if (onChange) {
          onChange(value);
        }
        onSubmit({ "language": value });
      }
    });
  };

  const currentCountry = countries.find(
    (country) => country.value === selectedCountry
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full min-h-[80px] rounded-full h-max box-border transition duration-75",
                        !selectedCountry && "text-muted-foreground"
                      )}
                    >
                      {currentCountry ? (
                        <div className="flex w-full justify-between items-center">
                          <div className="w-[70px] h-[70px] relative overflow-hidden shrink-0 rounded-full">
                            <Image
                              src={currentCountry.flag}
                              fill={true}
                              objectFit="cover"
                              alt={`${currentCountry.label} flag`}
                              className="shrink-0"
                            />
                          </div>
                          <div className="text-md lg:text-xl shrink-1 hidden xl:block font-bold">
                            {currentCountry.label}
                          </div>
                          <ChevronsUpDown className="h-8 w-8 shrink-1 opacity-50" />
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div className="text-xl font-bold">Select Country</div>
                          <ChevronsUpDown className="ml-8 h-8 w-8 shrink-0 opacity-50" />
                        </div>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0">
                  <Command>
                    <CommandInput placeholder="Search Country..." />
                    <CommandEmpty>No Country found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {countries.map((country) => (
                          <CommandItem
                            value={country.label}
                            key={country.value}
                            onSelect={() => {
                              handleSelect(country.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                country.value === selectedCountry
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country.label}
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
      </form>
    </Form>
  );
}
