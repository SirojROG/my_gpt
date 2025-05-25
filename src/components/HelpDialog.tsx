import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {HelpCircle, Mail, MessageSquare, Github, Instagram} from "lucide-react";

const HelpDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2" title="Yordam va ma'lumot">
                    <HelpCircle className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center gradient-text">aGPT haqida</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        A'lamov Asadbek tomonidan yaratilgan sun'iy intellekt
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center mb-4">
                    <div className="w-28 h-22 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-3xl gradient-text font-bold"
                              style={{padding: '15px'}}>aGPT</span>
                    </div>
                </div>

                <div className="flex flex-col space-y-3 mt-4">
                    <p className="text-center text-sm text-muted-foreground mb-2">
                        aGPT - bu A'lamov Asadbek tomonidan ishlab chiqilgan ilg'or sun'iy intellekt yordamchisi bo'lib,
                        eng so'nggi AI texnologiyasidan foydalangan holda qo'llab-quvvatlash xizmatlarini taqdim etadi.
                    </p>

                    <h3 className="font-medium text-center">Yaratuvchi bilan bog'lanish</h3>

                    <div className="grid grid-cols-2 gap-2">
                        <a href="mailto:alamovasad@gmail.com" className="w-full" target='_blank'>
                            <Button variant="outline"
                                    className="w-full flex items-center gap-2 justify-center">
                                <Mail className="h-4 w-4"/>
                                <span>Email</span>
                            </Button>
                        </a>

                        <a href="https://telegram.me/alamov_asadbek" className="w-full" target='_blank'>
                            <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                                <MessageSquare className="h-4 w-4"/>
                                <span>Telegram</span>
                            </Button>
                        </a>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                        © {new Date().getFullYear()} A'lamov Asadbek. Barcha huquqlar himoyalangan.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpDialog;
