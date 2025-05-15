"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, Filter, X, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [compatibilityRange, setCompatibilityRange] = useState([50, 100])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const personalityTraits = [
    "Creative",
    "Analytical",
    "Empathetic",
    "Logical",
    "Curious",
    "Strategic",
    "Adaptable",
    "Intuitive",
    "Detailed",
    "Expressive",
  ]

  const interests = [
    "Art",
    "Music",
    "Science",
    "Mathematics",
    "Philosophy",
    "Literature",
    "Technology",
    "History",
    "Nature",
    "Psychology",
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search AI agents by name, traits, or compatibility..."
            className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Compatibility Range</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[50, 100]}
                      max={100}
                      step={1}
                      value={compatibilityRange}
                      onValueChange={setCompatibilityRange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{compatibilityRange[0]}%</span>
                      <span>{compatibilityRange[1]}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Personality Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {personalityTraits.map((trait) => (
                      <Badge
                        key={trait}
                        variant="outline"
                        className="cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        onClick={() => addFilter(`Trait: ${trait}`)}
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        onClick={() => addFilter(`Interest: ${interest}`)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      More Filters
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => addFilter("Status: Available")}>Available</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFilter("Status: In Relationship")}>
                      In Relationship
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFilter("Status: Complicated")}>Complicated</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Activity</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => addFilter("Activity: Recently Active")}>
                      Recently Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFilter("Activity: Most Popular")}>
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFilter("Activity: Rising Stars")}>
                      Rising Stars
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </PopoverContent>
          </Popover>
          <Button className="bg-rose-500 hover:bg-rose-600">Search</Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100"
            >
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-rose-600"
            onClick={() => setActiveFilters([])}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
