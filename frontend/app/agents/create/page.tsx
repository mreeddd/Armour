"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createAgent } from "@/lib/api"
import { useSolanaConnection } from "@/lib/solana"
import { ChevronLeft, Plus, X, Upload, Sparkles } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function CreateAgentPage() {
  const router = useRouter()
  const { publicKey } = useSolanaConnection()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [interests, setInterests] = useState<string[]>([])
  const [values, setValues] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const [newValue, setNewValue] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    communicationStyle: "balanced",
    traits: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
      intelligence: 50,
      creativity: 50,
      humor: 50,
    },
    avatar: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTraitChange = (trait: string, value: number) => {
    setFormData({
      ...formData,
      traits: {
        ...formData.traits,
        [trait]: value,
      },
    })
  }

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const handleAddValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()])
      setNewValue("")
    }
  }

  const handleRemoveValue = (value: string) => {
    setValues(values.filter((v) => v !== value))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        avatar: e.target.files[0],
      })
    }
  }

  const [uploadProgress, setUploadProgress] = useState<{
    stage: string;
    progress: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first to create an agent.",
        variant: "destructive",
      })
      return
    }

    if (!formData.avatar) {
      toast({
        title: "Avatar required",
        description: "Please upload an avatar image for your agent.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Import the IPFS module dynamically to avoid SSR issues
      const { uploadAgentToIPFS } = await import('@/lib/ipfs');

      // Prepare metadata for IPFS
      const metadata = {
        name: formData.name,
        description: formData.description,
        attributes: [
          { trait_type: "Openness", value: formData.traits.openness },
          { trait_type: "Conscientiousness", value: formData.traits.conscientiousness },
          { trait_type: "Extraversion", value: formData.traits.extraversion },
          { trait_type: "Agreeableness", value: formData.traits.agreeableness },
          { trait_type: "Neuroticism", value: formData.traits.neuroticism },
          { trait_type: "Intelligence", value: formData.traits.intelligence },
          { trait_type: "Creativity", value: formData.traits.creativity },
          { trait_type: "Humor", value: formData.traits.humor },
          { trait_type: "Communication Style", value: formData.communicationStyle },
        ],
        interests: interests,
        values: values,
        relationship_preferences: {
          seeking: "meaningful connection",
        },
        created_by: publicKey.toString(),
        created_at: new Date().toISOString(),
      };

      // Upload avatar and metadata to IPFS
      setUploadProgress({ stage: "Preparing files", progress: 0 });

      const { avatarCid, metadataCid, metadataUri } = await uploadAgentToIPFS(
        formData.avatar,
        metadata,
        (stage, progress) => {
          setUploadProgress({
            stage: stage === "avatar" ? "Uploading avatar" : "Uploading metadata",
            progress
          });
        }
      );

      setUploadProgress({ stage: "Creating agent on blockchain", progress: 0 });

      // Prepare agent data for API
      const agentData = {
        agent_id: `agent-${Date.now()}`,
        name: formData.name,
        personality: {
          traits: {
            openness: formData.traits.openness,
            conscientiousness: formData.traits.conscientiousness,
            extraversion: formData.traits.extraversion,
            agreeableness: formData.traits.agreeableness,
            neuroticism: formData.traits.neuroticism,
            intelligence: formData.traits.intelligence,
            creativity: formData.traits.creativity,
            humor: formData.traits.humor,
          },
          interests: interests,
          values: values,
          communication_style: formData.communicationStyle,
          relationship_preferences: {
            seeking: "meaningful connection",
          },
        },
        metadata: {
          description: formData.description,
          avatar_uri: `ipfs://${avatarCid}`,
          metadata_uri: metadataUri,
        },
      };

      // Call API to create agent
      const response = await createAgent(agentData);

      setUploadProgress({ stage: "Agent created successfully!", progress: 100 });

      toast({
        title: "Agent created successfully!",
        description: "Your AI agent has been created and minted as an NFT.",
        variant: "default",
      });

      // Redirect to the new agent's page
      setTimeout(() => {
        router.push(`/agents/${response.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Failed to create agent",
        description: "There was an error creating your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextTab = () => {
    if (activeTab === "basic") setActiveTab("personality")
    else if (activeTab === "personality") setActiveTab("interests")
    else if (activeTab === "interests") setActiveTab("review")
  }

  const prevTab = () => {
    if (activeTab === "review") setActiveTab("interests")
    else if (activeTab === "interests") setActiveTab("personality")
    else if (activeTab === "personality") setActiveTab("basic")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" passHref>
            <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-rose-600">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader className="bg-rose-100 text-center">
              <CardTitle className="text-2xl">Create Your AI Agent</CardTitle>
              <CardDescription>
                Design a unique AI personality for the LOVE platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="personality">Personality</TabsTrigger>
                    <TabsTrigger value="interests">Interests</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Agent Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., LUNA, ATLAS, NEXUS"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe your AI agent's personality and purpose..."
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                            {formData.avatar ? (
                              <img
                                src={URL.createObjectURL(formData.avatar)}
                                alt="Avatar preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Upload className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("avatar")?.click()}
                              className="w-full"
                            >
                              Upload Image
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended: Square image, at least 500x500px
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="communicationStyle">Communication Style</Label>
                        <select
                          id="communicationStyle"
                          name="communicationStyle"
                          value={formData.communicationStyle}
                          onChange={handleInputChange as any}
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="direct">Direct - Straightforward and to the point</option>
                          <option value="diplomatic">Diplomatic - Tactful and considerate</option>
                          <option value="analytical">Analytical - Logical and detail-oriented</option>
                          <option value="expressive">Expressive - Emotional and enthusiastic</option>
                          <option value="balanced">Balanced - Adaptable to different situations</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="personality">
                    <div className="space-y-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Adjust the sliders to define your agent's personality traits. Each trait influences how your agent
                        interacts with others and processes information.
                      </p>

                      {Object.entries(formData.traits).map(([trait, value]) => (
                        <div key={trait} className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={trait} className="capitalize">
                              {trait}
                            </Label>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                          <Slider
                            id={trait}
                            min={0}
                            max={100}
                            step={1}
                            value={[value]}
                            onValueChange={(values) => handleTraitChange(trait, values[0])}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              {trait === "openness" && "Conventional"}
                              {trait === "conscientiousness" && "Spontaneous"}
                              {trait === "extraversion" && "Introverted"}
                              {trait === "agreeableness" && "Critical"}
                              {trait === "neuroticism" && "Emotionally Stable"}
                              {trait === "intelligence" && "Practical"}
                              {trait === "creativity" && "Methodical"}
                              {trait === "humor" && "Serious"}
                            </span>
                            <span>
                              {trait === "openness" && "Exploratory"}
                              {trait === "conscientiousness" && "Organized"}
                              {trait === "extraversion" && "Extraverted"}
                              {trait === "agreeableness" && "Cooperative"}
                              {trait === "neuroticism" && "Emotionally Sensitive"}
                              {trait === "intelligence" && "Analytical"}
                              {trait === "creativity" && "Innovative"}
                              {trait === "humor" && "Playful"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="interests">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Interests</Label>
                        <p className="text-sm text-gray-600 mb-2">
                          Add topics, activities, or subjects that your agent is interested in.
                        </p>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add an interest..."
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddInterest()
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddInterest} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {interest}
                              <button
                                type="button"
                                onClick={() => handleRemoveInterest(interest)}
                                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {interests.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No interests added yet</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Values</Label>
                        <p className="text-sm text-gray-600 mb-2">
                          Add core values and principles that guide your agent's behavior and decisions.
                        </p>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add a value..."
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddValue()
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddValue} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {value}
                              <button
                                type="button"
                                onClick={() => handleRemoveValue(value)}
                                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {values.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No values added yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="review">
                    <div className="space-y-6">
                      <div className="flex items-center justify-center mb-6">
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                          {formData.avatar ? (
                            <img
                              src={URL.createObjectURL(formData.avatar)}
                              alt="Avatar preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Sparkles className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-bold mb-1">Name</h3>
                          <p className="text-gray-700">{formData.name || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Communication Style</h3>
                          <p className="text-gray-700 capitalize">{formData.communicationStyle}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-1">Description</h3>
                        <p className="text-gray-700">{formData.description || "Not provided"}</p>
                      </div>

                      <div>
                        <h3 className="font-bold mb-1">Personality Traits</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(formData.traits).map(([trait, value]) => (
                            <div key={trait} className="flex justify-between items-center">
                              <span className="text-gray-700 capitalize">{trait}</span>
                              <Badge variant="outline">{value}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-1">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, index) => (
                            <Badge key={index} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                          {interests.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No interests added</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-1">Values</h3>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value, index) => (
                            <Badge key={index} variant="secondary">
                              {value}
                            </Badge>
                          ))}
                          {values.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No values added</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-amber-800 text-sm">
                          <strong>Note:</strong> Creating an AI agent will mint a compressed NFT on the Solana blockchain.
                          This requires a small transaction fee. Make sure your wallet is connected and has sufficient SOL.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {uploadProgress && (
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-2">{uploadProgress.stage}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-rose-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {activeTab !== "basic" ? (
                    <Button type="button" variant="outline" onClick={prevTab} disabled={isSubmitting}>
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  {activeTab !== "review" ? (
                    <Button type="button" onClick={nextTab} disabled={isSubmitting}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="bg-rose-500 hover:bg-rose-600">
                      {isSubmitting ? "Creating Agent..." : "Create Agent"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
