import { Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SettingsDialog(props:any) {
    const { cursorBubbleEnabled, setCursorBubbleEnabled, bubbleEnabled, setBubbleEnabled } = props;
    const { theme, setTheme } = useTheme();


    return (
        <Dialog>
            {/* YOUR EXISTING SETTINGS ICON BUTTON */}
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 hover:scale-110 transition-transform duration-200"
                >
                    <Settings className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Open settings</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="
                        fixed
                        top-20
                        left-252
                        translate-x-0
                        translate-y-0
                        sm:max-w-[300px]
                    ">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                {/* SETTINGS OPTIONS */}
                <div className="space-y-5 py-2">

                    {/* Bubble feature */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bubble-feature">Floating Bubble</Label>
                        <Switch
                            id="bubble-feature"
                            checked={bubbleEnabled}
                            onCheckedChange={setBubbleEnabled}
                        />
                    </div>

                    {/* Cursor bubble effect */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="cursor-bubble">Cursor Bubble Effect</Label>
                        <Switch
                            id="cursor-bubble"
                            checked={cursorBubbleEnabled}
                            onCheckedChange={setCursorBubbleEnabled}
                        />
                    </div>

                    {/* Dark mode */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <Switch
                            id="dark-mode"
                            checked={theme === "dark"}
                            onCheckedChange={(checked) =>
                                setTheme(checked ? "dark" : "light")
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
