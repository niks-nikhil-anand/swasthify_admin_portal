"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Camera, ImagePlus, Trash2, Eye } from "lucide-react";

interface ProfessionalSettingsProps {
    clinicImages: string[];
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    removeImage: (index: number) => Promise<void>;
    saving: boolean;
}

export function ProfessionalSettings({ clinicImages, handleImageUpload, removeImage, saving }: ProfessionalSettingsProps) {
    const [viewImage, setViewImage] = useState<string | null>(null);

    return (
        <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <Camera className="h-6 w-6 text-primary" />
                    Professional Practice Gallery
                </CardTitle>
                <CardDescription className="text-base mt-2 max-w-4xl">
                    Visual trust is essential in healthcare. Upload up to 5 high-quality images of your clinic, operation theater, or reception area to help patients feel comfortable and confident before their visit.
                    <span className="block mt-3 text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                        ✨ Note: Please upload square images (1:1 aspect ratio) for optimal display quality.
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, index) => {
                        const url = clinicImages[index];

                        if (url) {
                            return (
                                <div key={`image-${index}`} className="aspect-square border rounded-3xl bg-muted/20 relative group overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl ring-1 ring-border/50">
                                    <img src={url} alt={`Clinic ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                        <div className="flex items-center justify-between gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest truncate flex-1 drop-shadow-md">Photo {index + 1}</span>
                                            <div className="flex gap-2">
                                                <Button
                                                    title={`View Photo ${index + 1}`}
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-2xl shrink-0 shadow-lg hover:scale-110 active:scale-95 transition-all bg-white/20 hover:bg-white text-white hover:text-black border-none"
                                                    onClick={() => setViewImage(url)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    title={`Remove Photo ${index + 1}`}
                                                    type="button"
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
                                </div>
                            );
                        }

                        return (
                            <label key={`placeholder-${index}`} className={`aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 text-muted-foreground transition-all shadow-xs ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 cursor-pointer group scale-100 hover:scale-[1.03] active:scale-[0.98]'}`}>
                                <input type="file" className="hidden" onChange={handleImageUpload} disabled={saving} accept="image/*" />
                                <div className={`p-5 rounded-2xl bg-primary/10 transition-all duration-300 shadow-lg shadow-primary/10 ${saving ? '' : 'group-hover:bg-primary group-hover:text-primary-foreground'}`}>
                                    <ImagePlus className={`h-10 w-10 transition-colors ${saving ? 'text-primary/70' : 'text-primary/70 group-hover:text-primary-foreground'}`} />
                                </div>
                                <div className="text-center px-4">
                                    <span className="text-sm font-bold block text-foreground">
                                        {saving ? "Uploading..." : "Add Photo"}
                                    </span>
                                    <span className="text-[10px] opacity-70 uppercase tracking-wider font-semibold mt-1 block">
                                        Slot {index + 1}
                                    </span>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <Dialog open={!!viewImage} onOpenChange={(open) => !open && setViewImage(null)}>
                    <DialogContent className="sm:max-w-[600px] p-6 bg-background border shadow-2xl rounded-2xl">
                        <DialogTitle className="sr-only">View Clinic Image</DialogTitle>
                        <div className="relative w-full h-[500px] bg-muted/20 rounded-xl flex items-center justify-center border overflow-hidden">
                            {viewImage && <img src={viewImage} alt="Clinic view" className="w-full h-full object-contain" />}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
