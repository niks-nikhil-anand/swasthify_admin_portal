"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

interface ProfessionalSettingsProps {
    clinicImages: string[];
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    removeImage: (index: number) => Promise<void>;
    saving: boolean;
}

export function ProfessionalSettings({ clinicImages, handleImageUpload, removeImage, saving }: ProfessionalSettingsProps) {
    return (
        <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <Camera className="h-6 w-6 text-primary" />
                    Professional Practice Gallery
                </CardTitle>
                <CardDescription className="text-base mt-2 max-w-4xl">
                    Visual trust is essential in healthcare. Upload up to 5 high-quality images of your clinic, operation theater, or reception area to help patients feel comfortable and confident before their visit.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {clinicImages.length < 5 && (
                        <label className="aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 text-muted-foreground hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group scale-100 hover:scale-[1.03] active:scale-[0.98] shadow-xs">
                            <input type="file" className="hidden" onChange={handleImageUpload} disabled={saving} accept="image/*" />
                            <div className="p-5 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/10">
                                <ImagePlus className="h-10 w-10" />
                            </div>
                            <div className="text-center px-4">
                                <span className="text-sm font-bold block text-foreground">
                                    {saving ? "Uploading..." : "Add Clinic Photo"}
                                </span>
                                <span className="text-[10px] opacity-70 uppercase tracking-wider font-semibold">
                                    {clinicImages.length}/5 Slots Used
                                </span>
                            </div>
                        </label>
                    )}

                    {clinicImages.map((url, index) => (
                        <div key={index} className="aspect-square border rounded-3xl bg-muted/20 relative group overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl ring-1 ring-border/50">
                            <img src={url} alt={`Clinic ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                <div className="flex items-center justify-between gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest truncate flex-1 drop-shadow-md">Photo {index + 1}</span>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-9 w-9 rounded-2xl shrink-0 shadow-lg hover:scale-110 active:scale-95 transition-all"
                                        onClick={() => removeImage(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {clinicImages.length === 0 && !saving && (
                        <div className="aspect-square border-2 border-dashed rounded-3xl bg-muted/5 relative group overflow-hidden flex items-center justify-center col-span-full py-12">
                            <div className="flex flex-col items-center gap-4 text-muted-foreground/30 animate-pulse">
                                <Camera className="h-16 w-16" />
                                <div className="text-center">
                                    <span className="text-base font-bold text-muted-foreground/40 block">Your practice gallery is empty</span>
                                    <span className="text-xs">Upload up to 5 highlights of your clinic</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
