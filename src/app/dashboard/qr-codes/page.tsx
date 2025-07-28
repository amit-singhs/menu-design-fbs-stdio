'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, PlusCircle, QrCode } from "lucide-react";
import { qrCodes } from "@/app/dashboard/data";

export default function QRCodesPage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    QR Codes
                </h1>
                <Button className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Generate New QR Code
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Existing QR Codes</CardTitle>
                    <CardDescription>Manage and download your generated QR codes.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   {qrCodes.map(code => (
                     <Card key={code.id} className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                           <div className="p-3 rounded-lg bg-primary/10 text-primary">
                             <QrCode className="h-6 w-6" />
                           </div>
                           <div>
                            <CardTitle className="text-base font-medium">{code.name}</CardTitle>
                            <CardDescription>Generated on {code.date}</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg border">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" alt={code.name} />
                            </div>
                        </CardContent>
                        <CardContent className="flex justify-center gap-2">
                             <Button variant="outline" size="sm">
                                <FileDown className="mr-2 h-4 w-4" /> Download
                             </Button>
                             <Button variant="destructive" size="sm">Delete</Button>
                        </CardContent>
                    </Card>
                   ))}
                </CardContent>
            </Card>
        </div>
    )
}
